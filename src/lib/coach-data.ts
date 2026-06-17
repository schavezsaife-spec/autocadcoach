import extrudeAction from "@/assets/extrude_action.png.asset.json";
import extrudeBefore from "@/assets/extrude_before.png.asset.json";
import extrudeAfter from "@/assets/extrude_after.png.asset.json";
import joinAction from "@/assets/join_before.png.asset.json";
import joinAfter from "@/assets/join_after.png.asset.json";
import joinError from "@/assets/join_error.png.asset.json";
import interfaceStep1 from "@/assets/interface_step1_start_drawing.png.asset.json";
import interfaceStep2 from "@/assets/interface_step2_four_regions.png.asset.json";
import interfaceStep3Pan from "@/assets/interface_step3_pan.png.asset.json";
import interfaceStep4Zoom from "@/assets/interface_step4_zoom.png.asset.json";
import interfaceStep5ZoomExtents from "@/assets/interface_step5_zoom_extents.png.asset.json";
import interfaceStep6VisualReference from "@/assets/interface_step6_visual_reference.png.asset.json";
import lineStep1StartCommand from "@/assets/line_step1_start_command.png.asset.json";
import circleStep1StartCommand from "@/assets/circle_step1_start_command.png.asset.json";
import circleStep2ClickCentre from "@/assets/circle_step2_click_centre.png.asset.json";
import circleStep3TypeRadius from "@/assets/circle_step3_type_radius.png.asset.json";
import circleStep4ConfirmSize from "@/assets/circle_step4_confirm_size.png.asset.json";
import { SLICE } from "@/lib/lesson-slices";
import lineStep2PickStartPoint from "@/assets/line_step2_pick_start_point.png.asset.json";
import lineStep3RelativeCoordinate from "@/assets/line_step3_relative_coordinate.png.asset.json";
import lineStep4EndCommand from "@/assets/line_step4_end_command.png.asset.json";
import lineStep5SaveWork from "@/assets/line_step5_save_work.png.asset.json";
import lineStep6VisualReference from "@/assets/line_step6_visual_reference.png.asset.json";

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
  rich?: RichLesson;
  media?: {
    hero?: string;
    action?: { src: string; caption: string };
    before?: { src: string; caption: string };
    after?: { src: string; caption: string };
    error?: { src: string; caption: string };
  };
};

/**
 * Rich, 11-section instructional content for foundational lessons.
 * Optional — older lessons keep using the legacy fields above.
 * Screenshot slots are *placeholders by design*: we describe exactly what
 * the screenshot must show, with a link to the authoritative Autodesk
 * help page. We never invent generic diagrams.
 */
export type RichLesson = {
  commandName?: string;
  learningObjective: string;
  whatItIs: string;
  whyWhen: string;
  whereToFind: {
    ribbon: string;
    menu?: string;
    commandLine: string;
    alias?: string;
  };
  vocab: { term: string; definition: string }[];
  beforeYouStart: string[];
  detailedSteps: {
    title: string;
    instruction: string;
    explanation: string;
    screenshot: {
      caption: string;
      sourceUrl?: string;
      imageUrl?: string;
      annotations?: string[];
    };
  }[];
  visualReference?: {
    caption: string;
    sourceUrl?: string;
    imageUrl?: string;
  };
  commonMistakes: { mistake: string; fix: string }[];
  troubleshooting: { problem: string; cause: string; fix: string }[];
  practiceExercise: {
    title: string;
    steps: string[];
    success: string;
  };
  proTips: string[];
  relatedCommands: { name: string; alias?: string; what: string }[];
};

const AUTODESK = "https://help.autodesk.com/view/ACD/2024/ENU/";

