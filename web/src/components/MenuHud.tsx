import React, { useState, useEffect } from 'react';
import Checkbox from './Checkbox';
import { fetchNui } from '../utils/fetchNui';
import useUpdateData from '../hooks/useUpdateData';
import './HudMenu.scss';
import type { MenuData } from '../interface/Hud';

const HudMenu: React.FC = React.memo(() => {

    // W A T E R M A R K
    const P = "P"
    const o = "O"
    const w = "W"
    const e = "E"
    const r = "R"
    const d = "D"

    const B = "B"
    const y = "Y"

    const W = "W"
    const A = "A"
    const T = "T"
    const E = "E"
    const R2 = "R"
    const M = "M"
    const L = "L"
    const O2 = "O"
    const N = "N"

    const S = "S"
    const T2 = "T"
    const U = "U"
    const D2 = "D"
    const I = "I"
    const O3 = "O"

    // DONT TOUCH
    const result =
        P + o + w + e + r + e + d + " " +
        B + y + " " +
        W + A + T + E + R2 + M + E + L + O2 + N + " " +
        S + T2 + U + D2 + I + O3

    const [MenuData, setMenuData] = useState<MenuData>({
        show: false,
    });

    useUpdateData({
        MenuData: setMenuData,
    });

    const [checkboxStates, setCheckboxStates] = useState<{
        minimapInCar: boolean;
        hideMinimapInCar: boolean;
        cinematicMod: boolean;
    }>(() => {
        const savecheckbox = localStorage.getItem('checkBoxState');
        return savecheckbox ? JSON.parse(savecheckbox) : {
            minimapInCar: false,
            hideMinimapInCar: false,
            cinematicMod: false,
        }
    });


    const handleCheckboxChange = async (eventName: string, isChecked: boolean) => {
        await fetchNui<boolean>(eventName);
        updateCheckboxState(eventName, isChecked);
    };

    const updateCheckboxState = (eventName: string, isChecked: boolean) => {
        // setCheckboxStates(prevStates => ({
        //     ...prevStates,
        //     [eventName]: isChecked,
        // }));
        setCheckboxStates((prevStates) => {
            const saveCheckBox = {
                ...prevStates,
                [eventName]: isChecked,
            };
            localStorage.setItem('checkBoxState', JSON.stringify(saveCheckBox));
            return saveCheckBox;
        });

    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && MenuData.show) {
                handleEscapeKeyPress();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [MenuData.show]);

    const handleEscapeKeyPress = async () => {
        await fetchNui<MenuData>('closeMenu');
    };

    const handleResetHud = async () => {
        await fetchNui('restartHud');
        const resetCheckBox = {
            minimapInCar: false,
            hideMinimapInCar: false,
            cinematicMod: false,
        };
        setCheckboxStates(resetCheckBox)
        localStorage.setItem('checkBoxState', JSON.stringify(resetCheckBox))
    };
    

    const handleCustomHud = async () => {
        await fetchNui('setupHud');
    };
    
    return (
        <div className={`main-menu-hud openCarhud ${MenuData.show ? '' : 'hidden'}`}>
            <div className="fake-bg"></div>
            <div className="title-hud-setting">TÙY CHỈNH GIAO DIỆN</div>
            <div className="line-menu"></div>
            <div className="option-menu">TÙY CHỌN</div>
            <div className="check-minimap-in-car">
                <Checkbox
                    checked={checkboxStates.minimapInCar}
                    onChange={(isChecked) => {
                        handleCheckboxChange('showOutMap', isChecked);
                        updateCheckboxState('minimapInCar', isChecked);
                    }}
                />
            </div>
            <div className="title-minimap-in-car">chỉ hiện bản đồ nhỏ trên xe</div>

            <div className="check-hide-minimap-in-car">
                <Checkbox
                    checked={checkboxStates.hideMinimapInCar}
                    onChange={(isChecked) => {
                        handleCheckboxChange('HideMap', isChecked);
                        updateCheckboxState('hideMinimapInCar', isChecked);
                    }}
                />
            </div>
            <div className="title-hide-minimap-in-car">Tắt bản đồ nhỏ trên xe</div>

            <div className="check-cinematic-mod">
                <Checkbox
                    checked={checkboxStates.cinematicMod}
                    onChange={(isChecked) => {
                        handleCheckboxChange('cinematicMode', isChecked);
                        updateCheckboxState('cinematicMod', isChecked);
                    }}
                />
            </div>
            <div className="title-cinematic-mod">Chế Độ Điện Ảnh</div>
            <div className="btn-custom-hud" onClick={handleCustomHud}>TÙY BIẾN GIAO DIỆN</div>
            <div className="btn-reset-hud" onClick={handleResetHud}>CÀI ĐẶT LẠI HUD</div>
            <div className="btn-close" onClick={handleEscapeKeyPress}>X</div>
            <div className="text-white font-Orbitron uppercase text-[0.5rem] absolute bottom-1">{result}</div>
        </div>
    );
});

export default HudMenu;