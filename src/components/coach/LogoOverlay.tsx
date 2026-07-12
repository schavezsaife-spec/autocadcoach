import { useEffect, useRef, useState } from "react";
import logoMark from "@/assets/logo-mark.png";

/**
 * Renders a small teal/aqua brand patch aligned to the top-right of the
 * actual image content area (respecting object-contain letterboxing).
 * Used to cover the legacy red AutoCAD Coach logo baked into older
 * lesson/project screenshots without regenerating the assets.
 */
export function LogoOverlay({
  imgRef,
  containerRef,
}: {
  imgRef: React.RefObject<HTMLImageElement | null>;
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const [box, setBox] = useState<{ top: number; right: number; w: number; h: number } | null>(null);

  useEffect(() => {
    const compute = () => {
      const img = imgRef.current;
      const c = containerRef.current;
      if (!img || !c) return;
      const cw = c.clientWidth;
      const ch = c.clientHeight;
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      if (!cw || !ch || !nw || !nh) return;
      const scale = Math.min(cw / nw, ch / nh);
      const dw = nw * scale;
      const dh = nh * scale;
      const offsetX = (cw - dw) / 2;
      const offsetY = (ch - dh) / 2;
      // Patch sized ~19% of displayed image width, ~11% height — matches
      // the footprint of the old red logo baked into legacy screenshots.
      const w = Math.max(56, dw * 0.19);
      const h = Math.max(28, dh * 0.11);
      setBox({
        top: offsetY,
        right: offsetX,
        w,
        h,
      });
    };
    compute();
    const img = imgRef.current;
    if (img) {
      if (img.complete) compute();
      img.addEventListener("load", compute);
    }
    const ro = new ResizeObserver(compute);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", compute);
    return () => {
      if (img) img.removeEventListener("load", compute);
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [imgRef, containerRef]);

  if (!box) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute flex items-center justify-center rounded-md bg-[#0d1418] ring-1 ring-primary/30"
      style={{
        top: box.top,
        right: box.right,
        width: box.w,
        height: box.h,
      }}
    >
      <img
        src={logoMark}
        alt=""
        draggable={false}
        className="object-contain"
        style={{ width: "78%", height: "78%" }}
      />
    </div>
  );
}