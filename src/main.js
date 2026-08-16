const cardInfo = {
  jump: { name: 'Ribbon Leap', short: 'Higher jump', color: '#ffd166' },
  dash: { name: 'Starlight Dash', short: 'Quick burst', color: '#8ecae6' },
  charm: { name: 'Sweet Charm', short: 'Talk to friends', color: '#ffafcc' },
  shield: { name: 'Velvet Courage', short: 'Final quest card', color: '#cdb4db' },
};

const scenes = [
  { id: 'meadow', name: 'Chapter 1 — Buttonbell Meadow', sky: '#bde0fe', accent: '#ffafcc', goal: 'Find the picnic ribbon and ask the snail what it saw.', story: 'The trail begins where tiny bells ring whenever someone says something kind. A ribbon floats above the daisies, tied to the first clue.', platforms: [{ x: 0, y: 520, w: 980, h: 80, kind: 'ground' }, { x: 150, y: 420, w: 160, h: 20, kind: 'cloud' }, { x: 380, y: 350, w: 160, h: 20, kind: 'cloud' }, { x: 640, y: 430, w: 180, h: 20, kind: 'cloud' }], collectibles: [{ x: 420, y: 305, card: 'jump', title: 'Picnic Ribbon', text: 'A note says: “Every adventure starts with your laugh. Follow the crumbs of our favorite days.”' }], npcs: [{ x: 720, y: 386, name: 'Snail Postmaster', lines: ['I delivered a tiny envelope to the bakery chimney.', 'It smelled like cinnamon and a secret plan.'] }] },
  { id: 'bakery', name: 'Chapter 2 — Cinnamon Roofs', sky: '#ffc8dd', accent: '#fb8500', goal: 'Dash over the oven vents and collect the sugar-star card.', story: 'Warm rooftops curl like pastries. The baker-cat hides a sparkling card in the steam, because love notes taste better with courage.', platforms: [{ x: 0, y: 520, w: 980, h: 80, kind: 'ground' }, { x: 120, y: 455, w: 130, h: 20, kind: 'bridge' }, { x: 330, y: 390, w: 130, h: 20, kind: 'bridge' }, { x: 560, y: 335, w: 160, h: 20, kind: 'bridge' }, { x: 770, y: 450, w: 130, h: 20, kind: 'bridge' }], collectibles: [{ x: 610, y: 290, card: 'dash', title: 'Sugar-Star', text: 'The sugar-star whispers: “Race toward the shelf where we keep memories, not things.”' }], npcs: [{ x: 180, y: 412, name: 'Baker Cat', lines: ['The present is not in the oven, but I warmed the next clue.', 'Take the library bridge before the frosting moon rises.'] }] },
  { id: 'library', name: 'Chapter 3 — Lantern Library', sky: '#d8e2dc', accent: '#6d597a', goal: 'Use charm to hear the books and gather the bookmark clue.', story: 'Books flutter open when greeted politely. Each page remembers a small moment: a movie night, a shared snack, a silly song.', platforms: [{ x: 0, y: 520, w: 980, h: 80, kind: 'ground' }, { x: 85, y: 430, w: 175, h: 20, kind: 'bridge' }, { x: 330, y: 360, w: 180, h: 20, kind: 'bridge' }, { x: 590, y: 410, w: 155, h: 20, kind: 'bridge' }, { x: 790, y: 315, w: 120, h: 20, kind: 'bridge' }], collectibles: [{ x: 820, y: 270, card: 'charm', title: 'Pressed-Flower Bookmark', text: 'Inside is written: “The final door opens with all the clues and one brave yes.”' }], npcs: [{ x: 382, y: 317, name: 'Lantern Book', lines: ['Ahem. I only speak to adventurers carrying a Sweet Charm.', 'The moon garden keeps the last guardian, but it adores sincerity.'] }] },
  { id: 'moon', name: 'Final Chapter — Moonlit Gift Garden', sky: '#1d3557', accent: '#f1fa8c', goal: 'Collect Velvet Courage and reach the glowing present gate.', story: 'The garden is quiet enough to hear a heartbeat. Fireflies arrange themselves into an arrow pointing to the real-world surprise.', platforms: [{ x: 0, y: 520, w: 980, h: 80, kind: 'ground' }, { x: 115, y: 455, w: 145, h: 20, kind: 'cloud' }, { x: 345, y: 385, w: 145, h: 20, kind: 'cloud' }, { x: 575, y: 330, w: 145, h: 20, kind: 'cloud' }, { x: 795, y: 430, w: 145, h: 20, kind: 'cloud' }], collectibles: [{ x: 605, y: 285, card: 'shield', title: 'Velvet Courage', text: 'A final promise: “Your present waits where this game ends. Thank you for being my favorite quest.”' }], npcs: [{ x: 850, y: 388, name: 'Firefly Guardian', lines: ['You gathered every clue with a brave little heart.', 'Step into the glowing gate. The real present is ready.'] }] },
];

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
const chapter = document.querySelector('#chapter');
const goal = document.querySelector('#goal');
const message = document.querySelector('#message');
const cardsEl = document.querySelector('#cards');
const keys = new Set();
const world = structuredClone(scenes);
let sceneIndex = 0;
let cards = [];
let started = false;
let won = false;
let frame = 0;
let player = { x: 40, y: 420, vx: 0, vy: 0, w: 34, h: 44, grounded: false, facing: 1, invincible: 0 };

function setMessage(text) { message.textContent = `${won ? '🎁' : '💌'} ${text}`; }
function renderHud() {
  const scene = world[sceneIndex];
  chapter.textContent = scene.name;
  goal.textContent = scene.goal;
  cardsEl.innerHTML = Object.entries(cardInfo).map(([key, card]) => `<article class="${cards.includes(key) ? 'owned' : ''}" style="--card:${card.color}"><h3>${card.name}</h3><p>${card.short}</p></article>`).join('');
}