const richInterface: RichLesson = {
  commandName: "Interface + Navigation",
  learningObjective:
    "By the end of this lesson you can open AutoCAD, identify every major area of the workspace, and pan/zoom around an empty drawing with confidence.",
  whatItIs:
    "The AutoCAD interface is the set of panels and bars surrounding your drawing area: the ribbon (top), the command line (bottom), the status bar (very bottom) and the drawing area itself. You don't draw anything yet — you only learn where you are.",
  whyWhen:
    "Every command you'll ever run lives in one of these areas. If you don't know where AutoCAD is listening, you'll click randomly and the program will feel hostile. Learn the map first, then the commands.",
  whereToFind: {
    ribbon: "Top of the window — the wide strip with tabs labelled Home, Insert, Annotate, etc.",
    menu: "Application menu (the large red A in the top-left) for File / New / Open / Save.",
    commandLine: "Docked at the bottom of the drawing area. Always shows what AutoCAD is waiting for.",
    alias: "Press F2 to expand the command-line history at any time.",
  },
  vocab: [
    { term: "Workspace", definition: "A preset arrangement of ribbon, panels and tools. Beginners use 'Drafting & Annotation'." },
    { term: "Ribbon", definition: "The tabbed toolbar at the top. Each tab groups related commands into panels." },
    { term: "Command line", definition: "A small text area at the bottom where you type commands and read prompts." },
    { term: "Status bar", definition: "The thin bar of toggle icons at the very bottom (Grid, Snap, OSNAP, Ortho…)." },
    { term: "Drawing area", definition: "The large dark space in the middle where geometry is drawn." },
    { term: "Crosshairs", definition: "The cursor inside the drawing area, made of two long perpendicular lines." },
    { term: "Pan", definition: "Sliding the view sideways without changing zoom level." },
    { term: "Zoom", definition: "Moving the camera closer to or farther from the drawing." },
  ],
  beforeYouStart: [
    "Launch AutoCAD and wait for the Start tab to appear.",
    "Use a mouse with a working scroll wheel — pan and zoom rely on it.",
    "Close any tutorial pop-ups so the workspace is clean.",
  ],
  detailedSteps: [
    {
      title: "Open a new drawing from the acad template",
      instruction:
        "On the Start tab, click 'Start Drawing'. If a template picker appears, choose 'acad.dwt'.",
      explanation:
        "acad.dwt is the imperial default template that ships with AutoCAD. Using a known template means lessons here behave exactly like the screenshots.",
      screenshot: {
        caption: "Start tab → Start Drawing button. Circle the 'Start Drawing' button.",
        sourceUrl: AUTODESK + "?guid=GUID-1F22CBED-1678-4410-A153-21F5C6A02C70",
        imageUrl: interfaceStep1.url,
      },
    },
    {
      title: "Identify the four major regions of the screen",
      instruction:
        "Look at the window and silently name: ribbon (top), drawing area (center), command line (just below drawing), status bar (very bottom).",
      explanation:
        "Pointing at each region and naming it out loud builds spatial memory. You're not running any command yet — this is pure orientation.",
      screenshot: {
        caption: "Full AutoCAD window with arrows labelling: 1 Ribbon, 2 Drawing area, 3 Command line, 4 Status bar.",
        sourceUrl: AUTODESK + "?guid=GUID-2010CF44-7CE3-405F-A5E1-78D60C8055A8",
        imageUrl: interfaceStep2.url,
      },
    },
    {
      title: "Move the view with the scroll wheel (PAN)",
      instruction:
        "Press and HOLD the scroll wheel (don't roll it), then drag the mouse. The drawing slides under the cursor.",
      explanation:
        "Holding the wheel triggers Realtime PAN. Releasing the wheel ends the pan. Your zoom level does not change.",
      screenshot: {
        caption: "Cursor turned into the 'hand' pan icon inside the drawing area. Add an arrow showing drag direction.",
        sourceUrl: AUTODESK + "?guid=GUID-7B6D9C7A-9C18-4F9A-9D6A-5C7C7E2A85B2",
        imageUrl: interfaceStep3Pan.url,
      },
    },
    {
      title: "Zoom in and out with the scroll wheel (ZOOM)",
      instruction:
        "Roll the wheel forward to zoom in toward the cursor. Roll it backward to zoom out.",
      explanation:
        "AutoCAD zooms toward the crosshair position, not the screen center. Where you point is where you go.",
      screenshot: {
        caption: "Two side-by-side captures: same drawing zoomed out (left) and zoomed in (right). Label the cursor location.",
        sourceUrl: AUTODESK + "?guid=GUID-C0F5C7CB-7B0F-4F7B-9C13-6C2E2C9A3A8E",
        imageUrl: interfaceStep4Zoom.url,
      },
    },
    {
      title: "Frame everything with ZOOM EXTENTS",
      instruction:
        "Click inside the drawing area. Type Z, press Enter, type E, press Enter.",
      explanation:
        "ZOOM EXTENTS (Z → E) recentres and rescales the view so every object fits on screen. Memorise this — it's your 'I'm lost' button.",
      screenshot: {
        caption: "Command line showing the literal text: Command: Z  ZOOM  Specify corner… [All/Center/Dynamic/Extents/…]: E.",
        sourceUrl: AUTODESK + "?guid=GUID-7B5A2A8C-5C2E-4D7C-9E5E-9A6E1C2E3D7B",
        imageUrl: interfaceStep5ZoomExtents.url,
      },
    },
  ],
  visualReference: {
    caption:
      "Annotated AutoCAD 2024 workspace overview from Autodesk Help: ribbon, drawing area, command line, status bar.",
    sourceUrl: AUTODESK + "?guid=GUID-2010CF44-7CE3-405F-A5E1-78D60C8055A8",
    imageUrl: interfaceStep6VisualReference.url,
  },
  commonMistakes: [
    { mistake: "Clicking ribbon icons at random hoping something happens.", fix: "Read the command line first — it tells you what AutoCAD is waiting for." },
    { mistake: "Rolling the wheel and expecting to PAN.", fix: "Rolling = ZOOM. HOLDING the wheel + drag = PAN." },
    { mistake: "Losing the drawing off-screen.", fix: "Type Z then E (ZOOM EXTENTS) to re-frame everything." },
  ],
  troubleshooting: [
    { problem: "The crosshair won't move smoothly.", cause: "The cursor is outside the drawing area.", fix: "Click once inside the dark drawing area, then try again." },
    { problem: "Scroll wheel does nothing.", cause: "MBUTTONPAN is off, or the wheel driver is misconfigured.", fix: "Type MBUTTONPAN, press Enter, set value to 1, press Enter." },
    { problem: "Command line is missing.", cause: "It was accidentally closed.", fix: "Press Ctrl + 9 to toggle the command line back on." },
  ],
  practiceExercise: {
    title: "Workspace tour in 60 seconds",
    steps: [
      "Open a new drawing from acad.dwt.",
      "Point at and silently name: ribbon, drawing area, command line, status bar.",
      "Hold the scroll wheel and pan to the top-right corner of the screen.",
      "Roll the wheel back five clicks to zoom out.",
      "Run ZOOM EXTENTS (Z → E) to re-centre.",
    ],
    success: "You can navigate to any part of an empty drawing and return to a centred view in under a minute.",
  },
  proTips: [
    "Double-click the scroll wheel to run ZOOM EXTENTS without typing.",
    "Press F2 to pop out the command-line history into a resizeable window — handy when prompts scroll too fast.",
    "Press Esc twice to cancel any half-finished command and return to a clean prompt.",
  ],
  relatedCommands: [
    { name: "ZOOM", alias: "Z", what: "Change how much of the drawing you see." },
    { name: "PAN", alias: "P", what: "Slide the view without changing zoom." },
    { name: "REGEN", alias: "RE", what: "Regenerate the drawing if curves appear jagged after zooming." },
  ],
};

