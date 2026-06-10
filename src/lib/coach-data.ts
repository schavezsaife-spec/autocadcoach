export type Lesson = {
  id: string;
  day: number;
  title: string;
  tag: string;
  xp: number;
  description: string;
  objective: string;
  steps: string[];
  image: string;
  mistake: string;
  challenge: string;
};

export const lessons: Lesson[] = [
  {
    id: "interface", day: 1, title: "Interface + Navigation", tag: "Basics", xp: 50,
    description: "Get comfortable moving around the AutoCAD workspace.",
    objective: "Learn the ribbon, command line, and how to pan/zoom confidently.",
    steps: [
      "Open AutoCAD and start a new drawing using the acad.dwt template.",
      "Identify the ribbon, command line, status bar, and drawing area.",
      "Use the scroll wheel to ZOOM and click-drag the wheel to PAN.",
      "Type Z then E and press Enter to ZOOM EXTENTS.",
    ],
    image: "https://images.unsplash.com/photo-1581090700227-1e8e0c0a4e1a?w=1200",
    mistake: "Clicking random ribbon icons. Focus on the command line — it's your map.",
    challenge: "Pan and zoom to four different corners of an empty drawing in under 30 seconds.",
  },
  {
    id: "line-circle", day: 2, title: "LINE + CIRCLE", tag: "Drawing", xp: 60,
    description: "Draw your first precise geometry.",
    objective: "Use LINE and CIRCLE with typed coordinates.",
    steps: [
      "Type LINE, press Enter. Click a start point.",
      "Type 100,0 and press Enter to draw a 100 unit horizontal line.",
      "Press Esc. Type CIRCLE, click a center, type 50 for radius.",
      "Save your file as Lesson02.dwg.",
    ],
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200",
    mistake: "Forgetting to press Enter after typing coordinates.",
    challenge: "Draw a square 200x200 using only LINE and typed coords.",
  },
  {
    id: "trim", day: 3, title: "TRIM", tag: "Editing", xp: 60,
    description: "Clean up your geometry like a pro.",
    objective: "Use TRIM to remove unwanted line segments.",
    steps: [
      "Draw two crossing lines.",
      "Type TR and press Enter twice to select everything as cutting edges.",
      "Click the segments you want to remove.",
      "Press Esc when done.",
    ],
    image: "https://images.unsplash.com/photo-1545972154-9bb223aac798?w=1200",
    mistake: "Pressing Enter only once — TRIM expects cutting edges first.",
    challenge: "Draw a tic-tac-toe grid and TRIM it down to a plus sign.",
  },
  {
    id: "move-copy", day: 4, title: "MOVE + COPY", tag: "Editing", xp: 60,
    description: "Reposition and duplicate objects.",
    objective: "Use MOVE (M) and COPY (CO) with base points.",
    steps: [
      "Select an object. Type M, press Enter.",
      "Click a base point, then click destination.",
      "Repeat with CO for COPY.",
    ],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
    mistake: "Picking a random base point — always use a corner or endpoint.",
    challenge: "Copy a circle 5 times in a horizontal row, 100 units apart.",
  },
  {
    id: "osnap", day: 5, title: "Precision with OSNAP", tag: "Precision", xp: 70,
    description: "Snap to exact geometry every time.",
    objective: "Enable OSNAP for endpoints, midpoints, centers.",
    steps: [
      "Press F3 to toggle OSNAP on.",
      "Right-click the OSNAP icon on the status bar.",
      "Enable Endpoint, Midpoint, Center, Intersection.",
      "Hover over geometry — colored markers appear when you snap.",
    ],
    image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=1200",
    mistake: "Drawing without OSNAP — your geometry will never connect.",
    challenge: "Draw a triangle with vertices snapped to three existing circle centers.",
  },
  {
    id: "layers", day: 6, title: "Layers Basics", tag: "Organization", xp: 70,
    description: "Organize your drawing by layers.",
    objective: "Create layers with colors and assign objects to them.",
    steps: [
      "Type LA, press Enter to open Layer Properties.",
      "Create new layers: Walls (white), Doors (cyan), Dims (red).",
      "Select an object, then pick a layer from the dropdown.",
    ],
    image: "https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=1200",
    mistake: "Drawing everything on Layer 0. Always switch layers first.",
    challenge: "Move 3 existing objects each to a different new layer.",
  },
  {
    id: "dim-text", day: 7, title: "Dimensions + Text", tag: "Annotation", xp: 70,
    description: "Annotate your drawing professionally.",
    objective: "Use DIM and TEXT to label drawings.",
    steps: [
      "Type DIM, press Enter.",
      "Click two endpoints to dimension a line.",
      "Type TEXT, click a location, set height 10, type your label.",
    ],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200",
    mistake: "Tiny text that's invisible when zoomed out — bump up the height.",
    challenge: "Fully dimension a 100x200 rectangle with a title block.",
  },
  {
    id: "hatch", day: 8, title: "HATCH", tag: "Fill", xp: 60,
    description: "Fill closed areas with patterns.",
    objective: "Use HATCH to fill enclosed regions.",
    steps: [
      "Type H, press Enter.",
      "Pick a pattern (e.g., ANSI31).",
      "Click inside a closed boundary.",
      "Press Enter to confirm.",
    ],
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200",
    mistake: "HATCH fails on open shapes — close all gaps first.",
    challenge: "Hatch a rectangle with ANSI31 at 45 degrees.",
  },
  {
    id: "blocks", day: 9, title: "BLOCKS", tag: "Reusability", xp: 80,
    description: "Reuse geometry as a single object.",
    objective: "Create and insert BLOCKs.",
    steps: [
      "Select objects to group.",
      "Type B, press Enter.",
      "Name your block, pick a base point, click OK.",
      "Type I to insert it elsewhere.",
    ],
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200",
    mistake: "Forgetting the base point — your block inserts off-center.",
    challenge: "Make a chair block and insert it 4 times around a table.",
  },
  {
    id: "join", day: 10, title: "JOIN", tag: "Editing", xp: 60,
    description: "Combine separate segments into one polyline.",
    objective: "Use JOIN (J) to merge connected lines.",
    steps: [
      "Type J, press Enter.",
      "Select all connected segments.",
      "Press Enter — they become a single polyline.",
    ],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
    mistake: "JOIN says '0 joined' when endpoints don't touch — use OSNAP first.",
    challenge: "Draw 4 lines that form a square and JOIN them into one polyline.",
  },
  {
    id: "extrude", day: 11, title: "EXTRUDE", tag: "3D", xp: 90,
    description: "Push 2D shapes into 3D solids.",
    objective: "Use EXTRUDE on a closed polyline.",
    steps: [
      "Switch workspace to 3D Modeling.",
      "Draw a closed polyline or use a circle.",
      "Type EXT, press Enter, select object.",
      "Type a height like 50 and press Enter.",
      "Type VS then C for Conceptual view.",
    ],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200",
    mistake: "EXTRUDE only works on CLOSED shapes — JOIN first.",
    challenge: "Extrude a hexagon to 100 units tall.",
  },
  {
    id: "polyline-rect", day: 12, title: "POLYLINE + RECTANGLE", tag: "Drawing", xp: 60,
    description: "Draw connected geometry as one object.",
    objective: "Use PL and REC for clean shapes.",
    steps: [
      "Type PL, press Enter, click points to draw.",
      "Type C to close back to start.",
      "Type REC, click two corners for a rectangle.",
    ],
    image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=1200",
    mistake: "Using LINE when you need a single closed shape — pick PL or REC.",
    challenge: "Draw an L-shape with POLYLINE and close it.",
  },
  {
    id: "offset-mirror", day: 13, title: "OFFSET + MIRROR", tag: "Editing", xp: 70,
    description: "Duplicate parallel or reflected copies.",
    objective: "Use OFFSET (O) and MIRROR (MI).",
    steps: [
      "Type O, press Enter, type distance like 10.",
      "Select an object, click which side to offset.",
      "Type MI, select objects, click two points to define mirror line.",
    ],
    image: "https://images.unsplash.com/photo-1545972154-9bb223aac798?w=1200",
    mistake: "Forgetting to set distance before selecting in OFFSET.",
    challenge: "Mirror half a butterfly to make a full symmetrical one.",
  },
  {
    id: "fillet-chamfer", day: 14, title: "FILLET + CHAMFER", tag: "Editing", xp: 70,
    description: "Round or bevel corners.",
    objective: "Use FILLET (F) and CHAMFER (CHA).",
    steps: [
      "Type F, press Enter, type R for radius, set value.",
      "Click two intersecting lines.",
      "Repeat with CHA for chamfered corners.",
    ],
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200",
    mistake: "Setting radius 0 by accident — your corner just becomes sharp.",
    challenge: "Fillet all 4 corners of a rectangle with radius 15.",
  },
  {
    id: "array-review", day: 15, title: "ARRAY + Dimensions Review", tag: "Review", xp: 100,
    description: "Master ARRAY and review dimensioning.",
    objective: "Use ARRAY (AR) and check your dimension style.",
    steps: [
      "Type AR, select object, pick Rectangular or Polar.",
      "Set rows, columns, and spacing.",
      "Review DIM style with D command.",
    ],
    image: "https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=1200",
    mistake: "Negative spacing in ARRAY — it overlaps everything.",
    challenge: "Polar array a circle 8 times around a center point.",
  },
];

