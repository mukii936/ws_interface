import { useState, useRef, useEffect } from "react";

const PX_PER_REM = 16;

export const useDrag = (key: string, initialRem = { x: 0, y: 0 }, initialScale: number = 1) => {
  const saved = localStorage.getItem("hud_pos_" + key);
  const savedScale = localStorage.getItem("hud_scale_" + key);

  const defaultPosRem = saved ? JSON.parse(saved) : initialRem;
  const defaultScale = savedScale ? parseFloat(savedScale) : initialScale;


  const [posRem, setPosRem] = useState(defaultPosRem);
  const [scale, setScale] = useState<number>(defaultScale);

  const dragging = useRef(false);
  const offsetPx = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;

    offsetPx.current = {
      x: e.clientX - posRem.x * PX_PER_REM,
      y: e.clientY - posRem.y * PX_PER_REM,
    };
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;

    const newPosPx = {
      x: e.clientX - offsetPx.current.x,
      y: e.clientY - offsetPx.current.y,
    };

    const newPosRem = {
      x: newPosPx.x / PX_PER_REM,
      y: newPosPx.y / PX_PER_REM,
    };

    setPosRem(newPosRem);

    localStorage.setItem("hud_pos_" + key, JSON.stringify(newPosRem));
  };

  const onMouseUp = () => {
    dragging.current = false;
  };

  const onScale = (newScale: number) => {
    const clamped = Math.max(0.1, newScale);
    setScale(clamped);
    localStorage.setItem("hud_scale_" + key, clamped.toString());
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return {scale, posRem, onMouseDown, onScale};
};
