import React, { useState } from "react";
import { debugData } from "../../utils/debugData";
import { useDevStore } from "../../store/useDevStore";

const DebugUi: React.FC = React.memo(() => {
    const [open, setOpen] = useState(false);
    const [showCustom, setShowCustom] = useState(false);
    const [customText, setCustomText] = useState("");

    const showLog = useDevStore(state => state.showLog);
    const toggleLog = useDevStore(state => state.toggleLog);

    const menu = [
        {
            label: "Show 01",
            action: () =>
                debugData([
                    {
                        event: "inmateListDataShow",
                        data: {
                            show: true,
                        },
                    },
                ]),
        },
        {
            label: "Load Init",
            action: () =>
                debugData([
                    {
                        event: "inmateListDataInit",
                        data: {
                            initData: {
                                "1": {
                                    id: 1,
                                    name: "YOUNG TEAKZ",
                                    reason: "500m",
                                    time: "14 Phút Trước",
                                },
                                "2": {
                                    id: 2,
                                    name: "JOHN DOE",
                                    reason: "1km",
                                    time: "5 Phút Trước",
                                },
                            }, 
                        },
                    },
                ]),   
        }
    ];

    const executeCustom = () => {
        try {
            const parsed = JSON.parse(customText);
            debugData(parsed);
        } catch (err) {
            console.error("JSON invalid:", err);
            alert("JSON không hợp lệ — kiểm tra lại format!");
        }
    };

    return (
        <div className="inline-block absolute text-left top-10 left-10">

            <button
                onClick={() => setOpen(!open)}
                className="px-4 py-2 bg-[#FB8135] text-white rounded-lg"
            >
                Dev Mode ▼
            </button>

            {open && (
                <div className="absolute mt-2 w-72 bg-[#fb813591] shadow-lg rounded-xl p-3 z-50 backdrop-blur">

                    {menu.map((item, index) => (
                        <button
                            key={index}
                            onClick={item.action}
                            className="block w-full text-left px-3 py-2 hover:bg-[#FB8135] rounded-lg text-white"
                        >
                            {item.label}
                        </button>
                    ))}

                    <button
                        onClick={toggleLog}
                        className="mt-2 block w-full text-left px-3 py-2 bg-[#FB8135] rounded-lg text-white"
                    >
                        {showLog ? "Hide Log Box" : "Show Log Box"}
                    </button>

                    <button
                        onClick={() => setShowCustom(!showCustom)}
                        className="mt-2 block w-full text-left px-3 py-2 bg-[#FB8135] rounded-lg text-white"
                    >
                        Custom Debug
                    </button>

                    {showCustom && (
                        <div className="mt-3 flex flex-col gap-2">
                            <textarea
                                className="w-full h-40 p-2 rounded-lg bg-[#692f0b3d] text-white border-none focus:outline-none resize-none overflow-hidden placeholder:text-white"
                                placeholder='JSON debug...'
                                value={customText}
                                onChange={(e) => setCustomText(e.target.value)}
                            />
                            <button
                                onClick={executeCustom}
                                className="px-3 py-2 bg-[#FB8135] text-white rounded-lg"
                            >
                                Execute
                            </button>
                        </div>
                    )}

                    <div className="text-white text-xs text-center mt-3 uppercase">Power By WatermelonStudio © 2025</div>
                </div>
            )}
        </div>
    );
});

export default DebugUi;
