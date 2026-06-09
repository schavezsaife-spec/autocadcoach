import navWorkspace from "@/assets/coach/lesson_nav_workspace.svg.asset.json";
import lineCircle from "@/assets/coach/lesson_line_circle.svg.asset.json";
import moveCopy from "@/assets/coach/lesson_move_copy.svg.asset.json";
import osnapPrecision from "@/assets/coach/lesson_osnap_precision.svg.asset.json";
import layersPanel from "@/assets/coach/lesson_layers_panel.svg.asset.json";
import dimensionsText from "@/assets/coach/lesson_dimensions_text.svg.asset.json";
import hatchFill from "@/assets/coach/lesson_hatch_fill.svg.asset.json";
import blocksReuse from "@/assets/coach/lesson_blocks_reuse.svg.asset.json";
import polylineRect from "@/assets/coach/lesson_polyline_rectangle.svg.asset.json";
import offsetMirror from "@/assets/coach/lesson_offset_mirror.svg.asset.json";
import filletChamfer from "@/assets/coach/lesson_fillet_chamfer.svg.asset.json";
import arrayDims from "@/assets/coach/lesson_array_dimensions.svg.asset.json";
import screenshotBase from "@/assets/coach/lesson_screenshot_base.svg.asset.json";

import projKeychain from "@/assets/coach/project_starter_keychain.svg.asset.json";
import projWheel from "@/assets/coach/project_wheel_sketch.svg.asset.json";
import projPhoneStand from "@/assets/coach/project_phone_stand.svg.asset.json";
import projCar from "@/assets/coach/project_car_outline.svg.asset.json";
import projRoom from "@/assets/coach/project_room_layout.svg.asset.json";
import projBracket from "@/assets/coach/project_bracket_plate.svg.asset.json";

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
    id: "interface", day: 1, title: "Interface + Navigation", tag: "Beginner", xp: 10,
    description: "Learn the workspace, command line, zoom, and pan so AutoCAD feels less intimidating.",
    objective: "Get comfortable moving around AutoCAD without getting lost.",
    steps: [
      "Find the command line at the bottom of AutoCAD.",
      "Type LINE and press Enter just to practice using commands.",
      "Use the mouse wheel to zoom in and out.",
      "Hold the mouse wheel to pan around the screen.",
    ],
    image: navWorkspace.url,
    mistake: "New learners often think the drawing is gone when they are only zoomed far away.",
    challenge: "Use Z then A to zoom to all objects.",
  },
  {
    id: "line-circle", day: 2, title: "LINE + CIRCLE", tag: "Core Skill", xp: 15,
    description: "Draw your first shapes and start controlling your sketch with confidence.",
    objective: "Create basic geometry using two of the most common beginner commands.",
    steps: [
      "Type LINE and press Enter.",
      "Click a starting point and then a second point.",
      "Press Enter to end the line command.",
      "Type CIRCLE, click the center, and drag out the radius.",
    ],
    image: lineCircle.url,
    mistake: "Beginners often forget to finish the command with Enter.",
    challenge: "Draw a square using four lines and place a circle inside it.",
  },
  {
    id: "trim", day: 3, title: "TRIM", tag: "Editing", xp: 20,
    description: "Clean up drawings by removing extra line segments.",
    objective: "Learn how to remove unwanted pieces instead of redrawing everything.",
    steps: [
      "Start with intersecting lines that have extra pieces sticking out.",
      "Click the segment you want to remove with TRIM.",
      "The extra line segment disappears and the drawing looks clean.",
    ],
    image: screenshotBase.url,
    mistake: "TRIM usually fails when lines do not really cross or touch.",
    challenge: "Draw two crossing lines and trim one segment away.",
  },
  {
    id: "move-copy", day: 4, title: "MOVE + COPY", tag: "Efficiency", xp: 15,
    description: "Work faster by reusing shapes instead of redrawing everything.",
    objective: "Reposition and duplicate shapes with control.",
    steps: [
      "Select an object.",
      "Type MOVE and press Enter.",
      "Pick a base point, then click the new location.",
      "Type COPY and repeat the same idea to make duplicates.",
    ],
    image: moveCopy.url,
    mistake: "Picking the wrong base point makes the object land in the wrong place.",
    challenge: "Draw one circle, then copy it three times in a row.",
  },
  {
    id: "osnap", day: 5, title: "Precision with OSNAP", tag: "Precision", xp: 20,
    description: "Snap exactly to endpoints, midpoints, and centers for clean technical drawings.",
    objective: "Stop guessing and start drawing accurately.",
    steps: [
      "Turn on Object Snap at the bottom of the screen.",
      "Hover near an endpoint, midpoint, or center until the snap marker appears.",
      "Click only when the correct snap point appears.",
      "Use these snaps while drawing lines or circles.",
    ],
    image: osnapPrecision.url,
    mistake: "If the snap marker never appears, OSNAP may be turned off.",
    challenge: "Draw a line from a midpoint to the center of a circle.",
  },
  {
    id: "layers", day: 6, title: "Layers Basics", tag: "Organization", xp: 20,
    description: "Keep drawings readable by separating objects onto layers.",
    objective: "Understand how layers organize technical drawings.",
    steps: [
      "Open the Layer Properties panel.",
      "Make a new layer for a different object type.",
      "Set the new layer current before drawing.",
      "Use color differences to make the drawing easier to read.",
    ],
    image: layersPanel.url,
    mistake: "Drawing everything on one layer makes edits much harder later.",
    challenge: "Create one layer for outlines and another for dimensions.",
  },
  {
    id: "dim-text", day: 7, title: "Dimensions + Text", tag: "Documentation", xp: 20,
    description: "Add readable measurements and labels to your sketches.",
    objective: "Communicate size and meaning clearly on a drawing.",
    steps: [
      "Use a dimension command on a clean edge.",
      "Place the dimension where it does not overlap the object.",
      "Add simple text labels for key parts.",
      "Review the drawing from a reader point of view.",
    ],
    image: dimensionsText.url,
    mistake: "Dimensions become messy when they overlap lines and geometry.",
    challenge: "Dimension the width of a rectangle and add a part name above it.",
  },
  {
    id: "hatch", day: 8, title: "HATCH", tag: "Drafting", xp: 20,
    description: "Fill closed areas to show sections, materials, or emphasis.",
    objective: "Understand how hatch patterns improve drawing communication.",
    steps: [
      "Select a closed boundary.",
      "Apply a hatch pattern to the selected region.",
      "Adjust the pattern so it stays readable.",
      "Use hatch to separate parts of the drawing clearly.",
    ],
    image: hatchFill.url,
    mistake: "Small gaps in the outline stop HATCH from filling correctly.",
    challenge: "Create a closed rectangle and apply a hatch pattern to it.",
  },
  {
    id: "blocks", day: 9, title: "BLOCKS", tag: "Reuse", xp: 22,
    description: "Save repeated geometry as reusable symbols instead of redrawing it.",
    objective: "Learn how blocks speed up repeatable drafting work.",
    steps: [
      "Create one clean object that you want to reuse.",
      "Turn that object into a block.",
      "Insert the block where you need it.",
      "Use blocks to keep repeated elements consistent.",
    ],
    image: blocksReuse.url,
    mistake: "New users forget that blocks are meant to save time on repeated objects.",
    challenge: "Turn a simple symbol into a block and insert it twice.",
  },
  {
    id: "join", day: 10, title: "JOIN", tag: "Editing", xp: 20,
    description: "Combine multiple lines into one object.",
    objective: "Make separate lines behave like one connected shape.",
    steps: [
      "Start with separate lines that form a shape.",
      "Use JOIN so the lines become one object.",
    ],
    image: screenshotBase.url,
    mistake: "Lines must touch exactly or JOIN will fail.",
    challenge: "Draw a rectangle from four lines, then join them.",
  },
  {
    id: "extrude", day: 11, title: "EXTRUDE", tag: "3D", xp: 25,
    description: "Turn a flat 2D sketch into a simple 3D object.",
    objective: "Understand how a closed shape becomes a 3D solid.",
    steps: [
      "Start with a closed 2D shape like a rectangle.",
      "Use EXTRUDE and pull the shape upward.",
      "You now have a 3D object instead of a flat outline.",
    ],
    image: screenshotBase.url,
    mistake: "If the shape is not closed, 3D commands often fail.",
    challenge: "Draw a rectangle and turn it into a box shape.",
  },
  {
    id: "polyline-rect", day: 12, title: "POLYLINE + RECTANGLE", tag: "Drafting Flow", xp: 20,
    description: "Create connected outlines faster by using closed shapes and single connected paths.",
    objective: "Build cleaner profiles that are easier to edit later.",
    steps: [
      "Use RECTANGLE when you need a fast closed shape.",
      "Use POLYLINE when you want multiple connected edges to stay together.",
      "Mix straight segments into one continuous outline before ending the command.",
      "Prefer closed profiles when the drawing may later be joined, hatched, or extruded.",
    ],
    image: polylineRect.url,
    mistake: "Using too many separate lines creates cleanup work later.",
    challenge: "Draw a simple plate outline with one rectangle and one added polyline extension.",
  },
  {
    id: "offset-mirror", day: 13, title: "OFFSET + MIRROR", tag: "Efficiency", xp: 22,
    description: "Speed up drafting by creating parallel geometry and balanced symmetrical copies.",
    objective: "Reuse shapes without manually redrawing repeated edges.",
    steps: [
      "Use OFFSET to create a parallel copy at a fixed distance.",
      "Choose the correct side of the source object for the new copy.",
      "Use MIRROR when a drawing has a centerline or obvious symmetry.",
      "Keep one half clean before mirroring so both sides stay consistent.",
    ],
    image: offsetMirror.url,
    mistake: "Using mirror before the source side is cleaned up creates duplicate mistakes.",
    challenge: "Draw half of a bracket, then mirror it across a vertical centerline.",
  },
  {
    id: "fillet-chamfer", day: 14, title: "FILLET + CHAMFER", tag: "Detailing", xp: 22,
    description: "Round or bevel corners so technical parts look intentional and easier to manufacture.",
    objective: "Understand when to smooth a corner and when to cut a flat edge.",
    steps: [
      "Use FILLET to replace a sharp corner with a rounded arc.",
      "Set the fillet radius before choosing the two edges.",
      "Use CHAMFER when you want a straight angled cut instead of a round corner.",
      "Compare rounded and beveled corners to choose the right finish for the drawing.",
    ],
    image: filletChamfer.url,
    mistake: "Leaving the wrong radius or distance active gives surprising corner results.",
    challenge: "Apply a small fillet to one corner of a plate and a chamfer to another.",
  },
  {
    id: "array-review", day: 15, title: "ARRAY + Dimensions Review", tag: "Production", xp: 24,
    description: "Repeat features quickly and confirm spacing with dimensions so layouts stay consistent.",
    objective: "Move from one-off geometry to repeatable design patterns.",
    steps: [
      "Use a rectangular array to repeat the same feature in even rows or columns.",
      "Use a polar array when features should repeat around a center point.",
      "Dimension the spacing after the array is created to confirm the layout is readable.",
      "Use arrays for holes, slots, fasteners, and other repeated drafting details.",
    ],
    image: arrayDims.url,
    mistake: "Failing to dimension repeated spacing makes the pattern harder to trust.",
    challenge: "Create one hole and use an array to place matching holes across a plate.",
  },
];

