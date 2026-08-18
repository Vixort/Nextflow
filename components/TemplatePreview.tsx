"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Render } from "@puckeditor/core";
import { puckConfig } from "@/lib/puck/puckConfig";

const REFERENCE_WIDTH = 1440;

export default function TemplatePreview({ data }: { data: unknown }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const page = pageRef.current;
    if (!box || !page) return;

    const update = () => {
      const boxW = box.clientWidth;
      if (!boxW) return;
      const fitWidth = boxW / REFERENCE_WIDTH;
      setScale(fitWidth);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(box);
    ro.observe(page);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={boxRef} className="relative h-64 w-full overflow-hidden">
      <div
        style={{
          width: REFERENCE_WIDTH,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          opacity: scale === 0 ? 0 : 1,
        }}
      >
        <div ref={pageRef}>
          <Render data={data as never} config={puckConfig} />
        </div>
      </div>
    </div>
  );
}