function update(current) {
  const left = keys.has('a') || keys.has('arrowleft');
  const right = keys.has('d') || keys.has('arrowright');
  const jump = keys.has(' ') || keys.has('w') || keys.has('arrowup');
  const dash = keys.has('shift');
  const speed = cards.includes('dash') ? 5.2 : 4.2;
  player.vx = left ? -speed : right ? speed : player.vx * 0.75;
  if (left) player.facing = -1;
  if (right) player.facing = 1;
  if (jump && player.grounded) { player.vy = cards.includes('jump') ? -14.5 : -12; player.grounded = false; }
  if (dash && cards.includes('dash') && player.invincible <= 0) { player.vx += player.facing * 8; player.invincible = 42; }
  player.vy += 0.65; player.invincible--; player.x = Math.max(0, Math.min(946, player.x + player.vx)); player.y += player.vy; player.grounded = false;
  for (const platform of current.platforms) if (player.x < platform.x + platform.w && player.x + player.w > platform.x && player.y + player.h > platform.y && player.y + player.h < platform.y + platform.h + 18 && player.vy >= 0) { player.y = platform.y - player.h; player.vy = 0; player.grounded = true; }
  if (player.y > 620) { player = { ...player, x: 40, y: 420, vx: 0, vy: 0 }; setMessage('A soft magic bubble carried you back. Try the platforms again!'); }
  for (const item of current.collectibles) if (!item.taken && Math.abs(player.x - item.x) < 45 && Math.abs(player.y - item.y) < 55) { item.taken = true; if (!cards.includes(item.card)) cards.push(item.card); setMessage(`${item.title}: ${item.text}`); renderHud(); }
  for (const npc of current.npcs) if (Math.abs(player.x - npc.x) < 55 && Math.abs(player.y - npc.y) < 70 && !npc.spoken) { if (current.id === 'library' && !cards.includes('charm')) continue; npc.spoken = true; setMessage(`${npc.name}: ${npc.lines.join(' ')}`); }
  if (player.x > 920) {
    if (!current.collectibles.every((item) => item.taken)) setMessage('The gate glows, but it wants the chapter card first.');
    else if (sceneIndex < world.length - 1) { player = { ...player, x: 35, y: 420, vx: 0, vy: 0 }; sceneIndex++; setMessage('A tiny gate opens into the next chapter.'); renderHud(); }
    else { won = true; setMessage('You reached the real present gate! Time to give her the actual surprise.'); renderHud(); }
  }
}

function draw(current) {
  ctx.clearRect(0, 0, 980, 600); ctx.fillStyle = current.sky; ctx.fillRect(0, 0, 980, 600); ctx.globalAlpha = 0.25;
  for (let i = 0; i < 20; i++) { ctx.fillStyle = i % 2 ? '#fff' : current.accent; ctx.beginPath(); ctx.arc((i * 83 + frame * 0.2) % 1020 - 20, 70 + (i % 5) * 45, 12 + (i % 3) * 4, 0, Math.PI * 2); ctx.fill(); }
  ctx.globalAlpha = 1;
  for (const platform of current.platforms) { ctx.fillStyle = platform.kind === 'ground' ? '#7f5539' : platform.kind === 'bridge' ? '#b08968' : '#fff1f7'; round(platform.x, platform.y, platform.w, platform.h, 12); ctx.fill(); ctx.fillStyle = platform.kind === 'ground' ? '#95d5b2' : current.accent; ctx.fillRect(platform.x, platform.y, platform.w, 5); }
  for (const item of current.collectibles.filter((i) => !i.taken)) { ctx.fillStyle = cardInfo[item.card].color; round(item.x, item.y, 34, 46, 6); ctx.fill(); ctx.strokeStyle = '#3d405b'; ctx.strokeRect(item.x + 5, item.y + 5, 24, 36); }
  for (const npc of current.npcs) { ctx.fillStyle = '#3d405b'; round(npc.x, npc.y, 38, 38, 18); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillText('!', npc.x + 16, npc.y - 8); }
  ctx.fillStyle = player.invincible > 0 ? '#f1fa8c' : '#ffcad4'; round(player.x, player.y, player.w, player.h, 10); ctx.fill(); ctx.fillStyle = '#3d405b'; ctx.fillRect(player.x + (player.facing > 0 ? 22 : 8), player.y + 13, 4, 4);
  ctx.fillStyle = '#ffcad4'; ctx.beginPath(); ctx.moveTo(player.x + 5, player.y + 4); ctx.lineTo(player.x + 12, player.y - 9); ctx.lineTo(player.x + 19, player.y + 4); ctx.fill(); ctx.beginPath(); ctx.moveTo(player.x + 17, player.y + 4); ctx.lineTo(player.x + 25, player.y - 9); ctx.lineTo(player.x + 31, player.y + 4); ctx.fill();
  ctx.fillStyle = current.accent; round(920, 440, 42, 80, 18); ctx.fill(); frame++;
}
function loop() { const current = world[sceneIndex]; if (started && !won) update(current); draw(current); requestAnimationFrame(loop); }
function round(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

window.addEventListener('keydown', (event) => { keys.add(event.key.toLowerCase()); if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(event.key.toLowerCase())) event.preventDefault(); });
window.addEventListener('keyup', (event) => keys.delete(event.key.toLowerCase()));
document.querySelector('#start').addEventListener('click', () => { started = true; setMessage(world[sceneIndex].story); canvas.focus(); });
document.querySelector('#reset').addEventListener('click', () => location.reload());
renderHud(); setMessage('Press Start, then move with A/D or arrows. Jump with Space. Use Shift to dash once you find it.'); loop();