export type Project = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  time: string;
  description: string;
  skills: string[];
  steps: string[];
  image: string;
};

export const projects: Project[] = [
  {
    id: "keychain", title: "Starter Keychain", difficulty: "Easy", time: "20 min",
    description: "Use line, circle, trim, and text to design a simple custom keychain.",
    skills: ["LINE", "CIRCLE", "TRIM", "TEXT"],
    steps: [
      "Draw the outer tag shape so the rest of the project has a clear boundary.",
      "Add a small hole circle near one end so the keyring hole has room around it.",
      "Trim extra edges so the keychain shape reads as one neat profile.",
      "Finish with simple text to personalize the beginner project.",
    ],
    image: projKeychain.url,
  },
  {
    id: "wheel", title: "Wheel Sketch", difficulty: "Easy", time: "25 min",
    description: "Practice circles, symmetry, and cleanup tools with a fun geometric build.",
    skills: ["CIRCLE", "OFFSET", "TRIM"],
    steps: [
      "Draw the main outer wheel circle and add inner circles from the same center.",
      "Use OFFSET to create evenly spaced rings without redrawing them.",
      "Sketch spoke geometry symmetrically so the wheel stays balanced.",
      "Trim the extra geometry so the final wheel reads clearly.",
    ],
    image: projWheel.url,
  },
  {
    id: "phone-stand", title: "Phone Stand", difficulty: "Medium", time: "35 min",
    description: "Sketch a simple object and start thinking like a product designer.",
    skills: ["LINE", "OFFSET", "DIMENSIONS"],
    steps: [
      "Block in the main side profile so the stand has a clear silhouette.",
      "Apply OFFSET to give the profile realistic material thickness.",
      "Cut in the support slot opening where the phone will rest.",
      "Label key measurements so the design feels more engineering-focused.",
    ],
    image: projPhoneStand.url,
  },
  {
    id: "car-outline", title: "Car Outline", difficulty: "Medium", time: "40 min",
    description: "Build a clean 2D profile while practicing curves, editing, and proportion.",
    skills: ["LINE", "ARC", "TRIM"],
    steps: [
      "Sketch the long body outline first so the car proportions have a base.",
      "Use a clean arc to give the profile a believable roof shape.",
      "Cut in the front and rear wheel areas with smooth curves.",
      "Trim overlaps and sharpen the final silhouette.",
    ],
    image: projCar.url,
  },
  {
    id: "room", title: "Room Layout", difficulty: "Medium", time: "45 min",
    description: "Draft a beginner floor-plan style room using walls, door openings, windows, and furniture blocks.",
    skills: ["RECTANGLE", "OFFSET", "TRIM", "BLOCKS"],
    steps: [
      "Lay out the outer room boundary as a clear closed shape.",
      "Offset interior walls to create wall thickness using one consistent value.",
      "Trim openings cleanly for a door and windows so the wall layout reads like a real plan.",
      "Place simple furniture blocks to test the layout.",
    ],
    image: projRoom.url,
  },
  {
    id: "bracket", title: "Bracket Plate", difficulty: "Medium", time: "50 min",
    description: "Create a simple mechanical bracket with hole spacing, corner treatments, and dimensions.",
    skills: ["POLYLINE", "OFFSET", "FILLET", "CHAMFER", "DIMENSIONS"],
    steps: [
      "Sketch the main bracket outline as one connected profile.",
      "Place two repeated mounting holes with measured spacing.",
      "Add a chamfered or rounded corner to show design intent.",
      "Dimension the part width and height to finish the drawing clearly.",
    ],
    image: projBracket.url,
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