import React, { useState } from "react";
// import HudStatus from "../components/HudStatus";
// import InfoHud from "../components/InfoHud";
// import KeyBinds from "../components/KeyBinds";
import HudMenu from "../components/MenuHud";
import HudCar from "../components/HudCar";
import WaveHud from "../components/hudMisc/WaveHud";
import useHudStore from "../store/useHudStore";
import useKeyBindStore from "../store/useKeyBindStore";
import useInfoHudStore from "../store/useInfoHudStore";
import useUpdateData from "../hooks/useUpdateData";
import HexHud from "../components/hudMisc/HexHud";
import HexBoxHud from "../components/hudMisc/HexBoxHud";
import { fetchNui } from "../utils/fetchNui";
import { debugData } from "../utils/debugData";
import { DraggableHudItem } from "../components/misc/DraggableHudItem";

debugData([
    {
        event: 'statusData',
        data: {
            show: true,
            health: 10,
            armor: 40,
            hunger: 30,
            thirst: 60,
            stress: 10,
            oxygen: 30,
            idPlayer: 23,
        }
    },
    {
        event: 'updateJobOne',
        data: {
            label: 'Cảnh Sát',
            grade: '3',
        }
    },
    {
        event: 'updateJobTwo',
        data: {
            label: 'Cảnh Sát',
            grade: '3',
        }
    },
    {
        event: 'updateMoney',
        data: {
            cash: 1000,
            bank: 5000,
        }
    },
    {
        event: 'updateWeapon',
        data: {
            weaponName: 'AK 47',
            clipAmmoCount: 30,
            ammoCount: 120,
        }
    },
    {
        event: 'carData',
        data: {
            show: true,
            speed: 89,
            fuel: 10,
            engine: 100,
            gear: 3,
            lights: 0,
            seatbelt: false,
            doorOpen: false,
        }
    },
    {
        event: 'editMode',
        data: {
            editMode: false,
        }
    }
]);