import phoneStandImg from "@/assets/phone-stand.jpg";

export type Project = {
  id: string;
  title: string;
  difficulty: "Beginner" | "Easy" | "Medium";
  time: string;
  description: string;
  skills: string[];
  steps: string[];
  image: string;
};

export const projects: Project[] = [
  {
    id: "keychain", title: "Starter Keychain", difficulty: "Beginner", time: "20 min",
    description: "Build your first 2D shape — a simple keychain outline.",
    skills: ["LINE", "CIRCLE", "FILLET"],
    steps: [
      "Draw a 60x25 rectangle with REC.",
      "FILLET all corners with radius 8.",
      "Add a circle of radius 4 near one edge for the key ring hole.",
      "Save as Keychain.dwg.",
    ],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
  },
  {
    id: "wheel", title: "Wheel Sketch", difficulty: "Easy", time: "30 min",
    description: "Sketch a wheel using circles and array.",
    skills: ["CIRCLE", "ARRAY", "OFFSET"],
    steps: [
      "Draw a center circle of radius 50.",
      "OFFSET it by 10 outward for the rim.",
      "Polar ARRAY 6 small circles for bolts.",
    ],
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200",
  },
  {
    id: "phone-stand", title: "Phone Stand", difficulty: "Easy", time: "40 min",
    description: "Design a simple 2D side profile of a phone stand.",
    skills: ["POLYLINE", "FILLET", "DIM"],
    steps: [
      "Draw a triangular side profile with POLYLINE.",
      "FILLET the back corner.",
      "Dimension all sides.",
    ],
    image: phoneStandImg,
  },
  {
    id: "car-outline", title: "Car Outline", difficulty: "Medium", time: "60 min",
    description: "Trace a simple car side profile.",
    skills: ["POLYLINE", "ARC", "MIRROR"],
    steps: [
      "Draw the body profile with POLYLINE and ARC.",
      "Add two wheel circles.",
      "MIRROR windows if needed.",
    ],
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200",
  },
  {
    id: "room", title: "Room Layout", difficulty: "Medium", time: "60 min",
    description: "Floor plan of a small bedroom.",
    skills: ["LAYERS", "HATCH", "BLOCKS"],
    steps: [
      "Use REC for walls on a Walls layer.",
      "Add door openings with TRIM.",
      "Insert furniture as BLOCKs.",
    ],
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200",
  },
  {
    id: "bracket", title: "Bracket Plate", difficulty: "Medium", time: "45 min",
    description: "Mechanical bracket plate with holes.",
    skills: ["OFFSET", "ARRAY", "FILLET"],
    steps: [
      "Draw a 200x100 plate.",
      "FILLET all corners with R10.",
      "Rectangular ARRAY 4 mounting holes of radius 5.",
    ],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
  },
];

