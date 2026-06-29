export type CardId = "petal" | "ribbon" | "lantern" | "letter" | "cocoa";

export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type Point = {
  x: number;
  y: number;
};

export type Dialogue = {
  kicker: string;
  title: string;
  paragraphs: string[];
};

export type Collectible = Point & {
  id: string;
  kind: "spark" | "keepsake";
  label: string;
};

export type StoryBeat = Rect &
  Dialogue & {
    id: string;
  };

export type Enemy = Rect & {
  id: string;
  minX: number;
  maxX: number;
  speed: number;
};

export type LevelConfig = {
  id: string;
  title: string;
  subtitle: string;
  skyTop: string;
  skyBottom: string;
  hillColor: string;
  groundColor: string;
  accentColor: string;
  spawn: Point;
  width: number;
  requiredKeepsakes: number;
  exit: Rect & { label: string };
  platforms: Rect[];
  hazards: Rect[];
  enemies: Enemy[];
  collectibles: Collectible[];
  storyBeats: StoryBeat[];
};

export const cardGuide: Record<
  CardId,
  { name: string; cost: number; cooldown: number; short: string; journal: string }
> = {
  petal: {
    name: "Petal hop",
    cost: 0,
    cooldown: 900,
    short: "A soft extra jump",
    journal: "A peach petal that remembers every time she made a hard day lighter.",
  },
  ribbon: {
    name: "Ribbon dash",
    cost: 1,
    cooldown: 1100,
    short: "A quick burst forward",
    journal: "A red ribbon that pulls courage out of small pockets.",
  },
  lantern: {
    name: "Lantern bridge",
    cost: 2,
    cooldown: 1800,
    short: "Places a short magic step",
    journal: "A lantern that makes a path when the trail forgets to be kind.",
  },
  letter: {
    name: "Love letter",
    cost: 2,
    cooldown: 1600,
    short: "Charms thorns",
    journal: "A folded note. The handwriting is messy because the writer was smiling.",
  },
  cocoa: {
    name: "Cocoa heart",
    cost: 3,
    cooldown: 2200,
    short: "Restores one heart",
    journal: "A warm cup for the brave traveler who deserves to rest.",
  },
};

export const intro: Dialogue = {
  kicker: "The envelope by the window",
  title: "A trail appears in the morning light",
  paragraphs: [
    "A tiny envelope waits on the sill. It is tied with a red ribbon and addressed to the girl who turns ordinary rooms into safe places.",
    "Inside is a card with five hand-drawn places. At the end of the trail, the actual present waits in the real world.",
    "The card also says one thing in very serious ink. Take the cute spells. Trust the little lights. Follow every ribbon.",
  ],
};

export const ending: Dialogue = {
  kicker: "The last ribbon",
  title: "The present clue",
  paragraphs: [
    "The final gate opens onto a blanket under paper stars. Every keepsake hums once, like it has been waiting to say thank you.",
    "The real present is ready now. Look for the envelope with the little moon sticker. If you want a clearer clue later, edit the finale text in src/story.ts.",
    "For now, the trail leaves one last message. You are loved in the quiet ways, the silly ways, and the every-day ways.",
  ],
};

