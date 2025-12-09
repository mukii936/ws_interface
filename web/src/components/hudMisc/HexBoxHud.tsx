import React, { useState } from "react";
import { IconMap, IconName } from "./iconSvg/IconMap";
import type { HudColors } from "../../store/useHudStore";
import useHudStore from "../../store/useHudStore";


interface WaveFillProps {
    percent: number;
    icon: IconName;
    color: string
    hudKey: keyof HudColors;
}

export const HexBoxHud: React.FC<WaveFillProps> = ({ percent, icon, color, hudKey }) => {
    const IconComponent = IconMap[icon];
    const { setHudColor, editMode } = useHudStore();
    const [showPicker, setShowPicker] = useState(false);

    const handleRightClick = (e: React.MouseEvent) => {
        if (!editMode.editMode) return;
        e.preventDefault();
        setShowPicker(true);
    };

    const handleChangeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setHudColor(hudKey, newColor);
    };

    const darken = (hex: string, n1: number) => {
        const amt = 1 - n1 / 100;

        let r = Math.round(parseInt(hex.substring(1, 3), 16) * amt);
        let g = Math.round(parseInt(hex.substring(3, 5), 16) * amt);
        let b = Math.round(parseInt(hex.substring(5, 7), 16) * amt);

        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));

        const toHex = (v: number) => v.toString(16).padStart(2, "0");

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    return (
        <>
            <div className="w-16 h-[6.125rem] flex items-center justify-center relative" style={{
                background: `linear-gradient( 180deg, ${color}00 37.24%, ${darken(color, 50)}99 100% )`,}}>
                <div
                    onContextMenu={handleRightClick}
                    className="w-[3.07288rem] h-[3.54819rem] absolute overflow-hidden flex items-center justify-center top-0"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        height="57"
                        viewBox="0 0 50 57"
                        fill="none"
                        className="w-[3.07288rem] h-[3.54819rem] absolute"
                    >
                        <path
                            d="M24.583 4.38574L45.3676 16.3857V40.3857L24.583 52.3857L3.7984 40.3857V16.3857L24.583 4.38574Z"
                            fill={`url(#paint0_linear_364_152_${hudKey})`}
                            fillOpacity="0.55"
                        />
                        <path
                            d="M24.583 1.38574L1.2002 14.8857V41.8857L24.583 55.3857L47.9658 41.8857V14.8857L24.583 1.38574ZM49.166 42.5781L24.583 56.7715L0 42.5781V14.1934L24.583 0L49.166 14.1934V42.5781Z"
                            fill={`url(#paint1_linear_364_152_${hudKey})`}
                        />

                        <defs>
                            <linearGradient
                                id={`paint0_linear_364_152_${hudKey}`}
                                x1="24.583"
                                y1="4.38574"
                                x2="24.583"
                                y2="52.3857"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor={color} />
                                <stop offset="1" stopColor={darken(color, 50)} />
                            </linearGradient>

                            <linearGradient
                                id={`paint1_linear_364_152_${hudKey}`}
                                x1="24.583"
                                y1="1.38574"
                                x2="24.583"
                                y2="21.8857"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor={color} />
                                <stop offset="1" stopColor={darken(color, 50)} stopOpacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="w-12 h-[3rem] absolute bottom-0 left-0">
                        <div className="w-full absolute overflow-hidden bottom-[0.34rem] left-0 transition-all ease-in-out delay-200" style={{ height: `${percent}%` }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="49" height="48" viewBox="0 0 49 48" fill="none" className="w-12 h-[3rem] absolute bottom-0">
                                <g clip-path="url(#clip0_164_619)">
                                    <path d="M24.583 0.385742L45.3676 12.3857V36.3857L24.583 48.3857L3.7984 36.3857V12.3857L24.583 0.385742Z" fill={`url(#paint0_linear_big_${hudKey})`} />
                                </g>
                                <defs>
                                    <linearGradient id={`paint0_linear_big_${hudKey}`} x1="24.583" y1="0.385742" x2="24.583" y2="48.3857" gradientUnits="userSpaceOnUse">
                                        <stop stopColor={color} />
                                        <stop offset="1" stopColor={darken(color, 50)} />
                                    </linearGradient>
                                    <clipPath id="clip0_164_619">
                                        <rect width="49" height="48" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </div>
                    <IconComponent size="small" />
                </div>
                <div className="text-white text-center font-[Saira] text-[1.02969rem] font-semibold w-full absolute bottom-4">{Math.round(percent)}%</div>
                <div className="w-[1.9375rem] h-[0.1875rem] rounded-[0.09375rem] absolute bottom-2.5" style={{background: color, filter: `drop-shadow(0 0 0.6312rem ${color})`}}></div>
            </div>
            {showPicker && editMode.editMode && (
                <input
                    type="color"
                    value={color}
                    onChange={handleChangeColor}
                    onBlur={() => setShowPicker(false)}
                    autoFocus
                    className="absolute left-full ml-2 w-8 h-8 p-0 border-none cursor-pointer"
                />
            )}
        </>
    );
};

export default HexBoxHud;