export type QuizQ = { q: string; choices: string[]; answer: number; xp: number };

export type LessonQuizQ = QuizQ & { explanation: string };

/**
 * Per-lesson mini quiz. Each lesson needs at least one correct answer to be
 * marked complete. XP for the lesson is awarded only once.
 */
export const lessonQuizzes: Record<string, LessonQuizQ[]> = {
  interface: [
    { q: "Which key combination zooms to all geometry in the drawing?", choices: ["Z then E", "Z then A", "F2", "Ctrl + 0"], answer: 0, xp: 10, explanation: "ZOOM EXTENTS (Z then E) frames every visible object in the drawing." },
    { q: "Where do you read what AutoCAD expects you to do next?", choices: ["The ribbon", "The status bar", "The command line", "The title bar"], answer: 2, xp: 10, explanation: "The command line is your map — it tells you exactly what input AutoCAD is waiting for." },
  ],
  "line-circle": [
    { q: "How do you confirm a typed coordinate in AutoCAD?", choices: ["Space then Tab", "Press Enter", "Click again", "Press Esc"], answer: 1, xp: 10, explanation: "AutoCAD only accepts a typed coordinate after you press Enter (or Spacebar)." },
    { q: "After CIRCLE, what does AutoCAD ask for first?", choices: ["Radius", "Center point", "Diameter", "A layer"], answer: 1, xp: 10, explanation: "CIRCLE always asks for the center point first, then the radius (or diameter)." },
  ],
  trim: [
    { q: "How many times do you press Enter to select 'all' as cutting edges?", choices: ["Once", "Twice", "Three times", "Hold Shift+Enter"], answer: 1, xp: 10, explanation: "Type TR then press Enter twice — the second Enter selects every visible object as cutting edges." },
    { q: "After choosing cutting edges, what do you do?", choices: ["Type a distance", "Click the segments to remove", "Press F8", "Pick a layer"], answer: 1, xp: 10, explanation: "Click the actual segments you want gone. They must lie between cutting edges." },
  ],
  "move-copy": [
    { q: "What is the keyboard alias for COPY?", choices: ["C", "CO", "CP", "MV"], answer: 1, xp: 10, explanation: "CO is the standard AutoCAD alias for COPY. C is reserved for CIRCLE." },
    { q: "Why should you pick a snapped base point?", choices: ["So the object can be deleted", "So the move is precise and repeatable", "To change its color", "To freeze it"], answer: 1, xp: 10, explanation: "Picking a corner/endpoint as base point gives you a deterministic, repeatable offset." },
  ],
  osnap: [
    { q: "Which function key toggles OSNAP on/off?", choices: ["F1", "F3", "F7", "F11"], answer: 1, xp: 10, explanation: "F3 toggles object snapping. F11 toggles object snap tracking." },
    { q: "Drawing without OSNAP usually causes what problem?", choices: ["Slow zoom", "Geometry that doesn't actually connect", "Locked layers", "Hidden objects"], answer: 1, xp: 10, explanation: "Without snapping, endpoints land a fraction off — which breaks TRIM, JOIN, EXTRUDE." },
  ],
  layers: [
    { q: "Which command opens Layer Properties?", choices: ["L", "LA", "LP", "LAY"], answer: 1, xp: 10, explanation: "LA is the alias for LAYER, which opens Layer Properties Manager." },
    { q: "What is the main purpose of layers?", choices: ["Speed up file save", "Organize and control objects", "Round corners", "Change units"], answer: 1, xp: 10, explanation: "Layers group related geometry so you can color, freeze, or lock it together." },
  ],
  "dim-text": [
    { q: "What does DIM expect you to click?", choices: ["A layer", "Two endpoints to dimension between", "A color", "A pattern"], answer: 1, xp: 10, explanation: "DIM measures the distance between two picked points." },
    { q: "Why bump up text height?", choices: ["Faster zoom", "So it stays readable when zoomed out", "To save the file", "To enable hatching"], answer: 1, xp: 10, explanation: "Plot scale matters — tiny text becomes invisible on a printed sheet." },
  ],
  hatch: [
    { q: "HATCH requires the target region to be…", choices: ["Open", "Closed", "On Layer 0", "3D"], answer: 1, xp: 10, explanation: "Patterns can only fill an enclosed boundary. Close any gaps first." },
    { q: "Where do you click after picking a pattern?", choices: ["A boundary edge", "Inside the closed region", "Outside the region", "Anywhere"], answer: 1, xp: 10, explanation: "Click inside the enclosed area — HATCH detects the boundary around your pick." },
  ],
  blocks: [
    { q: "Which command creates a block?", choices: ["B", "BL", "BLK", "BC"], answer: 0, xp: 10, explanation: "B (BLOCK) opens the Block Definition dialog." },
    { q: "What is the base point used for?", choices: ["Layer assignment", "Insertion alignment", "Color", "Snap mode"], answer: 1, xp: 10, explanation: "The base point is the handle AutoCAD uses every time you insert the block." },
  ],
  join: [
    { q: "JOIN fails with '0 joined'. Most likely cause?", choices: ["Wrong layer", "Endpoints don't touch", "Block is locked", "Hatching"], answer: 1, xp: 10, explanation: "Segments must share an endpoint exactly. Snap them with OSNAP first." },
    { q: "After JOIN succeeds, the result is…", choices: ["A block", "A single polyline", "A hatch", "A dimension"], answer: 1, xp: 10, explanation: "Joined collinear lines become a single polyline you can edit as one." },
  ],
  extrude: [
    { q: "EXTRUDE only works on what kind of shape?", choices: ["Open", "Closed", "Hatched", "Dimensioned"], answer: 1, xp: 10, explanation: "You need a closed 2D region (polyline, circle, region) before EXTRUDE can run." },
    { q: "Which workspace lets you see 3D solids easily?", choices: ["Drafting & Annotation", "3D Modeling", "AutoCAD Classic", "Sheet Set"], answer: 1, xp: 10, explanation: "Switch to 3D Modeling so the ribbon, view cube and conceptual shading become available." },
  ],
  "polyline-rect": [
    { q: "Inside PL, which option closes the polyline back to start?", choices: ["E", "C", "X", "L"], answer: 1, xp: 10, explanation: "Type C inside the PL command to close the polyline." },
    { q: "REC asks for…", choices: ["Three corners", "Two opposite corners", "A radius", "A length only"], answer: 1, xp: 10, explanation: "Rectangle is defined by two diagonally opposite corners." },
  ],
  "offset-mirror": [
    { q: "What do you type first inside OFFSET?", choices: ["A layer", "A distance", "A pattern", "A radius"], answer: 1, xp: 10, explanation: "OFFSET asks for the offset distance before selecting the source object." },
    { q: "MIRROR needs which input?", choices: ["A radius", "Two points (mirror line)", "An angle", "A scale"], answer: 1, xp: 10, explanation: "Two picked points define the axis the geometry is reflected across." },
  ],
  "fillet-chamfer": [
    { q: "What does FILLET do?", choices: ["Adds text", "Rounds a corner with a radius", "Joins layers", "Mirrors objects"], answer: 1, xp: 10, explanation: "FILLET replaces a sharp corner with a tangent arc of a given radius." },
    { q: "If FILLET radius is 0, the corner becomes…", choices: ["A perfect circle", "A sharp 90° corner", "Hatched", "Deleted"], answer: 1, xp: 10, explanation: "Radius 0 essentially TRIM/EXTENDs the two lines into a clean corner." },
  ],
  "array-review": [
    { q: "ARRAY supports which patterns?", choices: ["Only rectangular", "Only polar", "Rectangular, polar, or path", "Only along a line"], answer: 2, xp: 10, explanation: "Modern ARRAY supports rectangular, polar (circular), and path-based copies." },
    { q: "What happens if spacing is negative in a rectangular ARRAY?", choices: ["It mirrors", "Copies overlap / stack backward", "It deletes the source", "Nothing"], answer: 1, xp: 10, explanation: "Negative spacing reverses direction so copies grow back toward the origin and overlap." },
  ],
};

export function getLessonQuiz(id: string): LessonQuizQ[] {
  return lessonQuizzes[id] ?? [];
}

export type TroubleshootItem = { title: string; cause: string; fix: string };

export const troubleshooting: TroubleshootItem[] = [
  { title: "TRIM not working", cause: "You didn't select cutting edges, or pressed Enter only once.", fix: "Type TR, press Enter twice to select all as cutting edges, then click segments." },
  { title: "JOIN says 0 items joined", cause: "Endpoints don't perfectly touch.", fix: "Turn on OSNAP (F3), reconnect endpoints, then JOIN again." },
  { title: "Cannot make it 3D", cause: "Your shape isn't closed, or you're in 2D Drafting workspace.", fix: "Switch to 3D Modeling workspace, JOIN segments into a closed polyline, then EXTRUDE." },
  { title: "Drawing disappeared", cause: "You zoomed/panned far away or geometry is on a hidden layer.", fix: "Type Z then E (ZOOM EXTENTS). Then check LAYERS and turn all on." },
];