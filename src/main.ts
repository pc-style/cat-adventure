import "./styles.css";
import { cardGuide, ending, intro, levels } from "./story";
import type { CardId, Collectible, Dialogue, Enemy, LevelConfig, Rect } from "./story";

const view = { w: 960, h: 540 };
const gravity = 1500;
const moveSpeed = 250;
const acceleration = 1800;
const friction = 0.82;
const jumpVelocity = -590;
const maxHearts = 5;
const cardIds: CardId[] = ["petal", "ribbon", "lantern", "letter", "cocoa"];

type RuntimeCollectible = Collectible & {
  collected: boolean;
};

type RuntimeEnemy = Enemy & {
  dir: -1 | 1;
  charmedUntil: number;
};

type TempPlatform = Rect & {
  expiresAt: number;
};

type Player = Rect & {
  vx: number;
  vy: number;
  facing: -1 | 1;
  grounded: boolean;
  invulnerableUntil: number;
};

type InputState = {
  left: boolean;
  right: boolean;
  jumpHeld: boolean;
  jumpPressed: boolean;
};

type Toast = {
  text: string;
  until: number;
};

function getElement(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!(element instanceof HTMLElement)) {
    throw new Error(`Missing HTML element #${id}`);
  }
  return element;
}

function getButton(id: string): HTMLButtonElement {
  const element = document.getElementById(id);
  if (!(element instanceof HTMLButtonElement)) {
    throw new Error(`Missing button #${id}`);
  }
  return element;
}

function getDialog(id: string): HTMLDialogElement {
  const element = document.getElementById(id);
  if (!(element instanceof HTMLDialogElement)) {
    throw new Error(`Missing dialog #${id}`);
  }
  return element;
}

function getCanvas(id: string): HTMLCanvasElement {
  const element = document.getElementById(id);
  if (!(element instanceof HTMLCanvasElement)) {
    throw new Error(`Missing canvas #${id}`);
  }
  return element;
}

function isCardId(value: string | undefined): value is CardId {
  return cardIds.some((cardId) => cardId === value);
}

