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
import circleStep5VisualReference from "@/assets/circle_step5_visual_reference.png.asset.json";
import rectangleStep1StartCommand from "@/assets/rectangle_step1_start_command.png.asset.json";
import rectangleStep2PickFirstCorner from "@/assets/rectangle_step2_pick_first_corner.png.asset.json";
import rectangleStep3TypeSecondCorner from "@/assets/rectangle_step3_type_second_corner.png.asset.json";
import rectangleStep4VerifyPolyline from "@/assets/rectangle_step4_verify_polyline.png.asset.json";
import rectangleStep5VisualReference from "@/assets/rectangle_step5_visual_reference.png.asset.json";
import trimStep1CrossingLines from "@/assets/trim_step1_crossing_lines.png.asset.json";
import trimStep2StartTrimCommand from "@/assets/trim_step2_start_trim_command.png.asset.json";
import trimStep3ClickSegmentRemove from "@/assets/trim_step3_click_segment_remove.png.asset.json";
import trimStep4EndCommand from "@/assets/trim_step4_end_command.png.asset.json";
import trimStep5StandardMode from "@/assets/trim_step5_standard_mode.png.asset.json";
import trimStep6VisualReference from "@/assets/trim_step6_visual_reference.png.asset.json";
import movecopyStep1SelectObject from "@/assets/movecopy_step1_select_object.png.asset.json";
import movecopyStep2StartMove from "@/assets/movecopy_step2_start_move_command.png.asset.json";
import movecopyStep3PickBasePoint from "@/assets/movecopy_step3_pick_snapped_base_point.png.asset.json";
import movecopyStep4SpecifyDestination from "@/assets/movecopy_step4_specify_destination.png.asset.json";
import movecopyStep5DuplicateCopy from "@/assets/movecopy_step5_duplicate_copy.png.asset.json";
import movecopyStep6VisualReference from "@/assets/movecopy_step6_visual_reference.png.asset.json";
import osnapStep1ToggleOn from "@/assets/osnap_step1_toggle_osnap_on.png.asset.json";
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
      imageUrl?: string;
    };
  }[];
  visualReference?: {
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
        imageUrl: interfaceStep5ZoomExtents.url,
      },
    },
  ],
  visualReference: {
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
        imageUrl: lineStep2PickStartPoint.url,
      },
    },
    {
      title: "Type a relative coordinate for the second point",
      instruction: "Type @100,0 and press Enter.",
      explanation:
        "@100,0 means 'go 100 units along X and 0 along Y from the previous point' — i.e. 100 units to the right. This is exactly the kind of typed precision that separates CAD from sketching.",
      screenshot: {
        imageUrl: lineStep3RelativeCoordinate.url,
      },
    },
    {
      title: "End the LINE command",
      instruction: "Press Enter once more (or press Esc).",
      explanation:
        "Pressing Enter on the next-point prompt ends the chain. The single horizontal segment stays in the drawing.",
      screenshot: {
        imageUrl: lineStep4EndCommand.url,
      },
    },
    {
      title: "Save your work",
      instruction: "Press Ctrl + S, choose a folder, name the file Lesson02-LINE.dwg, click Save.",
      explanation:
        "Saving early and often is non-negotiable in CAD. .dwg is AutoCAD's native format.",
      screenshot: {
        imageUrl: lineStep5SaveWork.url,
      },
    },
  ],
  visualReference: {
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
        imageUrl: circleStep1StartCommand.url,
      },
    },
    {
      title: "Click the centre point",
      instruction: "Click anywhere in the drawing area to place the centre.",
      explanation:
        "AutoCAD now prompts 'Specify radius of circle or [Diameter]:' and a preview circle follows the cursor.",
      screenshot: {
        imageUrl: circleStep2ClickCentre.url,
      },
    },
    {
      title: "Type the radius",
      instruction: "Type 50 and press Enter.",
      explanation:
        "AutoCAD draws a circle with a radius of 50 drawing units around your centre point and exits the command.",
      screenshot: {
        imageUrl: circleStep3TypeRadius.url,
      },
    },
    {
      title: "Confirm the size with a quick check",
      instruction: "Type LIST, press Enter, click the circle, press Enter.",
      explanation:
        "LIST prints the object's properties to the command-line history (press F2 to see them). You'll see RADIUS = 50.0000 and the centre coordinates.",
      screenshot: {
        imageUrl: circleStep4ConfirmSize.url,
      },
    },
  ],
  visualReference: {
    imageUrl: circleStep5VisualReference.url,
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
        imageUrl: rectangleStep1StartCommand.url,
      },
    },
    {
      title: "Pick the first corner",
      instruction: "Click anywhere in the drawing area to place the first corner.",
      explanation:
        "AutoCAD now prompts 'Specify other corner point or [Area/Dimensions/Rotation]:' and a preview rectangle follows the cursor.",
      screenshot: {
        imageUrl: rectangleStep2PickFirstCorner.url,
      },
    },
    {
      title: "Type the second corner relative to the first",
      instruction: "Type @200,100 and press Enter.",
      explanation:
        "@200,100 means 'go 200 units right and 100 units up from the first corner'. The rectangle finishes as a closed polyline in one command — no JOIN needed.",
      screenshot: {
        imageUrl: rectangleStep3TypeSecondCorner.url,
      },
    },
    {
      title: "Verify it is one closed polyline",
      instruction: "Hover over any edge — the entire rectangle should highlight together. Click it once to confirm.",
      explanation:
        "If only one edge highlights, you drew four separate LINE segments by mistake. RECTANGLE always produces a single polyline.",
      screenshot: {
        imageUrl: rectangleStep4VerifyPolyline.url,
      },
    },
  ],
  visualReference: {
    imageUrl: rectangleStep5VisualReference.url,
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
        imageUrl: trimStep1CrossingLines.url,
      },
    },
    {
      title: "Start the TRIM command",
      instruction: "Type TR, press Enter.",
      explanation:
        "In Quick mode the command line reads 'Select object to trim or shift-select to extend or [cuTting edges/Crossing/mOde/…]'. Every visible object is already acting as a cutting edge.",
      screenshot: {
        imageUrl: trimStep2StartTrimCommand.url,
      },
    },
    {
      title: "Click the segment(s) you want to remove",
      instruction: "Click the part of the horizontal line that sticks out past the vertical line. Repeat on the other side.",
      explanation:
        "Each click removes the segment between the nearest cutting edges. The remaining geometry stays.",
      screenshot: {
        imageUrl: trimStep3ClickSegmentRemove.url,
      },
    },
    {
      title: "End the command",
      instruction: "Press Enter or Esc.",
      explanation:
        "TRIM stays active so you can keep clicking. Press Enter (or Esc) to finish.",
      screenshot: {
        imageUrl: trimStep4EndCommand.url,
      },
    },
    {
      title: "Switch to Standard mode if needed",
      instruction:
        "Inside TRIM, type O (for mOde), Enter, then S (Standard), Enter.",
      explanation:
        "Standard mode is the legacy flow: pick cutting edges first, press Enter, then click segments. Useful when you have many overlapping objects and want explicit control.",
      screenshot: {
        imageUrl: trimStep5StandardMode.url,
      },
    },
  ],
  visualReference: {
    imageUrl: trimStep6VisualReference.url,
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

const emptyShot = { imageUrl: undefined as string | undefined };

const richMoveCopy: RichLesson = {
  commandName: "MOVE + COPY",
  learningObjective:
    "By the end of this lesson you can reposition and duplicate any object precisely using a snapped base point and a typed displacement.",
  whatItIs:
    "MOVE relocates one or more selected objects from a base point to a destination point. COPY does the same thing but leaves the original in place and can repeat multiple copies in one command.",
  whyWhen:
    "Use MOVE whenever geometry is in the wrong place. Use COPY whenever you need an identical duplicate — a second window, a row of bolts, a duplicated detail.",
  whereToFind: {
    ribbon: "Home tab → Modify panel → Move / Copy buttons.",
    menu: "Modify menu → Move, Modify menu → Copy.",
    commandLine: "Type MOVE or COPY and press Enter.",
    alias: "M for MOVE, CO for COPY.",
  },
  vocab: [
    { term: "Base point", definition: "The grab handle of the move/copy — the point you pick up the object by." },
    { term: "Second point / displacement", definition: "Where the base point lands after the move." },
    { term: "Selection set", definition: "The collection of objects you have currently selected." },
  ],
  beforeYouStart: [
    "Have at least one drawn object on screen.",
    "Turn OSNAP on (F3) so the base point lands on a real endpoint or corner.",
    "Press Esc twice to clear any stale selection before starting.",
  ],
  detailedSteps: [
    {
      title: "Select the object you want to move",
      instruction: "Click the object once so it shows blue grips.",
      explanation: "Picking first means MOVE will use the current selection set instead of asking for one.",
      screenshot: {
        imageUrl: movecopyStep1SelectObject.url,
      },
    },
    {
      title: "Start the MOVE command",
      instruction: "Type M and press Enter.",
      explanation: "The command line now reads 'Specify base point or [Displacement]:'. AutoCAD is waiting for the grab handle.",
      screenshot: {
        imageUrl: movecopyStep2StartMove.url,
      },
    },
    {
      title: "Pick a snapped base point",
      instruction: "Hover over a corner or endpoint until the green snap marker appears, then click.",
      explanation: "Snapping to real geometry gives you a precise, repeatable offset — not an eyeballed shift.",
      screenshot: {
        imageUrl: movecopyStep3PickBasePoint.url,
      },
    },
    {
      title: "Specify the destination",
      instruction: "Click the new location, or type a relative coordinate like @100,0 and press Enter.",
      explanation: "Typed coordinates move by an exact distance; clicked points let you snap onto existing geometry.",
      screenshot: {
        imageUrl: movecopyStep4SpecifyDestination.url,
      },
    },
    {
      title: "Duplicate instead with COPY",
      instruction: "Press Esc, select the object again, type CO, Enter. Repeat steps 3 and 4 — but COPY keeps prompting for more destinations until you press Enter.",
      explanation: "COPY mirrors the MOVE workflow but is non-destructive and can place multiple copies in one command.",
      screenshot: {
        imageUrl: movecopyStep5DuplicateCopy.url,
      },
    },
  ],
  visualReference: {
    imageUrl: movecopyStep6VisualReference.url,
  },
  commonMistakes: [
    { mistake: "Picking a random empty point as the base point.", fix: "Always snap to a corner, endpoint, midpoint or centre so the move is precise." },
    { mistake: "Using MOVE when you wanted to keep the original.", fix: "Press Ctrl + Z and rerun with COPY (CO) instead." },
    { mistake: "Pressing Enter inside COPY too early.", fix: "Inside COPY, Enter ends the command — keep clicking destinations to place more copies first." },
  ],
  troubleshooting: [
    { problem: "AutoCAD asks 'Select objects' even though I already picked one.", cause: "The selection was lost when you started the command.", fix: "Click the object, THEN type M. Or pick it again at the prompt." },
    { problem: "The object jumped to a strange location.", cause: "Dynamic input interpreted a click as an absolute coordinate.", fix: "Type @x,y for a relative displacement, or snap to a known point." },
  ],
  practiceExercise: {
    title: "Five circles in a row, 100 units apart",
    steps: [
      "Draw one circle of radius 20.",
      "Type CO, Enter. Select the circle. Press Enter.",
      "Pick its centre as the base point.",
      "Type @100,0 Enter, @200,0 Enter, @300,0 Enter, @400,0 Enter.",
      "Press Enter to end COPY.",
    ],
    success: "Five identical circles stand in a perfectly spaced horizontal row.",
  },
  proTips: [
    "Inside COPY, type A (Array) to drop copies at a fixed spacing automatically.",
    "Hold Ctrl when dragging blue grips for a quick visual move without typing.",
    "Use 0,0 as a base point and a real coordinate as the destination to position objects absolutely.",
  ],
  relatedCommands: [
    { name: "STRETCH", alias: "S", what: "Move part of an object while keeping it connected to the rest." },
    { name: "ROTATE", alias: "RO", what: "Rotate selected objects around a base point." },
    { name: "MIRROR", alias: "MI", what: "Reflect a copy across a line." },
  ],
};

const richOsnap: RichLesson = {
  commandName: "OSNAP",
  learningObjective:
    "By the end of this lesson you can enable Object Snap, choose the right snap modes, and consistently land your cursor on exact geometry.",
  whatItIs:
    "OSNAP (Object Snap) makes the cursor jump to meaningful points on existing geometry — endpoints, midpoints, centres, intersections — instead of an eyeballed pixel.",
  whyWhen:
    "Every drawing needs geometry that truly connects. Without OSNAP, endpoints land a fraction off and TRIM, JOIN, HATCH and EXTRUDE all break later.",
  whereToFind: {
    ribbon: "Status bar → Object Snap icon (looks like a small square with a dot).",
    menu: "Right-click the Object Snap icon → Object Snap Settings.",
    commandLine: "Type OSNAP and press Enter to open the settings dialog.",
    alias: "F3 toggles OSNAP on/off.",
  },
  vocab: [
    { term: "Endpoint", definition: "Either tip of a line, arc or polyline segment." },
    { term: "Midpoint", definition: "The exact middle of a segment." },
    { term: "Center", definition: "The middle of a circle, arc or ellipse." },
    { term: "Intersection", definition: "The point where two objects cross." },
    { term: "Marker", definition: "The coloured glyph that appears under the cursor when a snap is found." },
  ],
  beforeYouStart: [
    "Have a few intersecting lines and circles already drawn.",
    "Press F3 once and watch the status bar icon — it should highlight blue when OSNAP is on.",
    "Press F12 so dynamic input shows the snap tooltip next to the crosshair.",
  ],
  detailedSteps: [
    {
      title: "Toggle OSNAP on",
      instruction: "Press F3. The status-bar Object Snap icon highlights blue.",
      explanation: "F3 is the master switch. Without it, no snap modes fire.",
      screenshot: {
        imageUrl: osnapStep1ToggleOn.url,
      },
    },
    {
      title: "Open snap settings",
      instruction: "Right-click the Object Snap icon on the status bar and choose 'Object Snap Settings…'.",
      explanation: "The dialog lists every available snap mode with a checkbox.",
      screenshot: emptyShot,
    },
    {
      title: "Enable the essentials",
      instruction: "Tick Endpoint, Midpoint, Center and Intersection. Click OK.",
      explanation: "These four cover 90 % of all snaps and rarely conflict with one another.",
      screenshot: emptyShot,
    },
    {
      title: "Hover and watch the marker",
      instruction: "Start any command (e.g. LINE), then hover near an existing endpoint. A coloured square appears.",
      explanation: "Each snap mode shows a different marker shape — square for endpoint, triangle for midpoint, circle for centre.",
      screenshot: emptyShot,
    },
    {
      title: "Click to commit the snap",
      instruction: "Click while the marker is visible. The point lands exactly on that geometry.",
      explanation: "If you click without a marker, you commit the cursor pixel — not the snapped point.",
      screenshot: emptyShot,
    },
  ],
  visualReference: emptyShot,
  commonMistakes: [
    { mistake: "Drawing without F3 on and wondering why JOIN fails.", fix: "Always check the status-bar Object Snap icon before you start." },
    { mistake: "Enabling every snap mode at once.", fix: "Too many modes fight each other. Keep four: Endpoint, Midpoint, Center, Intersection." },
    { mistake: "Clicking before the marker appears.", fix: "Wait for the coloured marker. If it's missing, you didn't snap." },
  ],
  troubleshooting: [
    { problem: "No markers show up.", cause: "OSNAP is off, or no snap modes are checked.", fix: "Press F3, then right-click the icon and tick at least Endpoint and Midpoint." },
    { problem: "Marker shows for the wrong point.", cause: "Multiple snap modes overlap on dense geometry.", fix: "Tap Tab to cycle through nearby snap candidates." },
  ],
  practiceExercise: {
    title: "Snapped triangle on three circles",
    steps: [
      "Draw three circles at random positions.",
      "Press F3 to confirm OSNAP is on.",
      "Run LINE and snap the start point to the first circle's centre.",
      "Snap the next two points to the other two centres.",
      "Type C, Enter to close the triangle.",
    ],
    success: "A triangle whose three vertices land exactly on the three circle centres — no offsets, no gaps.",
  },
  proTips: [
    "Hold Shift + right-click during any command to pop up a one-shot snap menu.",
    "Press Tab while hovering near overlapping geometry to cycle through snap candidates.",
    "Turn Polar tracking (F10) on alongside OSNAP for accurate angled snapping.",
  ],
  relatedCommands: [
    { name: "OSNAP", what: "Open the snap-settings dialog directly." },
    { name: "OTRACK", what: "Object snap tracking — extend snap alignments across the screen." },
    { name: "ORTHO", alias: "F8", what: "Lock the cursor to horizontal or vertical." },
  ],
};

const richLayers: RichLesson = {
  commandName: "LAYERS",
  learningObjective:
    "By the end of this lesson you can create named layers, set their colour, and assign objects to them so your drawing is organised and controllable.",
  whatItIs:
    "A layer is a named container for geometry. Each layer has a colour, linetype, lineweight and visibility state. Every object in AutoCAD belongs to exactly one layer.",
  whyWhen:
    "Layers let you turn whole categories of geometry on/off, change their colour globally, or lock them so they can't be edited. Without layers, complex drawings become unworkable.",
  whereToFind: {
    ribbon: "Home tab → Layers panel → Layer Properties button.",
    menu: "Format menu → Layer.",
    commandLine: "Type LAYER and press Enter.",
    alias: "LA (then Enter).",
  },
  vocab: [
    { term: "Layer", definition: "A named group that controls colour, linetype and visibility for the objects on it." },
    { term: "Current layer", definition: "The layer that any newly drawn object lands on." },
    { term: "Freeze", definition: "Hide and skip a layer entirely — faster than turning it off." },
    { term: "Lock", definition: "Make a layer visible but uneditable." },
    { term: "Layer 0", definition: "The default starter layer. Reserve it for blocks, not for normal geometry." },
  ],
  beforeYouStart: [
    "Open a drawing with at least a few objects.",
    "Decide which categories of geometry you have — walls, doors, dimensions, text…",
    "Pick a colour for each category before you start so it is consistent.",
  ],
  detailedSteps: [
    {
      title: "Open Layer Properties Manager",
      instruction: "Type LA and press Enter.",
      explanation: "A docked panel opens, listing every layer in the drawing.",
      screenshot: emptyShot,
    },
    {
      title: "Create a new layer",
      instruction: "Click the 'New Layer' icon (small yellow star). Type a name like Walls and press Enter.",
      explanation: "The new layer inherits default properties — change colour and linetype next.",
      screenshot: emptyShot,
    },
    {
      title: "Set a colour",
      instruction: "Click the colour swatch next to Walls. Pick white. Click OK.",
      explanation: "Colour is how you visually separate layers on screen and on plots.",
      screenshot: emptyShot,
    },
    {
      title: "Repeat for more layers",
      instruction: "Create Doors (cyan) and Dims (red) the same way.",
      explanation: "A handful of well-named layers beats dozens of vague ones.",
      screenshot: emptyShot,
    },
    {
      title: "Assign an object to a layer",
      instruction: "Close the panel. Click a wall object. In the Layer dropdown on the Home tab, pick Walls.",
      explanation: "The object now adopts that layer's colour, linetype and visibility settings.",
      screenshot: emptyShot,
    },
    {
      title: "Set the current layer",
      instruction: "With nothing selected, pick Walls from the Layer dropdown. New geometry will land on Walls.",
      explanation: "Always set the current layer BEFORE drawing — fixing it afterwards is tedious.",
      screenshot: emptyShot,
    },
  ],
  visualReference: emptyShot,
  commonMistakes: [
    { mistake: "Drawing everything on Layer 0.", fix: "Set a meaningful current layer first, or move objects to one afterwards." },
    { mistake: "Naming layers Layer1, Layer2…", fix: "Use category names — Walls, Doors, Hatching, Text — your future self will thank you." },
    { mistake: "Using bylayer colour overrides on objects.", fix: "Leave object colour as ByLayer so changing the layer colour updates everything together." },
  ],
  troubleshooting: [
    { problem: "I can see a layer but can't edit it.", cause: "The layer is locked.", fix: "Click the padlock icon next to the layer in Layer Properties." },
    { problem: "I assigned a layer but the colour didn't change.", cause: "The object's colour was overridden directly, not set to ByLayer.", fix: "Select the object, open Properties (Ctrl + 1), set Colour = ByLayer." },
  ],
  practiceExercise: {
    title: "Three-layer cleanup",
    steps: [
      "Open a drawing or draw three different categories of objects on Layer 0.",
      "Create Walls (white), Doors (cyan), Dims (red).",
      "Select each object and assign it to the correct layer.",
      "Turn Doors off — only walls and dims should remain visible.",
    ],
    success: "Every object lives on a named layer, and toggling a layer hides or shows just that category.",
  },
  proTips: [
    "Type LAYISO and pick an object to instantly isolate just that layer.",
    "Use LAYMCH to match one object's layer to another's by clicking.",
    "Lock background layers (e.g. an xref) so they're visible but can't be accidentally moved.",
  ],
  relatedCommands: [
    { name: "LAYISO", what: "Isolate the layer of the picked object — hides all others." },
    { name: "LAYMCH", what: "Move objects to the layer of another picked object." },
    { name: "LAYOFF", what: "Turn off the layer of the picked object." },
  ],
};

const richDimText: RichLesson = {
  commandName: "DIM + TEXT",
  learningObjective:
    "By the end of this lesson you can dimension a measured line and add a readable text label to a drawing.",
  whatItIs:
    "DIM creates dimension objects that automatically display the measured distance between two points. TEXT places a single line of plain text at a chosen height and location.",
  whyWhen:
    "Geometry alone is not a drawing — manufacturers, builders and reviewers need numbers and labels. DIM and TEXT turn a sketch into a communicable document.",
  whereToFind: {
    ribbon: "Annotate tab → Dimensions panel → Dimension button; Annotation panel → Text button.",
    menu: "Dimension menu → Dimension; Draw menu → Text → Single Line.",
    commandLine: "Type DIM or TEXT and press Enter.",
    alias: "DIM for dimension, TEXT for single-line text.",
  },
  vocab: [
    { term: "Dimension style", definition: "A saved bundle of arrow size, text height and units used by DIM." },
    { term: "Extension line", definition: "The two short lines that connect the geometry to the dimension line." },
    { term: "Text height", definition: "How tall the text characters are in drawing units." },
    { term: "Annotation scale", definition: "A multiplier that keeps annotation readable at different plot scales." },
  ],
  beforeYouStart: [
    "Open a drawing with at least one line or rectangle to dimension.",
    "Confirm OSNAP is on so dimension picks land on real endpoints.",
    "Create or set a layer named Dims for dimension objects.",
  ],
  detailedSteps: [
    {
      title: "Start the DIM command",
      instruction: "Type DIM and press Enter.",
      explanation: "DIM is the smart dimension — it auto-detects whether you're dimensioning a length, angle or radius.",
      screenshot: emptyShot,
    },
    {
      title: "Pick the first endpoint",
      instruction: "Snap to one endpoint of the line you want to measure and click.",
      explanation: "OSNAP makes sure the dimension hooks onto the exact corner — not a pixel near it.",
      screenshot: emptyShot,
    },
    {
      title: "Pick the second endpoint",
      instruction: "Snap to the other endpoint of the line and click.",
      explanation: "AutoCAD now previews the dimension following your cursor.",
      screenshot: emptyShot,
    },
    {
      title: "Place the dimension line",
      instruction: "Move the cursor away from the geometry and click to set the dimension line position.",
      explanation: "Distance from the geometry controls how readable the dimension is. Keep it consistent across the drawing.",
      screenshot: emptyShot,
    },
    {
      title: "Add a single-line text label",
      instruction: "Type TEXT, Enter. Click a location. Type 10 and Enter for text height. Type your label and Enter twice.",
      explanation: "Height is in drawing units — 10 mm on a 1:1 layout is roughly suitable for an A3 sheet.",
      screenshot: emptyShot,
    },
  ],
  visualReference: emptyShot,
  commonMistakes: [
    { mistake: "Setting text height too small.", fix: "Tiny text vanishes when plotted. Start at height 5–10 and adjust to suit the plot scale." },
    { mistake: "Dimensioning eyeballed picks instead of snapped endpoints.", fix: "Always turn OSNAP on so the dimension reads the true geometry length." },
    { mistake: "Putting dimensions on the same layer as geometry.", fix: "Use a Dims layer so you can hide or freeze all dimensions in one click." },
  ],
  troubleshooting: [
    { problem: "DIM shows the wrong number.", cause: "You snapped to a point that wasn't actually the endpoint.", fix: "Undo, turn on Endpoint snap, repick." },
    { problem: "Text appears huge or invisible.", cause: "Wrong text height for the drawing scale.", fix: "Select the text, open Properties (Ctrl + 1) and adjust Height." },
  ],
  practiceExercise: {
    title: "Dimension a 100×200 rectangle",
    steps: [
      "Draw a 100×200 rectangle with REC.",
      "Run DIM and dimension all four sides.",
      "Run TEXT, height 10, label it 'Plate A'.",
    ],
    success: "Every side of the rectangle has a dimension, and a clear text label sits next to it.",
  },
  proTips: [
    "Type D to open Dimension Style Manager and tune arrow size, text height and units once for the whole drawing.",
    "Use MTEXT for multi-line paragraphs instead of TEXT.",
    "Set annotation scale on the status bar so dimensions auto-scale across viewports.",
  ],
  relatedCommands: [
    { name: "MTEXT", alias: "T", what: "Multi-line paragraph text with formatting." },
    { name: "DIMSTYLE", alias: "D", what: "Open Dimension Style Manager." },
    { name: "DIMRADIUS", what: "Dimension a circle or arc by radius." },
  ],
};

const richHatch: RichLesson = {
  commandName: "HATCH",
  learningObjective:
    "By the end of this lesson you can fill an enclosed region with a pattern and adjust its angle and scale.",
  whatItIs:
    "HATCH fills a closed boundary with a repeating pattern — used for materials (concrete, brick), section views and visual emphasis.",
  whyWhen:
    "Hatching communicates what something is made of or shows that it has been cut through. Indispensable in architectural and mechanical drawings.",
  whereToFind: {
    ribbon: "Home tab → Draw panel → Hatch button.",
    menu: "Draw menu → Hatch.",
    commandLine: "Type HATCH and press Enter.",
    alias: "H (then Enter).",
  },
  vocab: [
    { term: "Pattern", definition: "The repeating motif used to fill the region — e.g. ANSI31 diagonal lines." },
    { term: "Boundary", definition: "The closed loop that defines what to fill." },
    { term: "Scale", definition: "How big the pattern motif is in drawing units." },
    { term: "Angle", definition: "How the pattern is rotated from horizontal." },
    { term: "Associative hatch", definition: "A hatch that updates automatically when its boundary changes." },
  ],
  beforeYouStart: [
    "Draw a fully closed shape — every endpoint must touch.",
    "Turn OSNAP on so any joining lines actually meet.",
    "Set a sensible current layer (e.g. Hatch).",
  ],
  detailedSteps: [
    {
      title: "Start the HATCH command",
      instruction: "Type H and press Enter.",
      explanation: "The Hatch Creation tab appears in the ribbon with patterns, scale and angle controls.",
      screenshot: emptyShot,
    },
    {
      title: "Pick a pattern",
      instruction: "On the ribbon, choose a pattern such as ANSI31 (diagonal lines).",
      explanation: "ANSI31 is the conventional pattern for general 'material cut'.",
      screenshot: emptyShot,
    },
    {
      title: "Set scale and angle",
      instruction: "Set Scale to about 1 and Angle to 0 for the first try.",
      explanation: "If the result looks like a solid block or like nothing changed, the scale is wrong — adjust by an order of magnitude.",
      screenshot: emptyShot,
    },
    {
      title: "Click inside the closed region",
      instruction: "Move the cursor inside the closed boundary. A preview hatch appears. Click to commit.",
      explanation: "AutoCAD detects the boundary around your pick point — it doesn't need you to select edges.",
      screenshot: emptyShot,
    },
    {
      title: "Finish the command",
      instruction: "Press Enter to apply the hatch and end the command.",
      explanation: "The hatch is now a single object you can select, move and adjust later.",
      screenshot: emptyShot,
    },
  ],
  visualReference: emptyShot,
  commonMistakes: [
    { mistake: "HATCH says 'Valid boundary not found'.", fix: "Zoom in and close any gaps in the outline — every endpoint must meet exactly." },
    { mistake: "Pattern looks like a solid block.", fix: "Scale is too small. Increase it by a factor of 10 and retry." },
    { mistake: "Pattern looks blank.", fix: "Scale is too large. Decrease it by a factor of 10." },
  ],
  troubleshooting: [
    { problem: "Boundary not detected.", cause: "An apparent corner has a tiny gap.", fix: "Use OSNAP to redraw the edge, or close the loop with PEDIT (Join)." },
    { problem: "Hatch overflows the region.", cause: "Two boundaries overlap.", fix: "Trim or close each region separately, then re-hatch." },
  ],
  practiceExercise: {
    title: "Hatch a rectangle with ANSI31 at 45°",
    steps: [
      "Draw a 200×100 rectangle with REC.",
      "Type H, Enter.",
      "Pick ANSI31, set Angle 45, Scale 1.",
      "Click inside the rectangle and press Enter.",
    ],
    success: "The rectangle is filled with diagonal lines rotated 45° from horizontal.",
  },
  proTips: [
    "Use SOLID pattern for full-fill regions.",
    "Type HATCHEDIT (or double-click a hatch) to edit pattern, scale or angle later.",
    "Keep hatches on their own Hatch layer so you can freeze them when plotting clean line drawings.",
  ],
  relatedCommands: [
    { name: "HATCHEDIT", what: "Edit an existing hatch's pattern, scale or angle." },
    { name: "BOUNDARY", alias: "BO", what: "Create a closed polyline from a hatchable region." },
    { name: "GRADIENT", what: "Fill a region with a smooth colour gradient instead of a pattern." },
  ],
};

const richBlocks: RichLesson = {
  commandName: "BLOCKS",
  learningObjective:
    "By the end of this lesson you can group geometry into a reusable BLOCK and insert it multiple times in a drawing.",
  whatItIs:
    "A block is a named collection of objects that behaves as a single entity. Insert it once, insert it a hundred times — every copy stays linked so an edit propagates everywhere.",
  whyWhen:
    "Use blocks for anything that repeats: doors, windows, furniture, fasteners, title-block stamps. They make drawings smaller, faster and easier to update.",
  whereToFind: {
    ribbon: "Home tab → Block panel → Create / Insert buttons.",
    menu: "Draw menu → Block → Make / Insert.",
    commandLine: "Type BLOCK or INSERT and press Enter.",
    alias: "B for BLOCK, I for INSERT.",
  },
  vocab: [
    { term: "Block definition", definition: "The recipe stored in the drawing — the geometry plus a name and base point." },
    { term: "Block reference", definition: "An instance of the block inserted into the drawing." },
    { term: "Base point", definition: "The insertion handle of the block — where it lands when you insert." },
    { term: "Attribute", definition: "Editable text fields inside a block (e.g. door number)." },
  ],
  beforeYouStart: [
    "Draw the geometry you want to turn into a block on Layer 0 so it inherits the host layer's colour.",
    "Decide on a logical base point — usually a corner or insertion centre.",
    "Plan a descriptive name (e.g. CHAIR-01) — block names are awkward to change later.",
  ],
  detailedSteps: [
    {
      title: "Select the objects to group",
      instruction: "Window-select the geometry you want to combine into a single block.",
      explanation: "Selecting first means the BLOCK command can grab the set automatically.",
      screenshot: emptyShot,
    },
    {
      title: "Start the BLOCK command",
      instruction: "Type B and press Enter.",
      explanation: "The Block Definition dialog opens.",
      screenshot: emptyShot,
    },
    {
      title: "Name the block",
      instruction: "Type a clear, unique name like CHAIR-01.",
      explanation: "Use prefixes (DOOR-, CHAIR-, WIN-) so blocks group together in the dropdown.",
      screenshot: emptyShot,
    },
    {
      title: "Set the base point",
      instruction: "Click 'Pick point', then snap to a logical corner of the geometry.",
      explanation: "The base point IS the insertion handle. Pick somewhere you'll naturally want to align.",
      screenshot: emptyShot,
    },
    {
      title: "Confirm and convert",
      instruction: "Tick 'Convert to block' and click OK.",
      explanation: "The original geometry is replaced by a single block reference — selecting any part now selects the whole block.",
      screenshot: emptyShot,
    },
    {
      title: "Insert the block elsewhere",
      instruction: "Type I and Enter. Pick CHAIR-01 from the gallery. Click to place. Repeat for more copies.",
      explanation: "Each insertion is a reference, not a duplicate of the geometry — editing the block updates every copy.",
      screenshot: emptyShot,
    },
  ],
  visualReference: emptyShot,
  commonMistakes: [
    { mistake: "Forgetting to pick a base point — the block inserts at 0,0.", fix: "Always click 'Pick point' and snap to a corner before pressing OK." },
    { mistake: "Drawing the source geometry on a coloured layer.", fix: "Draw on Layer 0 so the block adopts the colour of whatever layer it's inserted on." },
    { mistake: "Exploding a block to edit one copy.", fix: "Use BEDIT (or double-click the block) to edit the definition once — every reference updates." },
  ],
  troubleshooting: [
    { problem: "Block inserts off-centre.", cause: "Wrong base point at creation time.", fix: "Redefine the block (BEDIT) and reset the base point with BASE." },
    { problem: "Edited the geometry but other copies didn't change.", cause: "You edited an exploded copy, not the block definition.", fix: "Use BEDIT on the original block to update every reference." },
  ],
  practiceExercise: {
    title: "Chair block around a table",
    steps: [
      "Draw a simple chair outline.",
      "Run BLOCK (B), name it CHAIR-01, pick its centre as base point.",
      "Draw a square table.",
      "INSERT (I) the chair four times — one on each side of the table.",
    ],
    success: "Four identical chairs sit symmetrically around the table, each one a reference to the same definition.",
  },
  proTips: [
    "Double-click a block to open the Block Editor and change it once for all copies.",
    "Use WBLOCK to export a block to its own .dwg file for reuse across drawings.",
    "Add ATTRIBUTES (ATT) for editable text — perfect for door numbers and titleblock fields.",
  ],
  relatedCommands: [
    { name: "INSERT", alias: "I", what: "Place a block reference into the drawing." },
    { name: "BEDIT", alias: "BE", what: "Edit a block definition in the Block Editor." },
    { name: "WBLOCK", alias: "W", what: "Save a block out as a standalone .dwg." },
  ],
};

const richJoin: RichLesson = {
  commandName: "JOIN",
  learningObjective:
    "By the end of this lesson you can merge connected line segments into a single polyline using the JOIN command.",
  whatItIs:
    "JOIN combines two or more collinear or end-touching objects into a single object — usually a polyline. It is the inverse of EXPLODE.",
  whyWhen:
    "Many commands (HATCH, OFFSET, EXTRUDE) need a single closed object, not a collection of line segments. JOIN gives you that single object.",
  whereToFind: {
    ribbon: "Home tab → Modify panel → Join (in the expanded panel).",
    menu: "Modify menu → Join.",
    commandLine: "Type JOIN and press Enter.",
    alias: "J (then Enter).",
  },
  vocab: [
    { term: "Polyline", definition: "A connected sequence of line or arc segments that behave as one object." },
    { term: "Source object", definition: "The first object picked at the prompt — others are joined to it." },
    { term: "Collinear", definition: "Lying on the same straight line." },
  ],
  beforeYouStart: [
    "Draw or have several line segments whose endpoints actually touch.",
    "Turn OSNAP on (F3) so endpoints meet exactly — JOIN needs precise contact.",
    "Press Esc twice to clear any stale selection.",
  ],
  detailedSteps: [
    {
      title: "Start the JOIN command",
      instruction: "Type J and press Enter.",
      explanation: "The command line reads 'Select source object or multiple objects to join at once:'.",
      screenshot: emptyShot,
    },
    {
      title: "Select the first segment",
      instruction: "Click the first segment you want to join.",
      explanation: "This becomes the source — other segments will merge into it.",
      screenshot: emptyShot,
    },
    {
      title: "Select the remaining segments",
      instruction: "Click each connected segment in turn, then press Enter.",
      explanation: "AutoCAD will report '3 objects converted to 1 polyline' (or similar) on success.",
      screenshot: emptyShot,
    },
    {
      title: "Verify the result",
      instruction: "Click any segment of the merged shape — the whole polyline highlights.",
      explanation: "If only one segment highlights, JOIN failed silently — endpoints probably weren't touching.",
      screenshot: emptyShot,
    },
  ],
  visualReference: emptyShot,
  commonMistakes: [
    { mistake: "JOIN reports '0 segments joined'.", fix: "Endpoints don't touch exactly. Turn on OSNAP and re-snap the corners first." },
    { mistake: "Joining lines that don't share a single shape.", fix: "JOIN needs end-to-end contact. Use BLOCK to group disconnected geometry instead." },
    { mistake: "Trying to JOIN a hatch or block.", fix: "JOIN only works on linework — explode complex objects first if appropriate." },
  ],
  troubleshooting: [
    { problem: "Endpoints look connected but JOIN fails.", cause: "There's a sub-pixel gap.", fix: "Snap each endpoint with OSNAP, or use PEDIT → Join with a tiny fuzz distance." },
    { problem: "Result is still many objects.", cause: "Some segments weren't selected.", fix: "Window-select all segments at once and rerun JOIN." },
  ],
  practiceExercise: {
    title: "Four lines → one polyline",
    steps: [
      "Draw four LINE segments forming a closed square (snap each endpoint).",
      "Type J, Enter.",
      "Select all four lines, press Enter.",
      "Click any edge — the whole square should highlight as one object.",
    ],
    success: "Four separate lines become one closed polyline you can HATCH, OFFSET or EXTRUDE.",
  },
  proTips: [
    "JOIN can merge collinear lines into one longer line, even with a gap.",
    "Use PEDIT → Join with a fuzz distance for messy imports where endpoints are nearly touching.",
    "Run OVERKILL to delete duplicate overlapping segments before JOIN.",
  ],
  relatedCommands: [
    { name: "PEDIT", alias: "PE", what: "Edit a polyline — also has a Join option with fuzz tolerance." },
    { name: "EXPLODE", alias: "X", what: "Break a polyline back into individual segments — the inverse of JOIN." },
    { name: "OVERKILL", what: "Delete duplicate or overlapping geometry before joining." },
  ],
};

const richExtrude: RichLesson = {
  commandName: "EXTRUDE",
  learningObjective:
    "By the end of this lesson you can push a closed 2D shape into a 3D solid using the EXTRUDE command.",
  whatItIs:
    "EXTRUDE pushes a closed 2D profile (polyline, circle, region) along a height to create a 3D solid object.",
  whyWhen:
    "EXTRUDE is the entry point into 3D modelling. Walls, prisms, cylinders, custom shapes — all start as a 2D profile that gets extruded.",
  whereToFind: {
    ribbon: "3D Modeling workspace → Home tab → Modeling panel → Extrude.",
    menu: "Draw menu → Modeling → Extrude.",
    commandLine: "Type EXTRUDE and press Enter.",
    alias: "EXT (then Enter).",
  },
  vocab: [
    { term: "Profile", definition: "The closed 2D shape that gets pushed into 3D." },
    { term: "Height / depth", definition: "How far the profile travels along the extrusion direction." },
    { term: "Solid", definition: "A 3D object with volume — supports boolean operations." },
    { term: "Workspace", definition: "Preset arrangement of ribbon panels. Switch to '3D Modeling' for solids tools." },
  ],
  beforeYouStart: [
    "Switch workspace to '3D Modeling' (gear icon on the status bar).",
    "Draw a closed polyline or circle — open shapes will extrude into surfaces, not solids.",
    "Type VS, Enter, C, Enter to switch to Conceptual visual style so you can see solids.",
  ],
  detailedSteps: [
    {
      title: "Switch to 3D Modeling workspace",
      instruction: "Click the gear icon on the status bar and choose '3D Modeling'.",
      explanation: "The ribbon changes to expose Modeling, Mesh and Solid Editing panels.",
      screenshot: emptyShot,
    },
    {
      title: "Draw a closed profile",
      instruction: "Draw a closed polyline (REC works) or a circle.",
      explanation: "EXTRUDE only produces a solid if the profile is closed. Open profiles become surfaces.",
      screenshot: emptyShot,
    },
    {
      title: "Start the EXTRUDE command",
      instruction: "Type EXT and press Enter.",
      explanation: "The command line reads 'Select objects to extrude:'.",
      screenshot: emptyShot,
    },
    {
      title: "Select the profile",
      instruction: "Click the closed shape and press Enter.",
      explanation: "AutoCAD now prompts for an extrusion height and shows a live preview as you move the cursor.",
      screenshot: emptyShot,
    },
    {
      title: "Type the height",
      instruction: "Type 50 and press Enter.",
      explanation: "The profile becomes a 50-unit tall solid. Type a negative number to extrude downward.",
      screenshot: emptyShot,
    },
    {
      title: "Switch visual style to Conceptual",
      instruction: "Type VS, Enter, C, Enter.",
      explanation: "Conceptual shades the solid so you can actually see its volume.",
      screenshot: emptyShot,
    },
  ],
  visualReference: emptyShot,
  commonMistakes: [
    { mistake: "EXTRUDE produces a surface, not a solid.", fix: "Your profile wasn't closed. JOIN the segments into a single closed polyline first." },
    { mistake: "Solid is invisible.", fix: "You're still in 2D Wireframe visual style — switch to Conceptual (VS → C)." },
    { mistake: "Solid extrudes the wrong way.", fix: "Type a negative height, or rotate the view (ViewCube) before extruding." },
  ],
  troubleshooting: [
    { problem: "AutoCAD says 'object is not closed'.", cause: "There's a gap in the polyline.", fix: "Run JOIN with OSNAP first, or use BOUNDARY to make a closed polyline from a hatchable region." },
    { problem: "Solid looks flat from this angle.", cause: "You're looking down the extrusion axis.", fix: "Use the ViewCube to orbit to a 3/4 view." },
  ],
  practiceExercise: {
    title: "Hexagon → 100-unit tall prism",
    steps: [
      "Switch to 3D Modeling workspace.",
      "Type POLYGON, Enter, 6, Enter — draw a hexagon.",
      "Type EXT, Enter. Select the hexagon. Enter.",
      "Type 100 and Enter.",
      "Switch visual style to Conceptual.",
    ],
    success: "A solid hexagonal prism, 100 units tall, shaded so you can see all three visible faces.",
  },
  proTips: [
    "EXTRUDE has a Taper option — type T inside the command for an angled extrusion.",
    "EXTRUDE has a Path option — type P to extrude along an existing line or polyline.",
    "Use PRESSPULL as a quick alternative for face-based push/pull modelling.",
  ],
  relatedCommands: [
    { name: "PRESSPULL", what: "Push or pull a face by clicking and dragging it." },
    { name: "REVOLVE", alias: "REV", what: "Sweep a profile around an axis to make a solid of revolution." },
    { name: "UNION", alias: "UNI", what: "Combine two solids into one." },
  ],
};

const richPolyline: RichLesson = {
  commandName: "POLYLINE",
  learningObjective:
    "By the end of this lesson you can draw connected line and arc segments as a single polyline using the PLINE command and its options.",
  whatItIs:
    "PLINE creates a polyline — a single object made of connected straight and/or curved segments. Unlike LINE, every segment is part of the same object.",
  whyWhen:
    "Use PLINE whenever you need a closed shape, a single editable boundary, or a path with mixed line+arc segments — boundaries, hatches, sections, outlines.",
  whereToFind: {
    ribbon: "Home tab → Draw panel → Polyline button.",
    menu: "Draw menu → Polyline.",
    commandLine: "Type PLINE and press Enter.",
    alias: "PL (then Enter).",
  },
  vocab: [
    { term: "Polyline", definition: "A connected sequence of line and arc segments treated as one object." },
    { term: "Vertex", definition: "A point where two segments of a polyline meet." },
    { term: "Arc segment", definition: "A curved part of a polyline, created with the A option mid-command." },
    { term: "Width", definition: "A polyline can have a non-zero thickness — set with the W option." },
  ],
  beforeYouStart: [
    "Press F8 to enable ORTHO for clean horizontal/vertical segments.",
    "Turn OSNAP on so vertices land on real geometry.",
    "Have a sketch or plan of the shape you want to draw.",
  ],
  detailedSteps: [
    {
      title: "Start the PLINE command",
      instruction: "Type PL and press Enter.",
      explanation: "The command line reads 'Specify start point:'.",
      screenshot: emptyShot,
    },
    {
      title: "Click the start point",
      instruction: "Click anywhere in the drawing area.",
      explanation: "AutoCAD now prompts for the next point with extra option keywords in brackets.",
      screenshot: emptyShot,
    },
    {
      title: "Draw straight segments",
      instruction: "Click further points, or type relative coordinates like @100,0 Enter to add precise segments.",
      explanation: "Every click adds a vertex. The whole chain stays a single polyline.",
      screenshot: emptyShot,
    },
    {
      title: "Add a curved segment with the Arc option",
      instruction: "Type A and press Enter. Click an endpoint for the arc, or type a coordinate.",
      explanation: "The cursor previews an arc tangent to the previous segment. Type L Enter to switch back to straight segments.",
      screenshot: emptyShot,
    },
    {
      title: "Close the polyline",
      instruction: "Type C and press Enter.",
      explanation: "C closes the chain back to the very first vertex and ends the command — leaving you a single closed polyline.",
      screenshot: emptyShot,
    },
  ],
  visualReference: emptyShot,
  commonMistakes: [
    { mistake: "Using LINE when you needed a single closed shape.", fix: "Restart with PLINE so the result is one polyline you can HATCH or EXTRUDE." },
    { mistake: "Forgetting to type C to close.", fix: "Type C, Enter on the last prompt — don't manually click back to the start point." },
    { mistake: "Mixing Arc and Line options and getting confused.", fix: "Read the command line — it always tells you which mode you're in." },
  ],
  troubleshooting: [
    { problem: "Pressing Enter early ended the polyline.", cause: "Enter ends PLINE at any point.", fix: "Press Ctrl + Z to undo and resume — or restart with PLINE." },
    { problem: "My polyline has visible width I didn't want.", cause: "The W option was set earlier in the command.", fix: "Restart PLINE, or use PEDIT → Width 0 to clear it." },
  ],
  practiceExercise: {
    title: "Draw an L-shape with POLYLINE and close it",
    steps: [
      "Type PL, Enter. Click a start point.",
      "Type @100,0 Enter, @0,50 Enter, @50,0 Enter, @0,50 Enter, @-150,0 Enter.",
      "Type C, Enter to close.",
    ],
    success: "A closed L-shaped polyline you can select with a single click.",
  },
  proTips: [
    "Inside PLINE type W to set a non-zero width — useful for arrows and emphasis lines.",
    "Inside PLINE type U to undo just the last segment without leaving the command.",
    "Use PEDIT to convert old LINE chains into a polyline after the fact.",
  ],
  relatedCommands: [
    { name: "PEDIT", alias: "PE", what: "Edit, join, smooth or change width of an existing polyline." },
    { name: "EXPLODE", alias: "X", what: "Break a polyline back into individual segments." },
    { name: "SPLINE", alias: "SPL", what: "Draw a smooth curve through control points." },
  ],
};

const richOffsetMirror: RichLesson = {
  commandName: "OFFSET + MIRROR",
  learningObjective:
    "By the end of this lesson you can create parallel copies at a fixed distance with OFFSET, and reflected copies across a line with MIRROR.",
  whatItIs:
    "OFFSET creates a new object parallel to an existing one at a chosen distance. MIRROR creates a reflected duplicate across a chosen axis line.",
  whyWhen:
    "Use OFFSET for wall thicknesses, contour lines, padding and inset shapes. Use MIRROR for symmetry — anything with a left/right or top/bottom mirror image.",
  whereToFind: {
    ribbon: "Home tab → Modify panel → Offset / Mirror buttons.",
    menu: "Modify menu → Offset / Mirror.",
    commandLine: "Type OFFSET or MIRROR and press Enter.",
    alias: "O for OFFSET, MI for MIRROR.",
  },
  vocab: [
    { term: "Offset distance", definition: "How far the new parallel object is from the source." },
    { term: "Side to offset", definition: "Which side of the source the new object lands on — picked by a click." },
    { term: "Mirror line", definition: "The two-point axis MIRROR reflects across." },
  ],
  beforeYouStart: [
    "Have at least one drawn object (line, polyline, circle).",
    "Turn OSNAP on so the mirror axis snaps to real geometry.",
    "Decide the offset distance before starting OFFSET.",
  ],
  detailedSteps: [
    {
      title: "Start the OFFSET command",
      instruction: "Type O and press Enter.",
      explanation: "The command line reads 'Specify offset distance or [Through]:'.",
      screenshot: emptyShot,
    },
    {
      title: "Type the offset distance",
      instruction: "Type 10 and press Enter.",
      explanation: "Every offset in this run will be 10 units. Type a different number on the next OFFSET command if needed.",
      screenshot: emptyShot,
    },
    {
      title: "Pick the object to offset",
      instruction: "Click the line, polyline or circle you want to copy.",
      explanation: "AutoCAD now prompts for which side the new offset should appear on.",
      screenshot: emptyShot,
    },
    {
      title: "Click the side",
      instruction: "Move the cursor to the side you want the new object on and click.",
      explanation: "A new parallel object appears at the chosen distance on the chosen side. The command stays active for more offsets — press Enter to end it.",
      screenshot: emptyShot,
    },
    {
      title: "Start MIRROR",
      instruction: "Type MI and press Enter. Select the objects to mirror, press Enter.",
      explanation: "AutoCAD now prompts for the first point of the mirror line.",
      screenshot: emptyShot,
    },
    {
      title: "Define the mirror line",
      instruction: "Click two points to define the reflection axis. Type N (No) when asked whether to delete the source.",
      explanation: "A reflected duplicate appears across the axis. Type Y instead if you wanted to move-and-flip rather than copy-and-flip.",
      screenshot: emptyShot,
    },
  ],
  visualReference: emptyShot,
  commonMistakes: [
    { mistake: "Selecting an object before typing the distance in OFFSET.", fix: "OFFSET asks for distance first — type the number, Enter, then pick." },
    { mistake: "MIRROR axis picked at random.", fix: "Snap to real geometry (midpoint, endpoint) so the symmetry is exact." },
    { mistake: "Accidentally deleting the source in MIRROR.", fix: "Press Y/N carefully at the final 'Erase source' prompt." },
  ],
  troubleshooting: [
    { problem: "OFFSET says 'cannot offset that object'.", cause: "The source isn't supported (e.g. a block or hatch).", fix: "Explode it first, or use COPY with a typed displacement instead." },
    { problem: "Mirrored text reads backwards.", cause: "MIRRTEXT is set to 1.", fix: "Type MIRRTEXT, Enter, set to 0 — text will stay readable after mirroring." },
  ],
  practiceExercise: {
    title: "Mirror half a butterfly",
    steps: [
      "Draw the left half of a butterfly outline with PLINE.",
      "Type MI, Enter. Select the polyline, Enter.",
      "Snap two points along the vertical axis of symmetry.",
      "Press N when asked to delete the source.",
    ],
    success: "A symmetrical butterfly with both wings — the right side a perfect reflection of the left.",
  },
  proTips: [
    "OFFSET has a Through option — type T to offset by clicking a point instead of typing a distance.",
    "Set MIRRTEXT to 0 once per drawing so any mirrored text stays readable.",
    "Use OFFSET on a closed polyline to create concentric inner/outer boundaries in one click.",
  ],
  relatedCommands: [
    { name: "ARRAY", alias: "AR", what: "Create rectangular or polar patterns of copies." },
    { name: "COPY", alias: "CO", what: "Duplicate objects without parallel offset or reflection." },
    { name: "ROTATE", alias: "RO", what: "Rotate objects around a base point." },
  ],
};

const richFilletChamfer: RichLesson = {
  commandName: "FILLET + CHAMFER",
  learningObjective:
    "By the end of this lesson you can round corners between two lines with FILLET and bevel them with CHAMFER, each at a chosen size.",
  whatItIs:
    "FILLET replaces a sharp corner between two objects with a smooth arc of a chosen radius. CHAMFER replaces it with a straight bevel cut at chosen distances.",
  whyWhen:
    "Manufacturing parts almost never have perfectly sharp corners — they're rounded (filleted) or bevelled (chamfered) for safety, strength and casting. Use FILLET and CHAMFER to model real corners.",
  whereToFind: {
    ribbon: "Home tab → Modify panel → Fillet / Chamfer dropdown.",
    menu: "Modify menu → Fillet / Chamfer.",
    commandLine: "Type FILLET or CHAMFER and press Enter.",
    alias: "F for FILLET, CHA for CHAMFER.",
  },
  vocab: [
    { term: "Radius", definition: "The size of the rounded corner created by FILLET." },
    { term: "Distance", definition: "How far back from the corner each line is cut by CHAMFER." },
    { term: "Trim mode", definition: "Whether AutoCAD shortens the source lines back to the new corner. On by default." },
  ],
  beforeYouStart: [
    "Draw two intersecting (or near-intersecting) lines.",
    "Decide on a radius (FILLET) or distance (CHAMFER) before starting the command.",
    "Turn OSNAP off if you've been getting accidental snap picks on nearby geometry.",
  ],
  detailedSteps: [
    {
      title: "Start the FILLET command",
      instruction: "Type F and press Enter.",
      explanation: "The command line shows the current radius — likely 0.",
      screenshot: emptyShot,
    },
    {
      title: "Set the radius",
      instruction: "Type R, Enter. Type 10, Enter.",
      explanation: "Every fillet in this run will use a 10-unit arc until you change it again.",
      screenshot: emptyShot,
    },
    {
      title: "Pick the two lines",
      instruction: "Click the first line, then click the second line.",
      explanation: "The corner is replaced by a 10-unit arc tangent to both lines.",
      screenshot: emptyShot,
    },
    {
      title: "Start the CHAMFER command",
      instruction: "Type CHA and press Enter.",
      explanation: "CHAMFER stores two distances — one for each side of the bevel.",
      screenshot: emptyShot,
    },
    {
      title: "Set the distances",
      instruction: "Type D, Enter. Type 10, Enter. Type 10, Enter.",
      explanation: "Equal distances give a 45° bevel. Unequal distances give an asymmetric bevel.",
      screenshot: emptyShot,
    },
    {
      title: "Pick the two lines to chamfer",
      instruction: "Click the first line, then the second line.",
      explanation: "The corner becomes a straight bevel cut at the chosen distances.",
      screenshot: emptyShot,
    },
  ],
  visualReference: emptyShot,
  commonMistakes: [
    { mistake: "Radius left at 0 — the corner just becomes sharp.", fix: "Type R, Enter, then a real radius before picking the lines." },
    { mistake: "Clicking the wrong end of a line.", fix: "Click closer to the end you want to keep — the other end gets trimmed." },
    { mistake: "Trim mode off without realising.", fix: "Type T, Enter, T, Enter to turn trimming back on so the source lines are shortened to the new corner." },
  ],
  troubleshooting: [
    { problem: "Nothing happens after I pick two lines.", cause: "Radius is 0 and they don't quite meet.", fix: "Set a non-zero radius, or extend the lines so they cross first." },
    { problem: "Lines weren't trimmed.", cause: "Trim mode was set to No trim.", fix: "Inside the command type T, Enter, T, Enter (Trim on)." },
  ],
  practiceExercise: {
    title: "Fillet all corners of a rectangle with R15",
    steps: [
      "Draw a rectangle with REC.",
      "Type F, Enter.",
      "Type R, Enter. Type 15, Enter.",
      "Type P, Enter (Polyline option) and click the rectangle.",
    ],
    success: "Every corner of the rectangle is rounded with a 15-unit arc in one click.",
  },
  proTips: [
    "Inside FILLET, use the Polyline option (P) to fillet every corner of a closed polyline at once.",
    "Hold Shift while picking the second line to apply a radius of 0 — quick way to clean up a corner without changing the stored radius.",
    "FILLET works on parallel lines too — it joins them with a half-circle.",
  ],
  relatedCommands: [
    { name: "BLEND", what: "Connect two open curves with a smooth spline." },
    { name: "TRIM", alias: "TR", what: "Cut back overshooting lines manually." },
    { name: "EXTEND", alias: "EX", what: "Lengthen lines to meet another." },
  ],
};

const richArrayReview: RichLesson = {
  commandName: "ARRAY",
  learningObjective:
    "By the end of this lesson you can use ARRAY to create rectangular and polar patterns of objects, and review your dimension style.",
  whatItIs:
    "ARRAY creates a controlled pattern of copies — either in rows and columns (rectangular), around a centre (polar), or along a path. The pattern is associative: edit one source, the whole pattern updates.",
  whyWhen:
    "Use ARRAY for anything that repeats with a regular spacing — bolt circles, fence posts, parking spaces, ceiling tiles, columns.",
  whereToFind: {
    ribbon: "Home tab → Modify panel → Array dropdown (Rectangular / Polar / Path).",
    menu: "Modify menu → Array.",
    commandLine: "Type ARRAY and press Enter.",
    alias: "AR (then Enter).",
  },
  vocab: [
    { term: "Rectangular array", definition: "Copies arranged in rows and columns." },
    { term: "Polar array", definition: "Copies arranged around a centre point." },
    { term: "Path array", definition: "Copies arranged evenly along a chosen curve." },
    { term: "Associative", definition: "The pattern stays editable as a single object after creation." },
  ],
  beforeYouStart: [
    "Have a source object drawn (circle, block, polyline).",
    "Decide the pattern: rectangular, polar or path.",
    "Pick a meaningful base/centre point — symmetry makes ARRAY much cleaner.",
  ],
  detailedSteps: [
    {
      title: "Start the ARRAY Command",
      instruction: "Type AR and press Enter.",
      explanation: "AutoCAD asks 'Select objects:'.",
      screenshot: emptyShot,
    },
    {
      title: "Select the Source Object",
      instruction: "Click the object(s) to array and press Enter.",
      explanation: "The command line then asks which type of array — Rectangular, Polar or Path.",
      screenshot: emptyShot,
    },
    {
      title: "Choose an Array Type",
      instruction: "Type PO, Enter.",
      explanation: "Polar arranges copies in a ring around a centre point.",
      screenshot: emptyShot,
    },
    {
      title: "Review Rectangular, Path, and Polar",
      instruction: "Snap to the point you want the copies to rotate around.",
      explanation: "AutoCAD previews the pattern with a default count and fill angle.",
      screenshot: emptyShot,
    },
    {
      title: "Adjust Count and Spacing",
      instruction: "On the ribbon, set Items to 8 and Fill to 360.",
      explanation: "Eight evenly-spaced copies spread around a full circle.",
      screenshot: emptyShot,
    },
    {
      title: "Finish the Array",
      instruction: "Press Enter to commit the array.",
      explanation: "The pattern is now a single associative array object — double-click it to re-edit later.",
      screenshot: emptyShot,
    },
    {
      title: "Add and Review Dimensions",
      instruction: "Type D, Enter. Inspect text height, arrow size and units. Adjust to suit your plot scale.",
      explanation: "A consistent dimension style across the drawing is what separates beginner from professional output.",
      screenshot: emptyShot,
    },
  ],
  visualReference: emptyShot,
  commonMistakes: [
    { mistake: "Negative spacing in a rectangular array — copies overlap.", fix: "Use positive spacing in both directions, or set count to 1 in one direction." },
    { mistake: "Polar centre snapped to the wrong point.", fix: "Turn OSNAP on and snap to a true centre or intersection." },
    { mistake: "Editing one copy without realising it changes all of them.", fix: "ARRAY is associative — use ARRAYEDIT, or EXPLODE the array first if you really want independent copies." },
  ],
  troubleshooting: [
    { problem: "Pattern looks rotated wrong.", cause: "'Rotate items' is on/off in the wrong state.", fix: "Use the ribbon toggle 'Rotate Items' during the polar array to flip behaviour." },
    { problem: "Array doesn't appear.", cause: "Spacing is too small to see at the current zoom.", fix: "Run ZOOM EXTENTS (Z → E) and verify the count and spacing on the ribbon." },
  ],
  practiceExercise: {
    title: "Polar array a circle 8 times",
    steps: [
      "Draw a circle of radius 10 offset from the origin.",
      "Type AR, Enter. Select the circle. Enter.",
      "Type PO, Enter.",
      "Snap to the drawing origin as the centre.",
      "Set Items 8, Fill 360, press Enter.",
    ],
    success: "Eight evenly-spaced circles ring around the origin — a clean polar pattern.",
  },
  proTips: [
    "Double-click any associative array to open ARRAYEDIT and tweak count or spacing.",
    "Use ARRAYPATH to distribute objects along a curved path.",
    "EXPLODE an array if you want to edit copies individually — but you lose associativity.",
  ],
  relatedCommands: [
    { name: "ARRAYEDIT", what: "Edit an associative array's count, spacing or source." },
    { name: "ARRAYPATH", what: "Distribute copies along a curve." },
    { name: "DIMSTYLE", alias: "D", what: "Open Dimension Style Manager." },
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
    rich: richMoveCopy,
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
    rich: richOsnap,
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
    rich: richLayers,
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
    rich: richDimText,
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
    rich: richHatch,
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
    rich: richBlocks,
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
    rich: richJoin,
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
    rich: richExtrude,
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
    rich: richPolyline,
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
    rich: richOffsetMirror,
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
    rich: richFilletChamfer,
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
    rich: richArrayReview,
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