const richLine: RichLesson = {
  commandName: "LINE",
  learningObjective:
    "By the end of this lesson you can run the LINE command and draw a precise horizontal segment using typed coordinates.",
  whatItIs:
    "LINE creates one or more straight line segments. Each click (or typed coordinate) places one endpoint; AutoCAD keeps prompting for the next point until you press Enter or Esc.",
  whyWhen:
    "LINE is the most common drawing command in AutoCAD. Use it whenever you need straight, single-segment geometry — boundaries, construction lines, sketches.",
  whereToFind: {
    ribbon: "Home tab → Draw panel → Line button (the diagonal segment icon).",
    menu: "Draw menu → Line.",
    commandLine: "Type LINE and press Enter.",
    alias: "L (then Enter).",
  },
  vocab: [
    { term: "Endpoint", definition: "Either tip of a line segment." },
    { term: "Absolute coordinate", definition: "A point measured from the drawing origin 0,0. Typed as X,Y — for example 100,50." },
    { term: "Relative coordinate", definition: "A point measured from the previous point. Typed with a leading @ — for example @100,0." },
    { term: "Dynamic input", definition: "On-screen tooltip near the crosshair that lets you type distance + angle directly." },
    { term: "Polar tracking", definition: "On-screen alignment guide that locks the cursor to set angles (0°, 90°, 45°…)." },
  ],
  beforeYouStart: [
    "Start a fresh drawing from the acad.dwt template.",
    "Press F12 once if dynamic input is off (the tooltip should appear next to the crosshair).",
    "Make sure ORTHO mode is on — press F8 if needed (status bar icon highlights blue).",
  ],
  detailedSteps: [
    {
      title: "Start the LINE command",
      instruction: "Type LINE, then press Enter. (Or type L, Enter.)",
      explanation:
        "The command line should now read 'LINE Specify first point:'. AutoCAD is now waiting for one click or one typed coordinate.",
      screenshot: {
        caption: "Command line showing: Command: LINE  Specify first point:",
        sourceUrl: AUTODESK + "?guid=GUID-3A5C0E07-1F3C-4F8A-83E0-3F9D5BB28F2F",
        imageUrl: lineStep1StartCommand.url,
      },
    },
    {
      title: "Pick the start point",
      instruction:
        "Click anywhere inside the drawing area. A 'rubber-band' segment now follows the cursor.",
      explanation:
        "The first click anchors the first endpoint. AutoCAD now prompts 'Specify next point or [Undo]:'.",
      screenshot: {
        caption: "Rubber-band line stretching from the picked start point to the current cursor position.",
        sourceUrl: AUTODESK + "?guid=GUID-3A5C0E07-1F3C-4F8A-83E0-3F9D5BB28F2F",
        imageUrl: lineStep2PickStartPoint.url,
      },
    },
    {
      title: "Type a relative coordinate for the second point",
      instruction: "Type @100,0 and press Enter.",
      explanation:
        "@100,0 means 'go 100 units along X and 0 along Y from the previous point' — i.e. 100 units to the right. This is exactly the kind of typed precision that separates CAD from sketching.",
      screenshot: {
        caption: "Command line: Specify next point or [Undo]: @100,0  — and the new horizontal segment visible in the drawing.",
        sourceUrl: AUTODESK + "?guid=GUID-3A5C0E07-1F3C-4F8A-83E0-3F9D5BB28F2F",
        imageUrl: lineStep3RelativeCoordinate.url,
      },
    },
    {
      title: "End the LINE command",
      instruction: "Press Enter once more (or press Esc).",
      explanation:
        "Pressing Enter on the next-point prompt ends the chain. The single horizontal segment stays in the drawing.",
      screenshot: {
        caption: "Drawing area with one horizontal 100-unit segment. Command line back to a clean 'Command:' prompt.",
        sourceUrl: AUTODESK + "?guid=GUID-3A5C0E07-1F3C-4F8A-83E0-3F9D5BB28F2F",
        imageUrl: lineStep4EndCommand.url,
      },
    },
    {
      title: "Save your work",
      instruction: "Press Ctrl + S, choose a folder, name the file Lesson02-LINE.dwg, click Save.",
      explanation:
        "Saving early and often is non-negotiable in CAD. .dwg is AutoCAD's native format.",
      screenshot: {
        caption: "Save Drawing As dialog with the file name field filled in.",
        sourceUrl: AUTODESK + "?guid=GUID-2EB1F3A5-9B4F-4B7F-9D54-1A5F8B3F0B9F",
        imageUrl: lineStep5SaveWork.url,
      },
    },
  ],
  visualReference: {
    caption: "LINE command reference — Autodesk Help page documenting prompts and options.",
    sourceUrl: AUTODESK + "?guid=GUID-3A5C0E07-1F3C-4F8A-83E0-3F9D5BB28F2F",
    imageUrl: lineStep6VisualReference.url,
  },
  commonMistakes: [
    { mistake: "Forgetting to press Enter after typing a coordinate.", fix: "AutoCAD only commits a coordinate on Enter (or Spacebar). Always finish with Enter." },
    { mistake: "Typing 100,0 instead of @100,0.", fix: "Without @, AutoCAD interprets it as an absolute point from 0,0 — not as a relative offset." },
    { mistake: "Drawing in free-hand because ORTHO is off.", fix: "Press F8 to constrain the cursor to perfectly horizontal/vertical." },
  ],
  troubleshooting: [
    { problem: "Nothing happens when I type LINE.", cause: "The drawing area doesn't have focus.", fix: "Click once inside the drawing area, then type LINE again." },
    { problem: "My line came out diagonal.", cause: "ORTHO was off and you eyeballed the second point.", fix: "Undo with Ctrl + Z, press F8, redraw." },
    { problem: "Pressing Enter draws a strange extra segment.", cause: "Enter at a fresh prompt repeats the last command.", fix: "Press Esc to cancel, then start LINE explicitly." },
  ],
  practiceExercise: {
    title: "Draw a 200×100 rectangle using only LINE",
    steps: [
      "Type LINE, Enter. Click any start point.",
      "Type @200,0 Enter.",
      "Type @0,100 Enter.",
      "Type @-200,0 Enter.",
      "Type C Enter to close back to the start.",
    ],
    success: "You see a perfect 200×100 rectangle made of four LINE segments and the command line returns to 'Command:'.",
  },
  proTips: [
    "Inside LINE, type U and Enter to undo just the last segment without leaving the command.",
    "Inside LINE, type C and Enter to close the chain back to the very first point.",
    "Spacebar acts like Enter for confirming commands and coordinates — faster than reaching for the Enter key.",
  ],
  relatedCommands: [
    { name: "PLINE", alias: "PL", what: "Draw a connected polyline — segments behave as one object." },
    { name: "XLINE", alias: "XL", what: "Draw an infinite construction line." },
    { name: "ERASE", alias: "E", what: "Delete a segment you don't want." },
  ],
};

