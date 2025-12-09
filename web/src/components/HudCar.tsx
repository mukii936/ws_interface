import React, { useState } from "react";
import useHudStore from "../store/useHudStore";
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
// import type { CarHudColors } from "../store/useHudStore";

const HudCar: React.FC = React.memo(() => {
    const { carData, setCarHudColor, carHudColors, editMode } = useHudStore();
    const [showPicker, setShowPicker] = useState(false);

    const handleRightClick = (e: React.MouseEvent) => {
        if (!editMode.editMode) return;
        e.preventDefault();
        setShowPicker(true);
    };

    const handleChangeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setCarHudColor(newColor);
    };

    const calculateGear = (value: number): string => {
        switch (value) {
            case 0:
                return `N`;
            case 1:
                return `R`;
            default:
                return `${value - 1}`;
        }
    };

    const speedEffect = (speed: number, carHudColors: { colors: string }) => {
        const colorWithOpacity = `${carHudColors.colors}4D`; 
        if (speed === 0) {
            return `<span class="text-[2.5rem] font-bold" style="color: ${colorWithOpacity};">000</span>`;
        } else if (speed <= 9) {
            return `<span class="text-[2.5rem] font-bold" style="color: ${colorWithOpacity};">00</span>${speed}`;
        } else if (speed <= 99) {
            return `<span class="text-[2.5rem] font-bold" style="color: ${colorWithOpacity};">0</span>${speed}`;
        } else {
            return `${speed}`;
        }
    };

    const calProgressCircular = (value: number) => {
        if (!value) {
            return 0
        }
        const percent = (value / 100) * 32
        return percent
    }

    const calProgressCircular2 = (value: number) => {
        if (!value) {
            return 0
        }
        const percent = (value / 100) * 80
        return percent
    }

    return (
        <>
            <div onContextMenu={handleRightClick} className="w-[13.77838rem] h-[13.77838rem] relative flex items-center justify-center" >
                <svg xmlns="http://www.w3.org/2000/svg" width="91" height="12" viewBox="0 0 91 12" fill="none" className="w-[5.6875rem] h-[0.75rem] absolute bottom-9">
                    <path d="M28.0909 2.78378C26.2727 2.78378 24 4.19595 24 6.5C24 8.80405 26.2727 10.2162 28.0909 10.2162C29.9091 10.2162 29.9091 2.78378 28.0909 2.78378ZM30.3636 3.52703L32.7273 2.26351L31.7273 1L29.5455 2.18919C29.8182 2.48649 30.1818 2.93243 30.3636 3.52703ZM30.8182 5.75676V7.24324H34V5.75676H30.8182ZM29.5455 10.8108L31.7273 12L32.7273 10.7365L30.3636 9.47297C30.1818 9.99324 29.9091 10.5135 29.5455 10.8108Z" fill="white" fill-opacity={carData.light > 0 ? "1" : "0.2"} />
                    <path d="M49.2632 8.33333C49.2632 7.99583 48.9896 7.72222 48.652 7.72222H48.1374C47.7999 7.72222 47.5263 7.99583 47.5263 8.33333C47.5263 8.67084 47.7999 8.94444 48.1374 8.94444H48.652C48.9896 8.94444 49.2632 8.67084 49.2632 8.33333ZM51 10.7784C51 11.4531 50.4531 12 49.7784 12H41.2216C40.5469 12 40 11.4531 40 10.7784V6.37565C40 6.06309 40.1198 5.76242 40.3348 5.53552L44.2702 1.38144C44.5009 1.13793 44.8216 1 45.157 1H50.4211C50.5746 1 50.7219 1.06438 50.8304 1.17899C50.939 1.2936 51 1.44903 51 1.61111V10.7784ZM45.6375 2.22222C45.3021 2.22222 44.9814 2.36015 44.7507 2.60366L41.6384 5.88889H49.8421V2.22222H45.6375Z" fill="white" fill-opacity={carData.doorOpen ? "1" : "0.2"} />
                    <path d="M61.971 0C62.2787 0 62.5737 0.126428 62.7913 0.351472C63.0089 0.576515 63.1311 0.88174 63.1311 1.2C63.1311 1.866 62.6148 2.4 61.971 2.4C61.6633 2.4 61.3682 2.27357 61.1507 2.04853C60.9331 1.82348 60.8109 1.51826 60.8109 1.2C60.8109 0.88174 60.9331 0.576515 61.1507 0.351472C61.3682 0.126428 61.6633 0 61.971 0ZM62.1972 7.674C63.0212 7.67068 63.8445 7.72078 64.6624 7.824C64.6972 6.192 64.558 4.752 64.2912 4.2C64.2158 4.038 64.1114 3.9 64.0012 3.78L59.3202 7.932C60.109 7.8 61.1009 7.674 62.1972 7.674ZM59.3376 9C59.413 10.044 59.5638 11.1 59.8074 12H61.0081C60.8399 11.472 60.7181 10.854 60.6253 10.2C60.6253 10.2 61.971 9.936 63.3167 10.2C63.2239 10.854 63.1021 11.472 62.9339 12H64.1346C64.3898 11.07 64.5406 9.966 64.616 8.874C63.8134 8.77362 63.0057 8.72353 62.1972 8.724C61.0777 8.724 60.1032 8.85 59.3376 9ZM61.971 3C61.971 3 60.2309 3 59.6508 4.2C59.4536 4.608 59.326 5.49 59.2854 6.576L63.0847 3.204C62.5104 3 61.971 3 61.971 3ZM65.7819 2.202L65.1206 1.404L63.0847 3.21C63.4037 3.324 63.7401 3.504 64.0012 3.78L65.7819 2.202ZM67 8.298C66.9478 8.28 66.1125 7.998 64.6624 7.824C64.6566 8.166 64.6392 8.52 64.616 8.874C65.9211 9.042 66.6694 9.3 66.681 9.3L67 8.298ZM59.2854 6.576L57 8.604L57.5162 9.492C57.5278 9.486 58.2007 9.216 59.3376 9C59.2738 8.154 59.2564 7.32 59.2854 6.576Z" fill="white" fill-opacity="1" className={carData.seatbelt ? "seatbelt" : "animation-seatbelt"} />
                    <path d="M87.2188 10.625H80.3438C80.1547 10.625 80 10.7797 80 10.9688V11.6562C80 11.8453 80.1547 12 80.3438 12H87.2188C87.4078 12 87.5625 11.8453 87.5625 11.6562V10.9688C87.5625 10.7797 87.4078 10.625 87.2188 10.625ZM90.5961 3.30527L88.8559 1.56504C88.7227 1.43184 88.5035 1.43184 88.3703 1.56504L88.1275 1.80781C87.9943 1.94102 87.9943 2.16016 88.1275 2.29336L88.9375 3.10332V4.4375C88.9375 5.04121 89.3865 5.53965 89.9688 5.62344V9.07812C89.9688 9.36172 89.7367 9.59375 89.4531 9.59375C89.1695 9.59375 88.9375 9.36172 88.9375 9.07812V8.39062C88.9375 7.34648 88.091 6.5 87.0469 6.5H86.875V2.375C86.875 1.6166 86.2584 1 85.5 1H82.0625C81.3041 1 80.6875 1.6166 80.6875 2.375V9.9375H86.875V7.53125H87.0469C87.5217 7.53125 87.9062 7.91582 87.9062 8.39062V8.98789C87.9062 9.79785 88.4863 10.5348 89.292 10.6186C90.2158 10.7109 91 9.98477 91 9.07812V4.27852C91 3.91328 90.8539 3.56309 90.5961 3.30527ZM85.5 5.125H82.0625V2.375H85.5V5.125Z" fill="white" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.21053 1C5.36407 1 5.51133 1.06817 5.6199 1.18952C5.72848 1.31087 5.78947 1.47545 5.78947 1.64706C5.78947 1.81867 5.72848 1.98325 5.6199 2.1046C5.51133 2.22595 5.36407 2.29412 5.21053 2.29412H4.63158V2.94118H6.23179C6.41146 2.94119 6.58866 2.98793 6.74937 3.07771L8.62284 4.12465C8.81523 4.2321 8.97705 4.39731 9.09014 4.60177C9.20324 4.80623 9.26315 5.04186 9.26316 5.28224V6.82353H9.84211V6.17647C9.84211 6.00486 9.9031 5.84028 10.0117 5.71893C10.1202 5.59758 10.2675 5.52941 10.4211 5.52941C10.5746 5.52941 10.7219 5.59758 10.8304 5.71893C10.939 5.84028 11 6.00486 11 6.17647V8.76471C11 8.93632 10.939 9.1009 10.8304 9.22225C10.7219 9.34359 10.5746 9.41176 10.4211 9.41176C10.2675 9.41176 10.1202 9.34359 10.0117 9.22225C9.9031 9.1009 9.84211 8.93632 9.84211 8.76471V8.11765H9.26316V9.08824C9.26316 9.28914 9.22131 9.48729 9.14092 9.66698C9.06053 9.84668 8.94381 10.003 8.8 10.1235L6.87037 11.7412C6.66994 11.9092 6.42617 12 6.17563 12H1.15789C0.850802 12 0.556287 11.8637 0.339139 11.621C0.121992 11.3783 0 11.0491 0 10.7059V4.23529C0 3.89207 0.121992 3.56291 0.339139 3.32021C0.556287 3.07752 0.850802 2.94118 1.15789 2.94118H3.47368V2.29412H2.89474C2.74119 2.29412 2.59393 2.22595 2.48536 2.1046C2.37679 1.98325 2.31579 1.81867 2.31579 1.64706C2.31579 1.47545 2.37679 1.31087 2.48536 1.18952C2.59393 1.06817 2.74119 1 2.89474 1H5.21053ZM4.64026 5.29841C4.51861 5.21665 4.37432 5.18769 4.23481 5.21703C4.09531 5.24638 3.97031 5.33199 3.88358 5.45759L3.84595 5.52035L2.98274 7.12765C2.9323 7.22137 2.9037 7.32774 2.89958 7.43701C2.89546 7.54628 2.91595 7.65496 2.95916 7.75309C3.00237 7.85122 3.06692 7.93566 3.1469 7.99867C3.22688 8.06169 3.31973 8.10126 3.41695 8.11377L3.48411 8.11765H4.18811L3.84595 8.75565C3.77055 8.89717 3.74628 9.0655 3.77808 9.22633C3.80988 9.38716 3.89537 9.52839 4.01711 9.62121C4.13885 9.71404 4.28768 9.75148 4.43327 9.72591C4.57885 9.70034 4.71024 9.61368 4.80063 9.48359L4.83884 9.42147L5.70147 7.81353C5.75192 7.71981 5.78051 7.61344 5.78463 7.50417C5.78875 7.3949 5.76826 7.28622 5.72505 7.18809C5.68185 7.08996 5.61729 7.00552 5.53731 6.9425C5.45733 6.87949 5.36448 6.83992 5.26726 6.82741L5.20011 6.82353H4.49611L4.83826 6.18618C4.91731 6.0391 4.94086 5.86295 4.90373 5.69647C4.8666 5.52999 4.77183 5.38681 4.64026 5.29841Z" fill="white" />
                </svg>
                <div className="text-[#EE2D2D] font-Orbitron text-[2.5rem] font-bold absolute top-[4.5rem]"
                    style={{
                        color: `${carHudColors.colors}`,
                    }} dangerouslySetInnerHTML={{ __html: speedEffect(carData.speed, { colors: carHudColors.colors }) }}></div>
                <div className="text-[#EE2D2D] font-Orbitron text-[0.8rem] font-bold absolute bottom-[5.2rem]"
                    style={{
                        color: `${carHudColors.colors}`,
                    }}
                >SPEED</div>
                <div className="w-[3.5rem] h-[2.375rem] flex items-center justify-center absolute bottom-[3.2rem]">
                    <div className={`font-Orbitron text-[1rem] not-italic font-bold absolute left-0 leading-[100%] ${carData.gear == 0 ? 'hidden' : ''}`}
                        style={{
                            color: `${carHudColors.colors}4D`,
                        }}
                    >{calculateGear(carData.gear - 1)}</div>
                    <div className="font-Orbitron text-[1rem] not-italic font-bold absolute right-0 leading-[100%]"
                        style={{
                            color: `${carHudColors.colors}4D`,
                        }}
                    >{calculateGear(carData.gear)}</div>
                    <div className="font-Orbitron text-[1.4rem] font-bold absolute leading-[100%]"
                        style={{
                            color: `${carHudColors.colors}`,
                        }}
                    >{calculateGear(carData.gear + 1)}</div>
                </div>
                <div className="w-[12rem] h-[12rem] flex items-center justify-center absolute left-[0.5rem]">
                    <div className="w-[12rem] h-[12rem] rotate-[40deg] absolute">
                        <CircularProgressbarWithChildren
                            value={32}
                            background
                            backgroundPadding={7}
                            styles={buildStyles({
                                backgroundColor: "transparent",
                                pathColor: `${carHudColors.colors}4D`,
                                trailColor: "transparent",
                                strokeLinecap: 'butt',
                                rotation: 0.5,
                            })}
                            strokeWidth={3}>
                        </CircularProgressbarWithChildren>
                    </div>
                    <div className="w-[12rem] h-[12rem] rotate-[40deg] absolute">
                        <CircularProgressbarWithChildren
                            value={calProgressCircular(carData.engine)}
                            background
                            backgroundPadding={7}
                            styles={buildStyles({
                                backgroundColor: "transparent",
                                pathColor: `${carHudColors.colors}`,
                                trailColor: "transparent",
                                strokeLinecap: 'butt',
                                rotation: 0.5,
                                pathTransitionDuration: 0.5,
                            })}
                            strokeWidth={3}>
                        </CircularProgressbarWithChildren>
                    </div>
                </div>
                <div className="w-[12rem] h-[12rem] flex items-center justify-center absolute transform scale-x-[-1] right-[0.5rem]">
                    <div className="w-[12rem] h-[12rem] rotate-[40deg] absolute">
                        <CircularProgressbarWithChildren
                            value={32}
                            background
                            backgroundPadding={7}
                            styles={buildStyles({
                                backgroundColor: "transparent",
                                pathColor: `${carHudColors.colors}4D`,
                                trailColor: "transparent",
                                strokeLinecap: 'butt',
                                rotation: 0.5,
                            })}
                            strokeWidth={3}>
                        </CircularProgressbarWithChildren>
                    </div>
                    <div className="w-[12rem] h-[12rem] rotate-[40deg] absolute">
                        <CircularProgressbarWithChildren
                            value={calProgressCircular(carData.fuel)}
                            background
                            backgroundPadding={7}
                            styles={buildStyles({
                                backgroundColor: "transparent",
                                pathColor: `${carHudColors.colors}`,
                                trailColor: "transparent",
                                strokeLinecap: 'butt',
                                rotation: 0.5,
                                pathTransitionDuration: 0.5,
                            })}
                            strokeWidth={3}>
                        </CircularProgressbarWithChildren>
                    </div>
                </div>
                <div className="w-[10rem] h-[10rem] flex items-center justify-center absolute">
                    <div className="w-[10rem] h-[10em] rotate-[40deg] absolute">
                        <CircularProgressbarWithChildren
                            value={80}
                            background
                            backgroundPadding={7}
                            styles={buildStyles({
                                backgroundColor: "transparent",
                                pathColor: `${carHudColors.colors}4D`,
                                trailColor: "transparent",
                                strokeLinecap: 'butt',
                                rotation: 0.5,
                            })}
                            strokeWidth={5}>
                        </CircularProgressbarWithChildren>
                    </div>
                    <div className="w-[10rem] h-[10rem] rotate-[40deg] absolute">
                        <CircularProgressbarWithChildren
                            value={calProgressCircular2(carData.rpmPercent)}
                            background
                            backgroundPadding={7}
                            styles={buildStyles({
                                backgroundColor: "transparent",
                                pathColor: `${carHudColors.colors}`,
                                trailColor: "transparent",
                                strokeLinecap: 'butt',
                                rotation: 0.5,
                                pathTransitionDuration: 0.5,
                            })}
                            strokeWidth={5}>
                        </CircularProgressbarWithChildren>
                    </div>
                </div>
            </div>
            {showPicker && editMode.editMode && (
                <input
                    type="color"
                    value={carHudColors.colors}
                    onChange={handleChangeColor}
                    onBlur={() => setShowPicker(false)}
                    autoFocus
                    className="absolute left-full top-0 ml-2 w-8 h-8 p-0 border-none cursor-pointer"
                />
            )}
        </>
    );
});

export default HudCar;