function intersects(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function setChildren(parent: HTMLElement, children: Node[]): void {
  parent.replaceChildren(...children);
}

function paragraph(text: string): HTMLParagraphElement {
  const element = document.createElement("p");
  element.textContent = text;
  return element;
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

class PresentTrailGame {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly chapterLabel = getElement("chapter-label");
  private readonly heartsLabel = getElement("hearts-label");
  private readonly sparkLabel = getElement("spark-label");
  private readonly keepsakeLabel = getElement("keepsake-label");
  private readonly dialog = getDialog("story-dialog");
  private readonly journalDialog = getDialog("journal-dialog");
  private readonly helpDialog = getDialog("help-dialog");
  private readonly dialogKicker = getElement("dialog-kicker");
  private readonly dialogTitle = getElement("dialog-title");
  private readonly dialogBody = getElement("dialog-body");
  private readonly journalBody = getElement("journal-body");
  private readonly cardButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-card]"));
  private readonly input: InputState = { left: false, right: false, jumpHeld: false, jumpPressed: false };
  private levelIndex = 0;
  private level: LevelConfig = levels[0];
  private player: Player = this.createPlayer(levels[0]);
  private collectibles: RuntimeCollectible[] = [];
  private enemies: RuntimeEnemy[] = [];
  private tempPlatforms: TempPlatform[] = [];
  private seenStory = new Set<string>();
  private collectedLabels: string[] = [];
  private completedChapters: string[] = [];
  private sparks = 2;
  private hearts = maxHearts;
  private cameraX = 0;
  private lastTime = 0;
  private finished = false;
  private selectedCard: CardId = "petal";
  private toast: Toast | null = null;
  private cardUsedAt: Record<CardId, number> = {
    petal: -Infinity,
    ribbon: -Infinity,
    lantern: -Infinity,
    letter: -Infinity,
    cocoa: -Infinity,
  };

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas 2D context is not available");
    }
    this.ctx = context;
    this.bindUi();
    this.resetGame();
    window.requestAnimationFrame((time) => this.tick(time));
    window.setTimeout(() => this.showDialogue(intro), 200);
  }

  private createPlayer(level: LevelConfig): Player {
    return {
      x: level.spawn.x,
      y: level.spawn.y,
      w: 34,
      h: 50,
      vx: 0,
      vy: 0,
      facing: 1,
      grounded: false,
      invulnerableUntil: 0,
    };
  }

  private bindUi(): void {
    window.addEventListener("keydown", (event) => this.handleKey(event, true));
    window.addEventListener("keyup", (event) => this.handleKey(event, false));

    getButton("new-game-button").addEventListener("click", () => {
      this.resetGame();
      this.showDialogue(intro);
    });
    getButton("journal-button").addEventListener("click", () => this.openJournal());
    getButton("help-button").addEventListener("click", () => this.helpDialog.showModal());

    this.cardButtons.forEach((button) => {
      const card = button.dataset.card;
      if (!isCardId(card)) {
        return;
      }
      button.addEventListener("click", () => {
        this.selectedCard = card;
        this.useCard(card, performance.now());
      });
    });

    document.querySelectorAll<HTMLButtonElement>("[data-touch]").forEach((button) => {
      const action = button.dataset.touch;
      button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        this.setTouchAction(action, true);
      });
      button.addEventListener("pointerup", () => this.setTouchAction(action, false));
      button.addEventListener("pointercancel", () => this.setTouchAction(action, false));
      button.addEventListener("pointerleave", () => this.setTouchAction(action, false));
    });
  }

  private handleKey(event: KeyboardEvent, pressed: boolean): void {
    const key = event.key.toLowerCase();
    const gameKey =
      key === "arrowleft" ||
      key === "a" ||
      key === "arrowright" ||
      key === "d" ||
      key === "arrowup" ||
      key === "w" ||
      key === " " ||
      ["1", "2", "3", "4", "5"].includes(key);

    if (gameKey) {
      event.preventDefault();
    }

    if (key === "arrowleft" || key === "a") {
      this.input.left = pressed;
    }
    if (key === "arrowright" || key === "d") {
      this.input.right = pressed;
    }
    if (key === "arrowup" || key === "w" || key === " ") {
      if (pressed && !this.input.jumpHeld) {
        this.input.jumpPressed = true;
      }
      this.input.jumpHeld = pressed;
    }
    if (pressed) {
      const index = Number.parseInt(key, 10) - 1;
      const card = cardIds[index];
      if (card) {
        this.selectedCard = card;
        this.useCard(card, performance.now());
      }
    }
  }

  private setTouchAction(action: string | undefined, pressed: boolean): void {
    if (action === "left") {
      this.input.left = pressed;
    }
    if (action === "right") {
      this.input.right = pressed;
    }
    if (action === "jump") {
      if (pressed && !this.input.jumpHeld) {
        this.input.jumpPressed = true;
      }
      this.input.jumpHeld = pressed;
    }
    if (action === "card" && pressed) {
      this.useCard(this.selectedCard, performance.now());
    }
  }

  private resetGame(): void {
    this.levelIndex = 0;
    this.sparks = 2;
    this.hearts = maxHearts;
    this.finished = false;
    this.seenStory.clear();
    this.collectedLabels = [];
    this.completedChapters = [];
    this.cardUsedAt = {
      petal: -Infinity,
      ribbon: -Infinity,
      lantern: -Infinity,
      letter: -Infinity,
      cocoa: -Infinity,
    };
    this.loadLevel(0);
    this.setToast("The trail starts over by the window.", 2200);
  }

  private loadLevel(index: number): void {
    this.levelIndex = index;
    this.level = levels[index];
    this.player = this.createPlayer(this.level);
    this.collectibles = this.level.collectibles.map((item) => ({ ...item, collected: false }));
    this.enemies = this.level.enemies.map((enemy) => ({ ...enemy, dir: enemy.speed >= 0 ? 1 : -1, charmedUntil: 0 }));
    this.tempPlatforms = [];
    this.cameraX = 0;
    this.updateHud();
  }

  private tick(time: number): void {
    const dt = Math.min((time - this.lastTime) / 1000 || 0, 0.033);
    this.lastTime = time;
    const paused = this.dialog.open || this.journalDialog.open || this.helpDialog.open;
    if (!paused) {
      this.update(dt, time);
    }
    this.draw(time);
    window.requestAnimationFrame((nextTime) => this.tick(nextTime));
  }

  private update(dt: number, now: number): void {
    if (this.input.left) {
      this.player.vx -= acceleration * dt;
      this.player.facing = -1;
    }
    if (this.input.right) {
      this.player.vx += acceleration * dt;
      this.player.facing = 1;
    }
    if (!this.input.left && !this.input.right) {
      this.player.vx *= friction;
    }
    this.player.vx = clamp(this.player.vx, -moveSpeed, moveSpeed);

    if (this.input.jumpPressed && this.player.grounded) {
      this.player.vy = jumpVelocity;
      this.player.grounded = false;
    }
    this.input.jumpPressed = false;

    this.player.vy += gravity * dt;
    this.movePlayer(this.player.vx * dt, this.player.vy * dt);
    this.updateEnemies(dt, now);
    this.collectItems();
    this.triggerStoryBeats();
    this.checkHazards(now);
    this.checkExit();
    this.tempPlatforms = this.tempPlatforms.filter((platform) => platform.expiresAt > now);
    this.cameraX = clamp(this.player.x - view.w * 0.42, 0, Math.max(0, this.level.width - view.w));
    this.updateHud(now);
  }

  private allPlatforms(): Rect[] {
    return [...this.level.platforms, ...this.tempPlatforms];
  }

  private movePlayer(dx: number, dy: number): void {
    this.player.x += dx;
    for (const platform of this.allPlatforms()) {
      if (!intersects(this.player, platform)) {
        continue;
      }
      if (dx > 0) {
        this.player.x = platform.x - this.player.w;
      } else if (dx < 0) {
        this.player.x = platform.x + platform.w;
      }
      this.player.vx = 0;
    }

    this.player.grounded = false;
    this.player.y += dy;
    for (const platform of this.allPlatforms()) {
      if (!intersects(this.player, platform)) {
        continue;
      }
      if (dy > 0) {
        this.player.y = platform.y - this.player.h;
        this.player.vy = 0;
        this.player.grounded = true;
      } else if (dy < 0) {
        this.player.y = platform.y + platform.h;
        this.player.vy = 0;
      }
    }

    this.player.x = clamp(this.player.x, 0, this.level.width - this.player.w);
    if (this.player.y > view.h + 160) {
      this.damagePlayer(performance.now(), "A soft cloud returns you to the last safe path.");
    }
  }

  private updateEnemies(dt: number, now: number): void {
    for (const enemy of this.enemies) {
      if (enemy.charmedUntil <= now) {
        enemy.x += enemy.speed * enemy.dir * dt;
        if (enemy.x < enemy.minX) {
          enemy.x = enemy.minX;
          enemy.dir = 1;
        }
        if (enemy.x + enemy.w > enemy.maxX) {
          enemy.x = enemy.maxX - enemy.w;
          enemy.dir = -1;
        }
      }

      if (!intersects(this.player, enemy)) {
        continue;
      }
      const playerBottom = this.player.y + this.player.h;
      if (this.player.vy > 0 && playerBottom - enemy.y < 22) {
        enemy.charmedUntil = now + 3500;
        this.player.vy = jumpVelocity * 0.58;
        this.setToast("The thorn grumbles, then politely takes a nap.", 1800);
      } else if (enemy.charmedUntil <= now) {
        this.damagePlayer(now, "A grumpy thorn bumped into you.");
      }
    }
  }

  private collectItems(): void {
    for (const item of this.collectibles) {
      if (item.collected || !intersects(this.player, { x: item.x - 14, y: item.y - 14, w: 28, h: 28 })) {
        continue;
      }
      item.collected = true;
      if (item.kind === "spark") {
        this.sparks += 1;
        this.setToast(`Collected ${item.label}.`, 1400);
      } else {
        this.collectedLabels.push(item.label);
        this.setToast(`Keepsake found: ${item.label}.`, 1800);
      }
    }
  }

  private triggerStoryBeats(): void {
    for (const beat of this.level.storyBeats) {
      if (this.seenStory.has(beat.id) || !intersects(this.player, beat)) {
        continue;
      }
      this.seenStory.add(beat.id);
      this.showDialogue(beat);
      break;
    }
  }

  private checkHazards(now: number): void {
    for (const hazard of this.level.hazards) {
      if (intersects(this.player, hazard)) {
        this.damagePlayer(now, "The brambles pricked your boots.");
        return;
      }
    }
  }

  private checkExit(): void {
    if (this.finished) {
      return;
    }
    if (!intersects(this.player, this.level.exit)) {
      return;
    }
    const found = this.currentKeepsakes();
    if (found < this.level.requiredKeepsakes) {
      const missing = this.level.requiredKeepsakes - found;
      this.setToast(`${this.level.exit.label} needs ${missing} more keepsake${missing === 1 ? "" : "s"}.`, 1800);
      this.player.x = this.level.exit.x - 70;
      return;
    }
    if (!this.completedChapters.includes(this.level.title)) {
      this.completedChapters.push(this.level.title);
    }
    if (this.levelIndex === levels.length - 1) {
      this.finished = true;
      this.showDialogue(ending);
      this.setToast("The trail is complete.", 3000);
      return;
    }
    this.loadLevel(this.levelIndex + 1);
    const next = levels[this.levelIndex];
    this.showDialogue({
      kicker: "A ribbon gate opens",
      title: next.title,
      paragraphs: [next.subtitle, "The card deck shuffles itself, trying very hard to look mysterious."],
    });
  }

  private useCard(card: CardId, now: number): void {
    const guide = cardGuide[card];
    if (now - this.cardUsedAt[card] < guide.cooldown) {
      this.setToast(`${guide.name} is still catching its breath.`, 1100);
      return;
    }
    if (card === "cocoa" && this.hearts >= maxHearts) {
      this.setToast("Your hearts are already full.", 1300);
      return;
    }
    if (this.sparks < guide.cost) {
      this.setToast(`${guide.name} needs ${guide.cost} spark${guide.cost === 1 ? "" : "s"}.`, 1300);
      return;
    }

    const spent = (): void => {
      this.sparks -= guide.cost;
      this.cardUsedAt[card] = now;
    };

    if (card === "petal") {
      spent();
      this.player.vy = jumpVelocity * 0.9;
      this.player.grounded = false;
      this.setToast("Petals lift you up.", 1000);
      return;
    }
    if (card === "ribbon") {
      spent();
      this.player.vx = this.player.facing * 540;
      this.player.invulnerableUntil = now + 420;
      this.setToast("Ribbon dash.", 1000);
      return;
    }
    if (card === "lantern") {
      spent();
      const x = clamp(this.player.x + this.player.facing * 92, 20, this.level.width - 170);
      const y = clamp(this.player.y + 58, 170, 470);
      this.tempPlatforms.push({ x, y, w: 170, h: 24, expiresAt: now + 6200 });
      this.setToast("A lantern bridge appears for a few seconds.", 1600);
      return;
    }
    if (card === "letter") {
      const nearby = this.enemies.filter((enemy) => Math.abs(enemy.x - this.player.x) < 260);
      if (nearby.length === 0) {
        this.setToast("No thorn is close enough to read the letter.", 1300);
        return;
      }
      spent();
      nearby.forEach((enemy) => {
        enemy.charmedUntil = now + 5200;
      });
      this.setToast("The letter charms nearby thorns.", 1600);
      return;
    }
    if (card === "cocoa") {
      spent();
      this.hearts = Math.min(maxHearts, this.hearts + 1);
      this.setToast("A cocoa heart warms you back up.", 1500);
    }
  }

  private damagePlayer(now: number, reason: string): void {
    if (this.player.invulnerableUntil > now) {
      return;
    }
    this.hearts -= 1;
    this.player.invulnerableUntil = now + 1500;
    this.player.vx = -this.player.facing * 180;
    this.player.vy = jumpVelocity * 0.42;
    this.setToast(reason, 1600);
    if (this.hearts <= 0) {
      this.hearts = maxHearts;
      this.player = this.createPlayer(this.level);
      this.tempPlatforms = [];
      this.setToast("The trail gives you a fresh breath at the chapter start.", 2400);
    }
  }

  private currentKeepsakes(): number {
    return this.collectibles.filter((item) => item.kind === "keepsake" && item.collected).length;
  }

  private updateHud(now = performance.now()): void {
    this.chapterLabel.textContent = `${this.levelIndex + 1}. ${this.level.title}`;
    this.heartsLabel.textContent = `${this.hearts} / ${maxHearts}`;
    this.sparkLabel.textContent = String(this.sparks);
    this.keepsakeLabel.textContent = `${this.currentKeepsakes()} / ${this.level.requiredKeepsakes}`;

    this.cardButtons.forEach((button) => {
      const card = button.dataset.card;
      if (!isCardId(card)) {
        return;
      }
      const guide = cardGuide[card];
      const coolingDown = now - this.cardUsedAt[card] < guide.cooldown;
      const notEnoughSparks = this.sparks < guide.cost;
      const uselessCocoa = card === "cocoa" && this.hearts >= maxHearts;
      button.disabled = coolingDown || notEnoughSparks || uselessCocoa;
      button.ariaPressed = String(this.selectedCard === card);
      button.title = `${guide.name}. Cost: ${guide.cost} spark${guide.cost === 1 ? "" : "s"}. ${guide.short}.`;
    });
  }

  private showDialogue(dialogue: Dialogue): void {
    this.dialogKicker.textContent = dialogue.kicker;
    this.dialogTitle.textContent = dialogue.title;
    setChildren(
      this.dialogBody,
      dialogue.paragraphs.map((line) => paragraph(line)),
    );
    if (!this.dialog.open) {
      this.dialog.showModal();
    }
  }

  private openJournal(): void {
    const entries: Node[] = [];

    const progress = document.createElement("section");
    progress.className = "journal-entry";
    const progressTitle = document.createElement("h3");
    progressTitle.textContent = "Progress";
    progress.append(progressTitle);
    progress.append(
      paragraph(
        this.completedChapters.length === 0
          ? "No chapter gates are complete yet."
          : `Completed chapters: ${this.completedChapters.join(", ")}.`,
      ),
    );
    entries.push(progress);

    const keepsakes = document.createElement("section");
    keepsakes.className = "journal-entry";
    const keepsakeTitle = document.createElement("h3");
    keepsakeTitle.textContent = "Keepsakes";
    keepsakes.append(keepsakeTitle);
    keepsakes.append(
      paragraph(
        this.collectedLabels.length === 0
          ? "No keepsakes yet. The first one is waiting near the meadow platforms."
          : this.collectedLabels.join(", "),
      ),
    );
    entries.push(keepsakes);

    const cards = document.createElement("section");
    cards.className = "journal-entry";
    const cardsTitle = document.createElement("h3");
    cardsTitle.textContent = "Card deck";
    cards.append(cardsTitle);
    for (const card of cardIds) {
      cards.append(paragraph(`${cardGuide[card].name}: ${cardGuide[card].journal}`));
    }
    entries.push(cards);

    setChildren(this.journalBody, entries);
    this.journalDialog.showModal();
  }

  private setToast(text: string, duration: number): void {
    this.toast = { text, until: performance.now() + duration };
  }

  private draw(now: number): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, view.w, view.h);
    this.drawBackground();
    this.drawPlatforms();
    this.drawHazards();
    this.drawCollectibles(now);
    this.drawExit(now);
    this.drawEnemies(now);
    this.drawPlayer(now);
    this.drawOverlay(now);
  }

  private drawBackground(): void {
    const ctx = this.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, view.h);
    gradient.addColorStop(0, this.level.skyTop);
    gradient.addColorStop(1, this.level.skyBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, view.w, view.h);

    ctx.save();
    ctx.translate(-this.cameraX * 0.18, 0);
    ctx.fillStyle = this.level.hillColor;
    for (let x = -240; x < this.level.width + 600; x += 320) {
      ctx.beginPath();
      ctx.ellipse(x + 120, 442, 230, 92, 0, Math.PI, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.translate(-this.cameraX * 0.38, 0);
    ctx.fillStyle = "rgb(255 255 255 / 0.56)";
    for (let x = 40; x < this.level.width + 400; x += 620) {
      roundedRect(ctx, x, 82, 130, 28, 18);
      ctx.fill();
      roundedRect(ctx, x + 52, 58, 92, 34, 18);
      ctx.fill();
    }
    ctx.restore();
  }

  private drawPlatforms(): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.cameraX, 0);
    for (const platform of this.level.platforms) {
      ctx.fillStyle = this.level.groundColor;
      roundedRect(ctx, platform.x, platform.y, platform.w, platform.h, 12);
      ctx.fill();
      ctx.fillStyle = "rgb(255 255 255 / 0.16)";
      roundedRect(ctx, platform.x + 8, platform.y + 6, platform.w - 16, 8, 8);
      ctx.fill();
    }
    for (const platform of this.tempPlatforms) {
      ctx.fillStyle = "rgb(255 212 121 / 0.78)";
      roundedRect(ctx, platform.x, platform.y, platform.w, platform.h, 12);
      ctx.fill();
      ctx.strokeStyle = "rgb(255 255 255 / 0.78)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawHazards(): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.cameraX, 0);
    for (const hazard of this.level.hazards) {
      ctx.fillStyle = "#59344d";
      for (let x = hazard.x; x < hazard.x + hazard.w; x += 18) {
        ctx.beginPath();
        ctx.moveTo(x, hazard.y + hazard.h);
        ctx.lineTo(x + 9, hazard.y);
        ctx.lineTo(x + 18, hazard.y + hazard.h);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.restore();
  }

  private drawCollectibles(now: number): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.cameraX, 0);
    for (const item of this.collectibles) {
      if (item.collected) {
        continue;
      }
      const bob = Math.sin(now / 260 + item.x) * 4;
      ctx.save();
      ctx.translate(item.x, item.y + bob);
      if (item.kind === "spark") {
        ctx.fillStyle = "#fff4a8";
        ctx.beginPath();
        for (let i = 0; i < 8; i += 1) {
          const angle = (Math.PI * 2 * i) / 8;
          const radius = i % 2 === 0 ? 13 : 6;
          ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = this.level.accentColor;
        ctx.beginPath();
        ctx.moveTo(0, 14);
        ctx.bezierCurveTo(-22, -2, -14, -22, 0, -10);
        ctx.bezierCurveTo(14, -22, 22, -2, 0, 14);
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
  }

  private drawExit(now: number): void {
    const ctx = this.ctx;
    const gate = this.level.exit;
    ctx.save();
    ctx.translate(-this.cameraX, 0);
    const pulse = 0.65 + Math.sin(now / 320) * 0.12;
    ctx.fillStyle = `rgb(255 212 121 / ${pulse})`;
    roundedRect(ctx, gate.x, gate.y, gate.w, gate.h, 22);
    ctx.fill();
    ctx.fillStyle = "#3b234f";
    roundedRect(ctx, gate.x + 16, gate.y + 18, gate.w - 32, gate.h - 18, 16);
    ctx.fill();
    ctx.fillStyle = "#fff7ec";
    ctx.font = "700 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(gate.label, gate.x + gate.w / 2, gate.y - 12);
    ctx.restore();
  }

  private drawEnemies(now: number): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.cameraX, 0);
    for (const enemy of this.enemies) {
      const charmed = enemy.charmedUntil > now;
      ctx.fillStyle = charmed ? "#91e7c4" : "#5a2744";
      roundedRect(ctx, enemy.x, enemy.y, enemy.w, enemy.h, 15);
      ctx.fill();
      ctx.fillStyle = "#fff7ec";
      ctx.beginPath();
      ctx.arc(enemy.x + 14, enemy.y + 15, 4, 0, Math.PI * 2);
      ctx.arc(enemy.x + 29, enemy.y + 15, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = charmed ? "#ff8fb3" : "#ffd479";
      ctx.fillRect(enemy.x + 10, enemy.y + 30, 24, 4);
    }
    ctx.restore();
  }

  private drawPlayer(now: number): void {
    const ctx = this.ctx;
    const flash = this.player.invulnerableUntil > now && Math.floor(now / 90) % 2 === 0;
    if (flash) {
      return;
    }
    ctx.save();
    ctx.translate(-this.cameraX, 0);
    ctx.fillStyle = "#ffe0ed";
    roundedRect(ctx, this.player.x, this.player.y, this.player.w, this.player.h, 16);
    ctx.fill();
    ctx.fillStyle = "#ff8fb3";
    roundedRect(ctx, this.player.x + 5, this.player.y - 8, 24, 14, 8);
    ctx.fill();
    ctx.fillStyle = "#40235d";
    const eyeX = this.player.facing === 1 ? this.player.x + 23 : this.player.x + 11;
    ctx.beginPath();
    ctx.arc(eyeX, this.player.y + 18, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#85c8ff";
    ctx.fillRect(this.player.x + 9, this.player.y + 32, 16, 5);
    ctx.restore();
  }

  private drawOverlay(now: number): void {
    const ctx = this.ctx;
    ctx.fillStyle = "rgb(20 12 38 / 0.62)";
    roundedRect(ctx, 18, 18, 360, 74, 22);
    ctx.fill();
    ctx.fillStyle = "#fff7ec";
    ctx.font = "800 22px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(this.level.title, 36, 48);
    ctx.font = "500 14px sans-serif";
    ctx.fillStyle = "rgb(255 247 236 / 0.78)";
    ctx.fillText(this.level.subtitle, 36, 72);

    if (this.toast && this.toast.until > now) {
      ctx.fillStyle = "rgb(20 12 38 / 0.78)";
      roundedRect(ctx, 230, 455, 500, 52, 24);
      ctx.fill();
      ctx.fillStyle = "#ffd479";
      ctx.font = "800 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(this.toast.text, view.w / 2, 487);
    }
  }
}

const canvas = getCanvas("game-canvas");
new PresentTrailGame(canvas);
