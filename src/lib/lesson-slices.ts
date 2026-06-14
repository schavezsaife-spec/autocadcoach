import r1c1 from "@/assets/slices/asset_r1_c1.png.asset.json";
import r1c2 from "@/assets/slices/asset_r1_c2.png.asset.json";
import r1c3 from "@/assets/slices/asset_r1_c3.png.asset.json";
import r1c4 from "@/assets/slices/asset_r1_c4.png.asset.json";
import r1c5 from "@/assets/slices/asset_r1_c5.png.asset.json";
import r1c6 from "@/assets/slices/asset_r1_c6.png.asset.json";
import r1c7 from "@/assets/slices/asset_r1_c7.png.asset.json";
import r2c1 from "@/assets/slices/asset_r2_c1.png.asset.json";
import r2c2 from "@/assets/slices/asset_r2_c2.png.asset.json";
import r2c3 from "@/assets/slices/asset_r2_c3.png.asset.json";
import r2c4 from "@/assets/slices/asset_r2_c4.png.asset.json";
import r2c5 from "@/assets/slices/asset_r2_c5.png.asset.json";
import r2c6 from "@/assets/slices/asset_r2_c6.png.asset.json";
import r2c7 from "@/assets/slices/asset_r2_c7.png.asset.json";
import r3c1 from "@/assets/slices/asset_r3_c1.png.asset.json";
import r3c2 from "@/assets/slices/asset_r3_c2.png.asset.json";
import r3c3 from "@/assets/slices/asset_r3_c3.png.asset.json";
import r3c4 from "@/assets/slices/asset_r3_c4.png.asset.json";
import r3c5 from "@/assets/slices/asset_r3_c5.png.asset.json";
import r3c6 from "@/assets/slices/asset_r3_c6.png.asset.json";
import r3c7 from "@/assets/slices/asset_r3_c7.png.asset.json";
import r4c1 from "@/assets/slices/asset_r4_c1.png.asset.json";
import r4c2 from "@/assets/slices/asset_r4_c2.png.asset.json";
import r4c3 from "@/assets/slices/asset_r4_c3.png.asset.json";
import r4c4 from "@/assets/slices/asset_r4_c4.png.asset.json";
import r4c5 from "@/assets/slices/asset_r4_c5.png.asset.json";
import r4c6 from "@/assets/slices/asset_r4_c6.png.asset.json";
import r4c7 from "@/assets/slices/asset_r4_c7.png.asset.json";
import r5c1 from "@/assets/slices/asset_r5_c1.png.asset.json";
import r5c2 from "@/assets/slices/asset_r5_c2.png.asset.json";
import r5c3 from "@/assets/slices/asset_r5_c3.png.asset.json";
import r5c4 from "@/assets/slices/asset_r5_c4.png.asset.json";
import r5c5 from "@/assets/slices/asset_r5_c5.png.asset.json";
import r5c6 from "@/assets/slices/asset_r5_c6.png.asset.json";
import r5c7 from "@/assets/slices/asset_r5_c7.png.asset.json";

/**
 * Asset library uploaded as the AutoCAD Coach lesson visuals. Each slice is
 * a labelled annotated screenshot of a specific concept; we reuse the same
 * image across lessons that reference the same concept rather than uploading
 * duplicates.
 */
export const SLICE = {
  // Row 1 — Interface & Navigation
  interface_start_screen: r1c1.url,
  interface_regions: r1c2.url,
  interface_ribbon_home: r1c3.url,
  interface_command_line: r1c4.url,
  interface_viewcube: r1c5.url,
  interface_status_bar: r1c6.url,
  interface_workspace_overview: r1c7.url,

  // Row 2 — Drawing: LINE / CIRCLE / RECTANGLE
  line_action: r2c1.url,
  line_after: r2c2.url,
  circle_before: r2c3.url,
  circle_action: r2c4.url,
  circle_after: r2c5.url,
  rectangle_action: r2c6.url,
  rectangle_after: r2c7.url,

  // Row 3 — Editing: TRIM / EXTEND / OFFSET / FILLET
  trim_before: r3c1.url,
  extend_before: r3c2.url,
  extend_after: r3c3.url,
  offset_before: r3c4.url,
  offset_after: r3c5.url,
  fillet_before: r3c6.url,
  fillet_after: r3c7.url,

  // Row 4 — Mirror, common mistakes, EXTRUDE start
  mirror_before: r4c1.url,
  mirror_after: r4c2.url,
  offset_wrong_single: r4c3.url,
  circle_wrong_center: r4c4.url,
  extrude_action: r4c5.url,
  extrude_result: r4c6.url,
  ucs_icon: r4c7.url,

  // Row 5 — Navigation & view
  zoom_window: r5c1.url,
  zoom_extents: r5c2.url,
  pan: r5c3.url,
  view_3d_solid: r5c4.url,
  view_ucs: r5c5.url,
  view_drag_zoom: r5c6.url,
  view_zoom_extents_alt: r5c7.url,
} as const;

export type SliceKey = keyof typeof SLICE;