export const levels: LevelConfig[] = [
  {
    id: "meadow-post",
    title: "Meadow post",
    subtitle: "The first ribbon flutters beside a sleepy mailbox.",
    skyTop: "#9fd8ff",
    skyBottom: "#ffe0ed",
    hillColor: "#8bd6a5",
    groundColor: "#4f9b72",
    accentColor: "#ff8fb3",
    spawn: { x: 72, y: 390 },
    width: 3100,
    requiredKeepsakes: 3,
    exit: { x: 2940, y: 404, w: 72, h: 96, label: "Ribbon gate" },
    platforms: [
      { x: 0, y: 500, w: 3100, h: 80 },
      { x: 260, y: 410, w: 210, h: 28 },
      { x: 600, y: 350, w: 190, h: 28 },
      { x: 980, y: 420, w: 220, h: 28 },
      { x: 1350, y: 330, w: 240, h: 28 },
      { x: 1800, y: 390, w: 240, h: 28 },
      { x: 2250, y: 340, w: 210, h: 28 },
      { x: 2600, y: 430, w: 220, h: 28 },
    ],
    hazards: [
      { x: 820, y: 478, w: 110, h: 22 },
      { x: 1610, y: 478, w: 130, h: 22 },
      { x: 2470, y: 478, w: 120, h: 22 },
    ],
    enemies: [
      { id: "grumble-1", x: 1110, y: 456, w: 42, h: 44, minX: 990, maxX: 1240, speed: 48 },
      { id: "grumble-2", x: 2010, y: 346, w: 42, h: 44, minX: 1810, maxX: 2220, speed: 54 },
    ],
    collectibles: [
      { id: "spark-1", kind: "spark", x: 330, y: 370, label: "Daisy spark" },
      { id: "spark-2", kind: "spark", x: 660, y: 310, label: "Sunbeam spark" },
      { id: "spark-3", kind: "spark", x: 1060, y: 380, label: "Mailbox spark" },
      { id: "spark-4", kind: "spark", x: 1880, y: 350, label: "Picnic spark" },
      { id: "spark-5", kind: "spark", x: 2330, y: 300, label: "Ribbon spark" },
      { id: "keepsake-1", kind: "keepsake", x: 680, y: 300, label: "Pressed daisy" },
      { id: "keepsake-2", kind: "keepsake", x: 1440, y: 290, label: "Tiny stamp" },
      { id: "keepsake-3", kind: "keepsake", x: 2660, y: 390, label: "Brave button" },
    ],
    storyBeats: [
      {
        id: "meadow-start",
        x: 120,
        y: 350,
        w: 70,
        h: 110,
        kicker: "A very official mailbox",
        title: "The first note",
        paragraphs: [
          "The mailbox coughs up a postcard. It says, 'This meadow keeps the first proof that you are good at making things bloom.'",
          "A doodled daisy points toward the platforms ahead. It looks proud of itself.",
        ],
      },
      {
        id: "meadow-daisy",
        x: 1320,
        y: 250,
        w: 120,
        h: 160,
        kicker: "Pressed daisy",
        title: "A small thing kept safe",
        paragraphs: [
          "The daisy is flat from being saved in a book. Some days are like that too. Pressed thin, still pretty.",
          "The trail adds its first keepsake to the journal.",
        ],
      },
    ],
  },
  {
    id: "lantern-woods",
    title: "Letter-lantern woods",
    subtitle: "Fireflies carry sentences between soft old trees.",
    skyTop: "#40356f",
    skyBottom: "#162338",
    hillColor: "#2e6f6a",
    groundColor: "#2a594f",
    accentColor: "#ffd479",
    spawn: { x: 80, y: 380 },
    width: 3400,
    requiredKeepsakes: 3,
    exit: { x: 3240, y: 398, w: 72, h: 102, label: "Lantern gate" },
    platforms: [
      { x: 0, y: 500, w: 3400, h: 80 },
      { x: 260, y: 420, w: 190, h: 28 },
      { x: 540, y: 345, w: 170, h: 28 },
      { x: 920, y: 385, w: 230, h: 28 },
      { x: 1280, y: 310, w: 190, h: 28 },
      { x: 1680, y: 390, w: 280, h: 28 },
      { x: 2130, y: 330, w: 230, h: 28 },
      { x: 2530, y: 390, w: 230, h: 28 },
      { x: 2900, y: 320, w: 220, h: 28 },
    ],
    hazards: [
      { x: 760, y: 478, w: 120, h: 22 },
      { x: 1490, y: 478, w: 160, h: 22 },
      { x: 2380, y: 478, w: 130, h: 22 },
      { x: 2820, y: 478, w: 120, h: 22 },
    ],
    enemies: [
      { id: "thorn-woods-1", x: 980, y: 341, w: 44, h: 44, minX: 920, maxX: 1120, speed: 62 },
      { id: "thorn-woods-2", x: 1740, y: 346, w: 44, h: 44, minX: 1680, maxX: 1940, speed: 66 },
      { id: "thorn-woods-3", x: 2700, y: 346, w: 44, h: 44, minX: 2530, maxX: 2740, speed: 70 },
    ],
    collectibles: [
      { id: "spark-6", kind: "spark", x: 320, y: 380, label: "Fern spark" },
      { id: "spark-7", kind: "spark", x: 610, y: 305, label: "Firefly spark" },
      { id: "spark-8", kind: "spark", x: 1340, y: 270, label: "Moss spark" },
      { id: "spark-9", kind: "spark", x: 2200, y: 290, label: "Lantern spark" },
      { id: "spark-10", kind: "spark", x: 3000, y: 280, label: "Last glow spark" },
      { id: "keepsake-4", kind: "keepsake", x: 640, y: 300, label: "Pocket firefly" },
      { id: "keepsake-5", kind: "keepsake", x: 1850, y: 350, label: "Hidden sentence" },
      { id: "keepsake-6", kind: "keepsake", x: 2960, y: 280, label: "Warm lantern" },
    ],
    storyBeats: [
      {
        id: "woods-letter",
        x: 500,
        y: 270,
        w: 100,
        h: 150,
        kicker: "A lantern blinks twice",
        title: "The woods remember",
        paragraphs: [
          "The lantern lights up one word at a time. Patient. Kind. Ridiculous in the best way.",
          "The trees nod as if all three words are passwords.",
        ],
      },
      {
        id: "woods-bridge",
        x: 2070,
        y: 260,
        w: 140,
        h: 160,
        kicker: "A missing plank",
        title: "Make a path",
        paragraphs: [
          "Some gaps are meant to be crossed with help. The lantern card can place a small bridge wherever the next step should be.",
          "The trail does not ask her to be fearless. It only asks her to keep going.",
        ],
      },
    ],
  },
  {
    id: "teacup-cliffs",
    title: "Teacup cliffs",
    subtitle: "Porcelain cliffs ring like spoons when clouds drift by.",
    skyTop: "#f6b3d1",
    skyBottom: "#fff0bd",
    hillColor: "#b979a8",
    groundColor: "#8f5c86",
    accentColor: "#91e7c4",
    spawn: { x: 90, y: 360 },
    width: 3700,
    requiredKeepsakes: 4,
    exit: { x: 3520, y: 398, w: 72, h: 102, label: "Porcelain gate" },
    platforms: [
      { x: 0, y: 500, w: 3700, h: 80 },
      { x: 300, y: 395, w: 210, h: 28 },
      { x: 680, y: 315, w: 180, h: 28 },
      { x: 1020, y: 430, w: 190, h: 28 },
      { x: 1360, y: 350, w: 220, h: 28 },
      { x: 1750, y: 280, w: 180, h: 28 },
      { x: 2120, y: 385, w: 250, h: 28 },
      { x: 2550, y: 330, w: 220, h: 28 },
      { x: 2980, y: 395, w: 240, h: 28 },
      { x: 3300, y: 310, w: 170, h: 28 },
    ],
    hazards: [
      { x: 540, y: 478, w: 130, h: 22 },
      { x: 1260, y: 478, w: 130, h: 22 },
      { x: 1940, y: 478, w: 150, h: 22 },
      { x: 2400, y: 478, w: 130, h: 22 },
      { x: 3230, y: 478, w: 130, h: 22 },
    ],
    enemies: [
      { id: "saucer-1", x: 1080, y: 386, w: 44, h: 44, minX: 1020, maxX: 1190, speed: 74 },
      { id: "saucer-2", x: 2180, y: 341, w: 44, h: 44, minX: 2120, maxX: 2350, speed: 82 },
      { id: "saucer-3", x: 3020, y: 351, w: 44, h: 44, minX: 2980, maxX: 3200, speed: 84 },
    ],
    collectibles: [
      { id: "spark-11", kind: "spark", x: 360, y: 355, label: "Sugar spark" },
      { id: "spark-12", kind: "spark", x: 740, y: 275, label: "Cloud tea spark" },
      { id: "spark-13", kind: "spark", x: 1430, y: 310, label: "Teaspoon spark" },
      { id: "spark-14", kind: "spark", x: 1820, y: 240, label: "Porcelain spark" },
      { id: "spark-15", kind: "spark", x: 2630, y: 290, label: "Mint spark" },
      { id: "spark-16", kind: "spark", x: 3380, y: 270, label: "Last cup spark" },
      { id: "keepsake-7", kind: "keepsake", x: 720, y: 270, label: "Tiny spoon" },
      { id: "keepsake-8", kind: "keepsake", x: 1800, y: 235, label: "Cloud sugar" },
      { id: "keepsake-9", kind: "keepsake", x: 2650, y: 285, label: "Mint leaf" },
      { id: "keepsake-10", kind: "keepsake", x: 3370, y: 265, label: "Porcelain heart" },
    ],
    storyBeats: [
      {
        id: "cliffs-cup",
        x: 260,
        y: 300,
        w: 130,
        h: 150,
        kicker: "Steam curls into letters",
        title: "A pause counts too",
        paragraphs: [
          "A teacup offers a tiny break. The trail insists this is part of the adventure, not a delay.",
          "The cup tastes like honey, mint, and being understood without explaining every tired thought.",
        ],
      },
      {
        id: "cliffs-high",
        x: 1700,
        y: 200,
        w: 150,
        h: 160,
        kicker: "The high shelf",
        title: "A brave little climb",
        paragraphs: [
          "The cliff rings under her boots. It sounds like applause, but quieter, because the mountains have manners.",
          "There is a card tucked behind the cup. It says, 'You do hard things with more grace than you notice.'",
        ],
      },
    ],
  },
  {
    id: "moonlit-market",
    title: "Moonlit market",
    subtitle: "Every stall sells a memory, a snack, or a questionable hat.",
    skyTop: "#1d1b4f",
    skyBottom: "#583068",
    hillColor: "#5f4da3",
    groundColor: "#4a356f",
    accentColor: "#85c8ff",
    spawn: { x: 80, y: 360 },
    width: 3950,
    requiredKeepsakes: 4,
    exit: { x: 3770, y: 398, w: 72, h: 102, label: "Moon gate" },
    platforms: [
      { x: 0, y: 500, w: 3950, h: 80 },
      { x: 260, y: 380, w: 220, h: 28 },
      { x: 640, y: 320, w: 210, h: 28 },
      { x: 1060, y: 390, w: 210, h: 28 },
      { x: 1440, y: 300, w: 190, h: 28 },
      { x: 1840, y: 370, w: 260, h: 28 },
      { x: 2320, y: 310, w: 210, h: 28 },
      { x: 2740, y: 395, w: 250, h: 28 },
      { x: 3180, y: 330, w: 220, h: 28 },
      { x: 3500, y: 265, w: 170, h: 28 },
    ],
    hazards: [
      { x: 520, y: 478, w: 120, h: 22 },
      { x: 920, y: 478, w: 120, h: 22 },
      { x: 1660, y: 478, w: 150, h: 22 },
      { x: 2140, y: 478, w: 150, h: 22 },
      { x: 3000, y: 478, w: 140, h: 22 },
      { x: 3670, y: 478, w: 100, h: 22 },
    ],
    enemies: [
      { id: "market-1", x: 700, y: 276, w: 44, h: 44, minX: 640, maxX: 830, speed: 88 },
      { id: "market-2", x: 1490, y: 256, w: 44, h: 44, minX: 1440, maxX: 1610, speed: 90 },
      { id: "market-3", x: 2370, y: 266, w: 44, h: 44, minX: 2320, maxX: 2510, speed: 94 },
      { id: "market-4", x: 3240, y: 286, w: 44, h: 44, minX: 3180, maxX: 3380, speed: 96 },
    ],
    collectibles: [
      { id: "spark-17", kind: "spark", x: 320, y: 340, label: "Moon coin spark" },
      { id: "spark-18", kind: "spark", x: 700, y: 280, label: "Hat stall spark" },
      { id: "spark-19", kind: "spark", x: 1510, y: 260, label: "Cookie spark" },
      { id: "spark-20", kind: "spark", x: 1940, y: 330, label: "Ribbon stall spark" },
      { id: "spark-21", kind: "spark", x: 2390, y: 270, label: "Music box spark" },
      { id: "spark-22", kind: "spark", x: 3260, y: 290, label: "Moon stamp spark" },
      { id: "spark-23", kind: "spark", x: 3560, y: 225, label: "High moon spark" },
      { id: "keepsake-11", kind: "keepsake", x: 690, y: 275, label: "Tiny moon coin" },
      { id: "keepsake-12", kind: "keepsake", x: 1930, y: 325, label: "Paper crown" },
      { id: "keepsake-13", kind: "keepsake", x: 3250, y: 285, label: "Music box crank" },
      { id: "keepsake-14", kind: "keepsake", x: 3560, y: 220, label: "Questionable hat" },
    ],
    storyBeats: [
      {
        id: "market-hat",
        x: 610,
        y: 250,
        w: 160,
        h: 150,
        kicker: "The hat stall",
        title: "A very serious disguise",
        paragraphs: [
          "A moth merchant offers a hat with a moon on it. The hat is too small for bravery, but perfect for mischief.",
          "The market stamps her journal anyway. Cute quests still count.",
        ],
      },
      {
        id: "market-song",
        x: 2280,
        y: 240,
        w: 150,
        h: 150,
        kicker: "The music box",
        title: "The song knows the way",
        paragraphs: [
          "The music box plays a tune made of inside jokes and late-night snacks.",
          "A grumpy thorn listens, blushes, and stops being grumpy for a few seconds. The love letter card can do that too.",
        ],
      },
    ],
  },
  {
    id: "gift-grove",
    title: "Gift grove",
    subtitle: "The last place smells like pine, paper, and almost knowing.",
    skyTop: "#332147",
    skyBottom: "#ffb4a2",
    hillColor: "#4f8768",
    groundColor: "#446b50",
    accentColor: "#ffdf8a",
    spawn: { x: 90, y: 360 },
    width: 4300,
    requiredKeepsakes: 5,
    exit: { x: 4100, y: 385, w: 86, h: 115, label: "Picnic blanket" },
    platforms: [
      { x: 0, y: 500, w: 4300, h: 80 },
      { x: 300, y: 400, w: 230, h: 28 },
      { x: 720, y: 330, w: 200, h: 28 },
      { x: 1120, y: 390, w: 230, h: 28 },
      { x: 1540, y: 300, w: 190, h: 28 },
      { x: 1950, y: 360, w: 260, h: 28 },
      { x: 2440, y: 290, w: 220, h: 28 },
      { x: 2900, y: 370, w: 260, h: 28 },
      { x: 3370, y: 315, w: 230, h: 28 },
      { x: 3740, y: 385, w: 230, h: 28 },
    ],
    hazards: [
      { x: 560, y: 478, w: 130, h: 22 },
      { x: 960, y: 478, w: 130, h: 22 },
      { x: 1370, y: 478, w: 140, h: 22 },
      { x: 2240, y: 478, w: 160, h: 22 },
      { x: 2700, y: 478, w: 160, h: 22 },
      { x: 3220, y: 478, w: 130, h: 22 },
      { x: 3630, y: 478, w: 110, h: 22 },
    ],
    enemies: [
      { id: "grove-1", x: 780, y: 286, w: 44, h: 44, minX: 720, maxX: 900, speed: 92 },
      { id: "grove-2", x: 1610, y: 256, w: 44, h: 44, minX: 1540, maxX: 1710, speed: 96 },
      { id: "grove-3", x: 2510, y: 246, w: 44, h: 44, minX: 2440, maxX: 2640, speed: 104 },
      { id: "grove-4", x: 3000, y: 326, w: 44, h: 44, minX: 2900, maxX: 3140, speed: 108 },
      { id: "grove-5", x: 3440, y: 271, w: 44, h: 44, minX: 3370, maxX: 3580, speed: 112 },
    ],
    collectibles: [
      { id: "spark-24", kind: "spark", x: 380, y: 360, label: "Pine spark" },
      { id: "spark-25", kind: "spark", x: 790, y: 290, label: "Wrapping spark" },
      { id: "spark-26", kind: "spark", x: 1200, y: 350, label: "Bow spark" },
      { id: "spark-27", kind: "spark", x: 1610, y: 260, label: "Secret spark" },
      { id: "spark-28", kind: "spark", x: 2030, y: 320, label: "Picnic spark" },
      { id: "spark-29", kind: "spark", x: 2520, y: 250, label: "Last pine spark" },
      { id: "spark-30", kind: "spark", x: 3030, y: 330, label: "Warm sky spark" },
      { id: "spark-31", kind: "spark", x: 3450, y: 275, label: "Almost spark" },
      { id: "spark-32", kind: "spark", x: 3820, y: 345, label: "Final spark" },
      { id: "keepsake-15", kind: "keepsake", x: 770, y: 285, label: "Pinecone bow" },
      { id: "keepsake-16", kind: "keepsake", x: 1600, y: 255, label: "Secret map" },
      { id: "keepsake-17", kind: "keepsake", x: 2510, y: 245, label: "Golden string" },
      { id: "keepsake-18", kind: "keepsake", x: 3440, y: 270, label: "Moon sticker" },
      { id: "keepsake-19", kind: "keepsake", x: 3820, y: 340, label: "Last ribbon" },
    ],
    storyBeats: [
      {
        id: "grove-map",
        x: 1460,
        y: 230,
        w: 160,
        h: 150,
        kicker: "A map with a bite mark",
        title: "Almost there",
        paragraphs: [
          "The map has one corner missing. A squirrel looks guilty and deeply committed to saying nothing.",
          "The remaining trail points to the grove. The final gift is close enough to make the air fizz.",
        ],
      },
      {
        id: "grove-last-ribbon",
        x: 3360,
        y: 240,
        w: 180,
        h: 160,
        kicker: "The last ribbon",
        title: "The trail gets quiet",
        paragraphs: [
          "The last ribbon is tied around a branch. It is not fancy. It is exactly enough.",
          "All the little places she crossed seem to lean in, waiting for the final gate.",
        ],
      },
    ],
  },
] satisfies LevelConfig[];
