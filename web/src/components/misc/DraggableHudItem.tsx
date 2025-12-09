import React, { ReactNode } from "react";
import { useDrag } from "../../store/useDrag";

interface DraggableHudItemProps {
  id: string;
  children: ReactNode;
  defaultX?: number;
  defaultY?: number;
  editMode?: boolean;
  defaultScale?: number;
}

export const DraggableHudItem: React.FC<DraggableHudItemProps> = ({
  id,
  children,
  defaultX = 0,
  defaultY = 0,
  editMode = false,
  defaultScale = 1,
}) => {
  const { scale, posRem, onMouseDown, onScale } = useDrag(id, { x: defaultX, y: defaultY }, defaultScale);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!editMode) return;
    onMouseDown(e);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`absolute select-none ${editMode ? "cursor-move border-dashed border-[0.012rem] border-[#ffffff3a] rounded-md" : "cursor-default"
        }`}
      style={{
        left: `${posRem.x === 0 ? '' : `${posRem.x}rem`}`,
        top: `${posRem.y === 0 ? '60rem' : `${posRem.y}rem`}`,
        transform: `scale(${scale})`,
        transition: editMode ? "none" : "0.2s ease",
        pointerEvents: editMode ? "auto" : "none",
      }}
    >
      {children}
      {editMode && (
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: "1rem",
            height: "1rem",
            cursor: "nwse-resize",
            background: "rgba(255,255,255,0.2)",
          }}
          // resize góc: ta sẽ dùng onScale
          onMouseDown={(e) => {
            e.stopPropagation();
            const startScale = scale;
            const startX = e.clientX;
            const startY = e.clientY;

            const onMouseMove = (moveEvent: MouseEvent) => {
              const delta = (moveEvent.clientX - startX + moveEvent.clientY - startY) / 200; // scale factor
              onScale(Math.max(0.1, startScale + delta));
            };

            const onMouseUp = () => {
              window.removeEventListener("mousemove", onMouseMove);
              window.removeEventListener("mouseup", onMouseUp);
            };

            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
          }}
        />
      )}
    </div>
  );
};