const richCircle: RichLesson = {
  commandName: "CIRCLE",
  learningObjective:
    "By the end of this lesson you can run the CIRCLE command and draw a circle of an exact radius around a chosen centre point.",
  whatItIs:
    "CIRCLE creates a single circular object. By default it asks for a centre point first, then a radius. Several alternative options exist (2-point, 3-point, tan-tan-radius) but the centre-radius flow is the foundation.",
  whyWhen:
    "Use CIRCLE for holes, wheels, fasteners, decorative arcs, and anywhere your design needs a closed round shape.",
  whereToFind: {
    ribbon: "Home tab → Draw panel → Circle dropdown → 'Center, Radius'.",
    menu: "Draw menu → Circle → Center, Radius.",
    commandLine: "Type CIRCLE and press Enter.",
    alias: "C (then Enter).",
  },
  vocab: [
    { term: "Centre point", definition: "The exact middle of the circle, equidistant from every point on the curve." },
    { term: "Radius", definition: "The distance from the centre to the edge." },
    { term: "Diameter", definition: "The distance across the circle through the centre. Diameter = 2 × radius." },
    { term: "Quadrant", definition: "One of the four cardinal points on a circle (0°, 90°, 180°, 270°). OSNAP can snap to these." },
  ],
  beforeYouStart: [
    "Open a new drawing from acad.dwt.",
    "Confirm OSNAP is on (F3) so you can snap the centre to an existing point if needed.",
    "Decide whether you want to specify a radius or a diameter — the lesson uses radius.",
  ],
  detailedSteps: [
    {
      title: "Start the CIRCLE command",
      instruction: "Type CIRCLE, press Enter (or type C, Enter).",
      explanation:
        "The command line should now read 'CIRCLE Specify center point for circle or [3P/2P/Ttr (tan tan radius)]:'.",
      screenshot: {
        caption: "Command line showing: Command: CIRCLE  Specify center point for circle or [3P/2P/Ttr]:",
        sourceUrl: AUTODESK + "?guid=GUID-D6E2E47D-92D2-4F0B-9C36-4D8C7C5A8B9E",
        imageUrl: circleStep1StartCommand.url,
      },
    },
    {
      title: "Click the centre point",
      instruction: "Click anywhere in the drawing area to place the centre.",
      explanation:
        "AutoCAD now prompts 'Specify radius of circle or [Diameter]:' and a preview circle follows the cursor.",
      screenshot: {
        caption: "Preview circle rubber-banding around the picked centre point, growing as the cursor moves.",
        sourceUrl: AUTODESK + "?guid=GUID-D6E2E47D-92D2-4F0B-9C36-4D8C7C5A8B9E",
        imageUrl: circleStep2ClickCentre.url,
      },
    },
    {
      title: "Type the radius",
      instruction: "Type 50 and press Enter.",
      explanation:
        "AutoCAD draws a circle with a radius of 50 drawing units around your centre point and exits the command.",
      screenshot: {
        caption: "Finished circle of radius 50, with the centre marker visible if PDMODE shows it.",
        sourceUrl: AUTODESK + "?guid=GUID-D6E2E47D-92D2-4F0B-9C36-4D8C7C5A8B9E",
        imageUrl: circleStep3TypeRadius.url,
      },
    },
    {
      title: "Confirm the size with a quick check",
      instruction: "Type LIST, press Enter, click the circle, press Enter.",
      explanation:
        "LIST prints the object's properties to the command-line history (press F2 to see them). You'll see RADIUS = 50.0000 and the centre coordinates.",
      screenshot: {
        caption: "F2 text window showing CIRCLE Layer, center point, radius, circumference and area.",
        sourceUrl: AUTODESK + "?guid=GUID-9D7E2A91-7E2D-4B6F-9E2E-9C7A8F0E7E2D",
        imageUrl: circleStep4ConfirmSize.url,
      },
    },
  ],
  visualReference: {
    caption: "CIRCLE command reference — Autodesk Help page documenting all six creation methods.",
    sourceUrl: AUTODESK + "?guid=GUID-D6E2E47D-92D2-4F0B-9C36-4D8C7C5A8B9E",
    imageUrl: SLICE.circle_after,
  },
  commonMistakes: [
    { mistake: "Typing the diameter when AutoCAD is asking for the radius.", fix: "Either halve your value or, at the radius prompt, type D first, press Enter, then type the diameter." },
    { mistake: "Picking a centre point with OSNAP off and getting a slightly misaligned circle.", fix: "Press F3 to enable OSNAP, then snap to an existing endpoint, midpoint or intersection." },
    { mistake: "Clicking instead of typing the radius and getting a random size.", fix: "Always type a numeric radius — never trust the eyeball for engineering geometry." },
  ],
  troubleshooting: [
    { problem: "The circle is huge or microscopic.", cause: "Your drawing zoom level made the typed radius look unexpected.", fix: "Run ZOOM EXTENTS (Z → E) to refit the view." },
    { problem: "AutoCAD asks for a diameter, not a radius.", cause: "The last CIRCLE invocation switched the default to Diameter.", fix: "At the prompt type R and press Enter to switch back to radius." },
    { problem: "Pressing Enter draws another circle.", cause: "Enter on a clean prompt repeats the last command.", fix: "Press Esc to clear, then start the next command deliberately." },
  ],
  practiceExercise: {
    title: "Concentric circles",
    steps: [
      "Draw a circle of radius 50 at any point.",
      "Run CIRCLE again. At the centre prompt, snap to the centre of the first circle (OSNAP → Center).",
      "Type radius 30 and press Enter.",
      "Repeat for radius 10.",
    ],
    success: "You see three perfectly concentric circles (10, 30, 50). LIST any one to confirm its radius.",
  },
  proTips: [
    "At the radius prompt, type D and Enter to switch into Diameter mode for that one circle.",
    "Inside CIRCLE, type 2P to draw a circle through two points (the two clicks become a diameter).",
    "Use the Ttr option to draw a circle tangent to two existing objects with a given radius.",
  ],
  relatedCommands: [
    { name: "ARC", alias: "A", what: "Draw a portion of a circle." },
    { name: "ELLIPSE", alias: "EL", what: "Draw an oval defined by two axes." },
    { name: "DONUT", alias: "DO", what: "Draw a filled ring (two concentric circles)." },
  ],
};