const Hud: React.FC = React.memo(() => {
    const { statusData, setStatusData, carData, setCarData, editMode, setEditMode, hudColors, hudType, setHudType, resetHudPositions, resetHudSettings } = useHudStore();
    const { setKeyBinds } = useKeyBindStore();
    const { setUpdateJobOne, setUpdateJobTwo, setUpdateMoney, setUpdateWeapon, setPlayerInfo } = useInfoHudStore();
    const [openHudMenu, setOpenHudMenu] = useState(false);

    useUpdateData({
        statusData: setStatusData,
        keyBinds: setKeyBinds,
        updateJobOne: setUpdateJobOne,
        updateJobTwo: setUpdateJobTwo,
        updateMoney: setUpdateMoney,
        updateWeapon: setUpdateWeapon,
        carData: setCarData,
        playerInfo: setPlayerInfo,
        editMode: setEditMode,
    })

    const exitEditMode = () => {
        setEditMode({ editMode: false })
        fetchNui('exitSetup')
    }

    const resetHud = () => {
        resetHudPositions();
        resetHudSettings();
    }

    return (
        <>
            {(editMode.editMode || statusData.show) && (
                <>
                    {editMode.editMode && (
                        <div className="w-full h-full absolute bg-[#0b0603f2]">
                            <div className="flex flex-col items-start gap-3 absolute top-[0.88rem] left-[0.88rem]">
                                <div className="flex items-center gap-[0.5625rem] self-stretch">
                                    <div className="w-[10rem] h-[2.25rem] rounded-[0.4375rem] border-[0.0625rem] border-solid border-[#DC143C] bg-[linear-gradient(180deg,_rgba(61,_2,_2,_0.20)_0%,_rgba(61,_2,_2,_0.80)_100%)] text-white text-center font-[Saira] text-[1.02969rem] not-italic font-semibold flex items-center justify-center btn-hover" onClick={() => exitEditMode()}>THOÁT VÀ LƯU</div>
                                    <div className="w-[7.375rem] h-[2.25rem] rounded-[0.4375rem] border-[0.0625rem] border-solid border-[#DC143C] bg-[linear-gradient(180deg,_rgba(61,_2,_2,_0.20)_0%,_rgba(61,_2,_2,_0.80)_100%)] text-white text-center font-[Saira] text-[1.02969rem] not-italic font-semibold flex items-center justify-center btn-hover" onClick={() => resetHud()}>ĐẶT LẠI</div>
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenHudMenu(!openHudMenu)}
                                            className="w-[7rem] h-[2.25rem] rounded-[0.4375rem] border-[0.0625rem] border-solid border-[#DC143C] bg-[linear-gradient(180deg,_rgba(61,_2,_2,_0.20)_0%,_rgba(61,_2,_2,_0.80)_100%)] text-white font-[Saira] text-[1.02969rem] flex items-center justify-center cursor-pointer btn-hover"
                                        >
                                            {hudType.type}
                                        </button>
                                        {openHudMenu && (
                                            <div className="absolute top-[2.6rem] left-0 w-[7rem] rounded-[0.4375rem] overflow-hidden border-[0.0625rem] border-solid border-[#DC143C] bg-[#1a0d0bcc] z-50">

                                                <div
                                                    onClick={() => {
                                                        setHudType({ type: "Wave" });
                                                        setOpenHudMenu(false);
                                                    }}
                                                    className="px-2 py-2 text-white text-[0.75rem] font-[Saira] cursor-pointer hover:bg-[#DC143C]"
                                                >
                                                    Wave
                                                </div>
                                                <div
                                                    onClick={() => {
                                                        setHudType({ type: "Hex" });
                                                        setOpenHudMenu(false);
                                                    }}
                                                    className="px-2 py-2 text-white text-[0.75rem] font-[Saira] cursor-pointer hover:bg-[#DC143C]"
                                                >
                                                    Hex
                                                </div>
                                                <div
                                                    onClick={() => {
                                                        setHudType({ type: "HexBox" });
                                                        setOpenHudMenu(false);
                                                    }}
                                                    className="px-2 py-2 text-white text-[0.75rem] font-[Saira] cursor-pointer hover:bg-[#DC143C]"
                                                >
                                                    Hex Box
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>
                                <div className="w-[15.5rem] h-[4.5rem] rounded-[0.4375rem] border-[0.0625rem] border-solid border-[#DC143C] bg-[linear-gradient(180deg,_rgba(61,_2,_2,_0.20)_0%,_rgba(61,_2,_2,_0.80)_100%)] relative">
                                    <div className="text-white text-center font-[Saira] text-[0.75rem] not-italic font-semibold absolute left-[0.69rem] top-[0.81rem]">CHẾ ĐỘ TÙY CHỈNH</div>
                                    <div className="text-white font-[Saira] text-[0.5rem] not-italic font-medium absolute left-[0.69rem] top-[2.19rem]">KÉO CÁC THÀNH PHẦN CỦA HUD ĐỂ TÙY CHỈNH <br />CHUỘT PHẢI ĐỂ ĐỔI MÀU</div>
                                </div>
                            </div>
                        </div>
                    )}
                    <DraggableHudItem id="hud_status" defaultX={0} defaultY={0} editMode={editMode.editMode}>
                        <div className="inline-flex items-center gap-3 bottom-7">
                            {
                                hudType.type === 'Hex' && (
                                    <>
                                        <div className="flex flex-col items-start gap-[0.0625rem]">
                                            <HexHud percent={statusData.health} icon={'Heart'} hudKey="health" color={hudColors.health} />
                                            <div className="text-white text-center font-[Saira] text-[1.02969rem] font-semibold w-full">{Math.round(statusData.health)}%</div>
                                        </div>
                                        <div className="flex flex-col items-start gap-[0.0625rem]">
                                            <HexHud percent={statusData.armor} icon={'Shield'} hudKey="armor" color={hudColors.armor} />
                                            <div className="text-white text-center font-[Saira] text-[1.02969rem] font-semibold w-full">{Math.round(statusData.armor)}%</div>
                                        </div>
                                        <div className="flex flex-col items-start gap-[0.0625rem]">
                                            <HexHud percent={statusData.hunger} icon={'Hunger'} hudKey="hunger" color={hudColors.hunger} />
                                            <div className="text-white text-center font-[Saira] text-[1.02969rem] font-semibold w-full">{Math.round(statusData.hunger)}%</div>
                                        </div>
                                        <div className="flex flex-col items-start gap-[0.0625rem]">
                                            <HexHud percent={statusData.thirst} icon={'Thirst'} hudKey="thirst" color={hudColors.thirst} />
                                            <div className="text-white text-center font-[Saira] text-[1.02969rem] font-semibold w-full">{Math.round(statusData.thirst)}%</div>
                                        </div>
                                        <div className="flex flex-col items-start gap-[0.0625rem]">
                                            <HexHud percent={statusData.oxygen} icon={'Stamina'} hudKey="oxygen" color={hudColors.oxygen} />
                                            <div className="text-white text-center font-[Saira] text-[1.02969rem] font-semibold w-full">{Math.round(statusData.oxygen)}%</div>
                                        </div>
                                        <div className="flex flex-col items-start gap-[0.0625rem]">
                                            <HexHud percent={statusData.stress} icon={'Stress'} hudKey="stress" color={hudColors.stress} />
                                            <div className="text-white text-center font-[Saira] text-[1.02969rem] font-semibold w-full">{Math.round(statusData.stress)}%</div>
                                        </div>
                                    </>
                                )
                            }
                            {
                                hudType.type === 'HexBox' && (
                                    <>
                                        <HexBoxHud percent={statusData.health} icon={'Heart'} hudKey="health" color={hudColors.health} />
                                        <HexBoxHud percent={statusData.armor} icon={'Shield'} hudKey="armor" color={hudColors.armor} />
                                        <HexBoxHud percent={statusData.hunger} icon={'Hunger'} hudKey="hunger" color={hudColors.hunger} />
                                        <HexBoxHud percent={statusData.thirst} icon={'Thirst'} hudKey="thirst" color={hudColors.thirst} />
                                        <HexBoxHud percent={statusData.oxygen} icon={'Stamina'} hudKey="oxygen" color={hudColors.oxygen} />
                                        <HexBoxHud percent={statusData.stress} icon={'Stress'} hudKey="stress" color={hudColors.stress} />
                                    </>
                                )
                            }
                            {
                                hudType.type === 'Wave' && (
                                    <>
                                        <div className="flex flex-col items-start gap-[0.0625rem]">
                                            <WaveHud percent={statusData.health} icon={'Heart'} hudKey="health" color={hudColors.health} />
                                            <div className="text-white text-center font-[Saira] text-[1.02969rem] font-semibold w-full">{Math.round(statusData.health)}%</div>
                                        </div>
                                        <div className="flex flex-col items-start gap-[0.0625rem]">
                                            <WaveHud percent={statusData.armor} icon={'Shield'} hudKey="armor" color={hudColors.armor} />
                                            <div className="text-white text-center font-[Saira] text-[1.02969rem] font-semibold w-full">{Math.round(statusData.armor)}%</div>
                                        </div>
                                        <div className="flex flex-col items-start gap-[0.0625rem]">
                                            <WaveHud percent={statusData.hunger} icon={'Hunger'} hudKey="hunger" color={hudColors.hunger} />
                                            <div className="text-white text-center font-[Saira] text-[1.02969rem] font-semibold w-full">{Math.round(statusData.hunger)}%</div>
                                        </div>
                                        <div className="flex flex-col items-start gap-[0.0625rem]">
                                            <WaveHud percent={statusData.thirst} icon={'Thirst'} hudKey="thirst" color={hudColors.thirst} />
                                            <div className="text-white text-center font-[Saira] text-[1.02969rem] font-semibold w-full">{Math.round(statusData.thirst)}%</div>
                                        </div>
                                        <div className="flex flex-col items-start gap-[0.0625rem]">
                                            <WaveHud percent={statusData.oxygen} icon={'Stamina'} hudKey="oxygen" color={hudColors.oxygen} />
                                            <div className="text-white text-center font-[Saira] text-[1.02969rem] font-semibold w-full">{Math.round(statusData.oxygen)}%</div>
                                        </div>
                                        <div className="flex flex-col items-start gap-[0.0625rem]">
                                            <WaveHud percent={statusData.stress} icon={'Stress'} hudKey="stress" color={hudColors.stress} />
                                            <div className="text-white text-center font-[Saira] text-[1.02969rem] font-semibold w-full">{Math.round(statusData.stress)}%</div>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </DraggableHudItem>
                    {(editMode.editMode || carData.show) && (
                        <>
                            <DraggableHudItem id="hud_car" defaultX={108} defaultY={53} editMode={editMode.editMode}>
                                <HudCar />
                            </DraggableHudItem>
                        </>
                    )}
                </>
            )}
            <HudMenu/>
        </>
    );
});

export default Hud;