const richRectangle: RichLesson = {
  commandName: "RECTANGLE",
  learningObjective:
    "By the end of this lesson you can run the RECTANGLE command and draw a precisely sized rectangle as a single closed polyline.",
  whatItIs:
    "RECTANGLE (alias REC, command RECTANG) creates a closed rectangular polyline by asking for two opposite corners. Because the result is one polyline, you can fillet, hatch and offset it in a single click.",
  whyWhen:
    "Use RECTANGLE whenever you need a clean four-sided closed shape — walls, plates, title-block frames, viewports — without stitching four LINE segments together.",
  whereToFind: {
    ribbon: "Home tab → Draw panel → Rectangle button.",
    menu: "Draw menu → Rectangle.",
    commandLine: "Type RECTANG (or REC) and press Enter.",
    alias: "REC (then Enter).",
  },
  vocab: [
    { term: "Polyline", definition: "A single object made of connected line and/or arc segments." },
    { term: "Closed shape", definition: "A shape whose end meets its start, with no gap. Required for HATCH, EXTRUDE, and area calculation." },
    { term: "First corner", definition: "Any one corner of the rectangle — usually the bottom-left in drafting." },
    { term: "Opposite corner", definition: "The diagonally opposite corner that defines width and height." },
    { term: "Dimensions option", definition: "An option inside RECTANG that lets you type a length and width instead of picking the second corner." },
  ],
  beforeYouStart: [
    "Start a fresh drawing from acad.dwt.",
    "Press F3 to make sure OSNAP is on — handy if you'll snap the first corner to existing geometry.",
    "Decide your rectangle's width and height. This lesson uses 200 × 100.",
  ],
  detailedSteps: [
    {
      title: "Start the RECTANGLE command",
      instruction: "Type REC, press Enter.",
      explanation:
        "The command line should now read 'RECTANG Specify first corner point or [Chamfer/Elevation/Fillet/Thickness/Width]:'.",
      screenshot: {
        caption: "Command line showing the RECTANG first-corner prompt with the options in square brackets.",
        sourceUrl: AUTODESK + "?guid=GUID-D6E1E08D-3F8B-4F1E-9B89-7C5F9D6E2F7D",
        imageUrl: SLICE.rectangle_action,
      },
    },
    {
      title: "Pick the first corner",
      instruction: "Click anywhere in the drawing area to place the first corner.",
      explanation:
        "AutoCAD now prompts 'Specify other corner point or [Area/Dimensions/Rotation]:' and a preview rectangle follows the cursor.",
      screenshot: {
        caption: "Preview rectangle stretching from the picked first corner to the cursor.",
        sourceUrl: AUTODESK + "?guid=GUID-D6E1E08D-3F8B-4F1E-9B89-7C5F9D6E2F7D",
        imageUrl: SLICE.rectangle_action,
      },
    },
    {
      title: "Type the second corner relative to the first",
      instruction: "Type @200,100 and press Enter.",
      explanation:
        "@200,100 means 'go 200 units right and 100 units up from the first corner'. The rectangle finishes as a closed polyline in one command — no JOIN needed.",
      screenshot: {
        caption: "Command line: Specify other corner point: @200,100 — completed 200×100 rectangle in the drawing.",
        sourceUrl: AUTODESK + "?guid=GUID-D6E1E08D-3F8B-4F1E-9B89-7C5F9D6E2F7D",
        imageUrl: SLICE.rectangle_after,
      },
    },
    {
      title: "Verify it is one closed polyline",
      instruction: "Hover over any edge — the entire rectangle should highlight together. Click it once to confirm.",
      explanation:
        "If only one edge highlights, you drew four separate LINE segments by mistake. RECTANGLE always produces a single polyline.",
      screenshot: {
        caption: "Whole rectangle highlighted in blue with four grips at the corners and four mid-edge grips.",
        sourceUrl: AUTODESK + "?guid=GUID-D6E1E08D-3F8B-4F1E-9B89-7C5F9D6E2F7D",
        imageUrl: SLICE.rectangle_after,
      },
    },
  ],
  visualReference: {
    caption:
      "RECTANG command reference — Autodesk Help page covering Chamfer, Fillet, Width, Area and Dimensions options.",
    sourceUrl: AUTODESK + "?guid=GUID-D6E1E08D-3F8B-4F1E-9B89-7C5F9D6E2F7D",
    imageUrl: SLICE.rectangle_after,
  },
  commonMistakes: [
    { mistake: "Forgetting the @ symbol and getting a rectangle in the wrong place.", fix: "Always type @ before relative offsets, e.g. @200,100." },
    { mistake: "Using LINE four times instead of REC.", fix: "Use REC so the result is a single closed polyline — much easier to fillet, hatch and offset." },
    { mistake: "Picking corners with the mouse instead of typing dimensions.", fix: "Inside REC, type D, press Enter, then type length and width for exact sizing." },
  ],
  troubleshooting: [
    { problem: "Edges are bevelled instead of square.", cause: "Chamfer option was set in a previous RECTANG and persisted.", fix: "Restart REC, type C, Enter, set both chamfer distances to 0, then continue." },
    { problem: "Corners are rounded.", cause: "Fillet option was set previously.", fix: "Restart REC, type F, Enter, set fillet radius to 0." },
    { problem: "Edges are unexpectedly thick.", cause: "Width option holds a non-zero value.", fix: "Restart REC, type W, Enter, set width back to 0." },
  ],
  practiceExercise: {
    title: "Title-block frame",
    steps: [
      "Draw a 400 × 250 rectangle as the outer sheet boundary.",
      "Run REC again. Snap the first corner to the bottom-left endpoint of the outer rectangle (OSNAP → Endpoint).",
      "Type @400,40 and Enter to create a 400 × 40 title bar at the bottom.",
    ],
    success: "Two clean closed polylines: an outer sheet and a title bar stacked at the bottom-left, perfectly aligned.",
  },
  proTips: [
    "Inside REC, type D for Dimensions to enter length and width as separate prompts.",
    "Inside REC, type R for Rotation to draw the rectangle at any angle without rotating afterwards.",
    "EXPLODE a rectangle to break it back into four LINE segments only when you genuinely need to edit one side independently.",
  ],
  relatedCommands: [
    { name: "POLYGON", alias: "POL", what: "Draw a regular polygon (5, 6, 8 sides…) by centre and radius." },
    { name: "PLINE", alias: "PL", what: "Draw an arbitrary connected polyline." },
    { name: "OFFSET", alias: "O", what: "Make a parallel copy of the rectangle inside or outside." },
  ],
};

const richTrim: RichLesson = {
  commandName: "TRIM",
  learningObjective:
    "By the end of this lesson you can run the TRIM command and cleanly remove overshoots between intersecting objects.",
  whatItIs:
    "TRIM shortens an object so it ends precisely at a cutting edge — another object that crosses it. Anything you click between (or beyond, depending on mode) cutting edges is removed.",
  whyWhen:
    "Use TRIM whenever lines, arcs or circles run past where they should — a typical case is cleaning a tic-tac-toe grid down to a plus sign, or cutting a doorway out of a wall.",
  whereToFind: {
    ribbon: "Home tab → Modify panel → Trim button.",
    menu: "Modify menu → Trim.",
    commandLine: "Type TRIM and press Enter.",
    alias: "TR (then Enter).",
  },
  vocab: [
    { term: "Cutting edge", definition: "An object that defines where the trim happens. Any other object that crosses the segment you want to remove qualifies." },
    { term: "Object to trim", definition: "The portion of geometry you click to remove. It must lie between cutting edges (Standard mode) or anywhere along the line (Quick mode)." },
    { term: "Quick mode", definition: "The default in modern AutoCAD: every visible object acts as a cutting edge; you just click what you want gone." },
    { term: "Standard mode", definition: "Classic behaviour: you first pick cutting edges, press Enter, then click segments to trim." },
    { term: "EXTEND", definition: "The reverse of TRIM — lengthens an object to meet another." },
  ],
  beforeYouStart: [
    "Open a fresh drawing and draw two LINEs that clearly cross each other.",
    "Make sure OSNAP is on (F3) so future picks behave well.",
    "Note which TRIM mode you're in. Default in AutoCAD 2024+ is Quick.",
  ],
  detailedSteps: [
    {
      title: "Set up two crossing lines",
      instruction:
        "Type LINE, Enter. Draw a horizontal line. Press Enter to finish. Run LINE again and draw a vertical line that crosses the first.",
      explanation:
        "TRIM needs two objects that intersect. With nothing to cut against, the command does nothing.",
      screenshot: {
        caption: "Two LINE segments forming a plus sign in the drawing area.",
        sourceUrl: AUTODESK + "?guid=GUID-7C0F6B8C-5C2E-4F7B-9C13-6C2E2C9A3A8E",
        imageUrl: SLICE.trim_before,
      },
    },
    {
      title: "Start the TRIM command",
      instruction: "Type TR, press Enter.",
      explanation:
        "In Quick mode the command line reads 'Select object to trim or shift-select to extend or [cuTting edges/Crossing/mOde/…]'. Every visible object is already acting as a cutting edge.",
      screenshot: {
        caption: "Command line showing the TRIM Quick-mode prompt.",
        sourceUrl: AUTODESK + "?guid=GUID-86D8E8C0-7E2C-4B3F-8F1F-7A8E4C9B7C9A",
        imageUrl: SLICE.trim_before,
      },
    },
    {
      title: "Click the segment(s) you want to remove",
      instruction: "Click the part of the horizontal line that sticks out past the vertical line. Repeat on the other side.",
      explanation:
        "Each click removes the segment between the nearest cutting edges. The remaining geometry stays.",
      screenshot: {
        caption: "Cursor hovering over an overshoot with the segment turning grey to indicate it will be removed.",
        sourceUrl: AUTODESK + "?guid=GUID-86D8E8C0-7E2C-4B3F-8F1F-7A8E4C9B7C9A",
        imageUrl: SLICE.extend_before,
      },
    },
    {
      title: "End the command",
      instruction: "Press Enter or Esc.",
      explanation:
        "TRIM stays active so you can keep clicking. Press Enter (or Esc) to finish.",
      screenshot: {
        caption: "Cleaned-up plus sign with no overshoots. Command line back to 'Command:'.",
        sourceUrl: AUTODESK + "?guid=GUID-86D8E8C0-7E2C-4B3F-8F1F-7A8E4C9B7C9A",
        imageUrl: SLICE.extend_after,
      },
    },
    {
      title: "Switch to Standard mode if needed",
      instruction:
        "Inside TRIM, type O (for mOde), Enter, then S (Standard), Enter.",
      explanation:
        "Standard mode is the legacy flow: pick cutting edges first, press Enter, then click segments. Useful when you have many overlapping objects and want explicit control.",
      screenshot: {
        caption: "Command line transition: TRIM → Enter trim mode option [Quick/Standard] <Quick>: S.",
        sourceUrl: AUTODESK + "?guid=GUID-86D8E8C0-7E2C-4B3F-8F1F-7A8E4C9B7C9A",
      },
    },
  ],
  visualReference: {
    caption:
      "TRIM command reference — Autodesk Help page covering Quick vs Standard mode and the Edge/Project options.",
    sourceUrl: AUTODESK + "?guid=GUID-86D8E8C0-7E2C-4B3F-8F1F-7A8E4C9B7C9A",
    imageUrl: SLICE.trim_before,
  },
  commonMistakes: [
    { mistake: "In Standard mode, pressing Enter only once and getting no result.", fix: "Press Enter TWICE — the second Enter selects every visible object as a cutting edge." },
    { mistake: "Clicking a segment that has no cutting edge crossing it.", fix: "Make sure another object actually crosses the segment, or use EXTEND if you wanted to lengthen instead." },
    { mistake: "Trimming the wrong side.", fix: "Press Ctrl + Z to undo just the last trim without leaving the command, then click the correct piece." },
  ],
  troubleshooting: [
    { problem: "Nothing happens when I click.", cause: "Your cursor is not on a trimmable segment, or there is no cutting edge.", fix: "Hover until the segment previews grey, or add an intersecting object first." },
    { problem: "TRIM removed too much / a whole line vanished.", cause: "There were no cutting edges between the start and end of the line.", fix: "Press Ctrl + Z inside the command to undo, then draw the cutting object first." },
    { problem: "I am in the wrong mode and want classic behaviour.", cause: "AutoCAD remembers the last mode used.", fix: "Inside TRIM type O, Enter, S, Enter to switch to Standard." },
  ],
  practiceExercise: {
    title: "Tic-tac-toe → Plus sign",
    steps: [
      "Draw four LINEs that form a # (tic-tac-toe) shape.",
      "Run TRIM (TR, Enter).",
      "Click each of the eight overshoot segments around the central square.",
      "Press Enter to finish.",
    ],
    success: "Only the central plus sign remains — every overshoot is gone, no gaps, no stray lines.",
  },
  proTips: [
    "Hold Shift while clicking inside TRIM to EXTEND instead of trim — one command, two behaviours.",
    "Use the Fence option (type F inside TRIM) to draw a line that trims every object it crosses in one drag.",
    "Use the Crossing option (type C) to box-select many segments to trim at once.",
  ],
  relatedCommands: [
    { name: "EXTEND", alias: "EX", what: "Lengthen an object to meet another — the inverse of TRIM." },
    { name: "ERASE", alias: "E", what: "Delete an entire object outright." },
    { name: "BREAK", alias: "BR", what: "Split an object at one or two specified points." },
  ],
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
    rich: richInterface,
  },
  {
    id: "line", day: 2, title: "LINE", tag: "Drawing", xp: 60,
    description: "Draw your first precise straight segment with typed coordinates.",
    objective: "Use the LINE command with a typed relative coordinate.",
    steps: [
      "Type LINE, press Enter. Click a start point.",
      "Type @100,0 and press Enter to draw a 100-unit horizontal line.",
      "Press Enter once more to end the LINE command.",
      "Save your file as Lesson02-LINE.dwg.",
    ],
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200",
    mistake: "Forgetting the @ before relative coordinates.",
    challenge: "Draw a 200×100 rectangle using only LINE and the C (close) option.",
    rich: richLine,
  },
  {
    id: "circle", day: 3, title: "CIRCLE", tag: "Drawing", xp: 60,
    description: "Draw a precise circle by centre and radius.",
    objective: "Use the CIRCLE command with a typed radius.",
    steps: [
      "Type CIRCLE (or C), press Enter.",
      "Click a centre point in the drawing area.",
      "Type 50 and press Enter for the radius.",
      "Run LIST and click the circle to verify radius = 50.",
    ],
    image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=1200",
    mistake: "Eyeballing the radius with a click instead of typing a number.",
    challenge: "Draw three concentric circles of radius 10, 30 and 50.",
    rich: richCircle,
  },
  {
    id: "rectangle", day: 4, title: "RECTANGLE", tag: "Drawing", xp: 60,
    description: "Draw a closed four-sided polyline in a single command.",
    objective: "Use the RECTANGLE command with a typed relative second corner.",
    steps: [
      "Type REC, press Enter.",
      "Click a first corner.",
      "Type @200,100 and press Enter for the opposite corner.",
      "Click any edge to confirm the result is one closed polyline.",
    ],
    image: "https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=1200",
    mistake: "Drawing four LINE segments when REC would have made a single closed polyline.",
    challenge: "Build a 400×250 frame with a 400×40 title bar snapped to its bottom-left.",
    rich: richRectangle,
  },
  {
    id: "trim", day: 5, title: "TRIM", tag: "Editing", xp: 60,
    description: "Clean up your geometry like a pro.",
    objective: "Use TRIM to remove overshoots between intersecting objects.",
    steps: [
      "Draw two crossing lines.",
      "Type TR and press Enter.",
      "Click the segment(s) you want to remove.",
      "Press Enter or Esc when finished.",
    ],
    image: "https://images.unsplash.com/photo-1545972154-9bb223aac798?w=1200",
    mistake: "In Standard mode, pressing Enter only once — Standard TRIM expects cutting edges first, so press Enter twice.",
    challenge: "Draw a tic-tac-toe grid and TRIM it down to a plus sign.",
    rich: richTrim,
  },
  {
    id: "move-copy", day: 6, title: "MOVE + COPY", tag: "Editing", xp: 60,
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
    id: "osnap", day: 7, title: "Precision with OSNAP", tag: "Precision", xp: 70,
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
    id: "layers", day: 8, title: "Layers Basics", tag: "Organization", xp: 70,
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
    id: "dim-text", day: 9, title: "Dimensions + Text", tag: "Annotation", xp: 70,
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
    id: "hatch", day: 10, title: "HATCH", tag: "Fill", xp: 60,
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
    id: "blocks", day: 11, title: "BLOCKS", tag: "Reusability", xp: 80,
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
    id: "join", day: 12, title: "JOIN", tag: "Editing", xp: 60,
    description: "Combine separate segments into one polyline.",
    objective: "Use JOIN (J) to merge connected lines.",
    steps: [
      "Type J, press Enter.",
      "Select all connected segments.",
      "Press Enter — they become a single polyline.",
    ],
    image: joinAfter.url,
    mistake: "JOIN says '0 joined' when endpoints don't touch — use OSNAP first.",
    challenge: "Draw 4 lines that form a square and JOIN them into one polyline.",
    media: {
      hero: joinAfter.url,
      action: { src: joinAction.url, caption: "Each line starts as a separate object — select them all, then run JOIN." },
      before: { src: joinAction.url, caption: "Before: four separate line segments." },
      after: { src: joinAfter.url, caption: "After: a single closed polyline you can edit as one object." },
      error: { src: joinError.url, caption: "If endpoints don't touch exactly, JOIN fails — snap them first with OSNAP (F3)." },
    },
  },
  {
    id: "extrude", day: 13, title: "EXTRUDE", tag: "3D", xp: 90,
    description: "Push 2D shapes into 3D solids.",
    objective: "Use EXTRUDE on a closed polyline.",
    steps: [
      "Switch workspace to 3D Modeling.",
      "Draw a closed polyline or use a circle.",
      "Type EXT, press Enter, select object.",
      "Type a height like 50 and press Enter.",
      "Type VS then C for Conceptual view.",
    ],
    image: extrudeAfter.url,
    mistake: "EXTRUDE only works on CLOSED shapes — JOIN first.",
    challenge: "Extrude a hexagon to 100 units tall.",
    media: {
      hero: extrudeAfter.url,
      action: { src: extrudeAction.url, caption: "EXTRUDE → click the closed shape → drag upward to set height." },
      before: { src: extrudeBefore.url, caption: "Before: a flat 2D closed shape." },
      after: { src: extrudeAfter.url, caption: "After: the shape pushed into a 3D solid." },
    },
  },
  {
    id: "polyline-rect", day: 14, title: "POLYLINE Deep-Dive", tag: "Drawing", xp: 60,
    description: "Draw connected geometry as one object using PLINE options.",
    objective: "Use PL with the Arc, Close and Width options.",
    steps: [
      "Type PL, press Enter, click points to draw.",
      "Type C to close back to start.",
      "Try the A (Arc) option mid-polyline to add a curved segment.",
    ],
    image: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=1200",
    mistake: "Using LINE when you need a single closed shape — pick PLINE instead.",
    challenge: "Draw an L-shape with POLYLINE and close it.",
  },
  {
    id: "offset-mirror", day: 15, title: "OFFSET + MIRROR", tag: "Editing", xp: 70,
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
    id: "fillet-chamfer", day: 16, title: "FILLET + CHAMFER", tag: "Editing", xp: 70,
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
    id: "array-review", day: 17, title: "ARRAY + Dimensions Review", tag: "Review", xp: 100,
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
  line: [
    { q: "How do you confirm a typed coordinate in AutoCAD?", choices: ["Space then Tab", "Press Enter", "Click again", "Press Esc"], answer: 1, xp: 10, explanation: "AutoCAD commits a typed coordinate on Enter (or Spacebar)." },
    { q: "What does @100,0 mean as the next point inside LINE?", choices: ["Absolute point 100,0 from origin", "100 units right of the previous point", "Radius 100, angle 0", "Diameter 100"], answer: 1, xp: 10, explanation: "The @ prefix makes the coordinate relative to the previous point." },
    { q: "Which option ends LINE by closing the chain back to the first point?", choices: ["E", "U", "C", "X"], answer: 2, xp: 10, explanation: "Inside LINE, typing C and pressing Enter closes the chain back to the very first point." },
  ],
  circle: [
    { q: "After CIRCLE, what does AutoCAD ask for first?", choices: ["Radius", "Center point", "Diameter", "A layer"], answer: 1, xp: 10, explanation: "CIRCLE asks for the centre point first, then the radius or diameter." },
    { q: "At the radius prompt, how do you switch to typing a diameter instead?", choices: ["Type X then Enter", "Type D then Enter", "Press Esc", "Press Tab"], answer: 1, xp: 10, explanation: "Type D and press Enter to switch that one circle to Diameter mode." },
    { q: "Which option draws a circle through two clicks that form a diameter?", choices: ["2P", "3P", "Ttr", "C"], answer: 0, xp: 10, explanation: "Inside CIRCLE, the 2P option uses two picked points as the endpoints of a diameter." },
  ],
  rectangle: [
    { q: "REC asks for which two inputs?", choices: ["Centre and radius", "Two opposite corners", "Three corners", "A length only"], answer: 1, xp: 10, explanation: "RECTANG is defined by two diagonally opposite corners." },
    { q: "What does the result of REC behave as?", choices: ["Four separate lines", "A single closed polyline", "An infinite construction line", "A block"], answer: 1, xp: 10, explanation: "RECTANG produces a single closed polyline — handy for HATCH, FILLET and OFFSET." },
    { q: "Inside REC, which option lets you type length and width separately?", choices: ["A (Area)", "D (Dimensions)", "R (Rotation)", "F (Fillet)"], answer: 1, xp: 10, explanation: "The Dimensions option prompts for length then width instead of the second corner." },
  ],
  trim: [
    { q: "In Standard mode, how many times do you press Enter to select 'all' as cutting edges?", choices: ["Once", "Twice", "Three times", "Hold Shift+Enter"], answer: 1, xp: 10, explanation: "In Standard TRIM, type TR then press Enter twice — the second Enter selects every visible object as cutting edges." },
    { q: "In Quick mode (default in modern AutoCAD), what acts as a cutting edge?", choices: ["Nothing — you must pick edges", "Only objects on the current layer", "Every visible object", "Only locked objects"], answer: 2, xp: 10, explanation: "Quick mode treats every visible object as a cutting edge automatically — you just click what to remove." },
    { q: "Holding Shift while clicking inside TRIM does what?", choices: ["Deletes the object entirely", "Switches to EXTEND for that pick", "Cancels the command", "Selects a layer"], answer: 1, xp: 10, explanation: "Shift-click inside TRIM extends instead of trims, so you don't need to switch commands." },
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