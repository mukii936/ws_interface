import React, { useState } from 'react';
import useUpdateData from '../hooks/useUpdateData';
import type { NotifyData } from '../interface/Misc';
import { DraggableHudItem } from "../components/misc/DraggableHudItem";
import useHudStore from "../store/useHudStore";
import { debugData } from '../utils/debugData';

debugData([
    {
        event: 'NotifyData',
        data: {
            title: 'Test',
            type: 'success',
            message: 'This is a test notification',
            time: 3000,
            icon: 'fa-solid fa-bell',
        },
    },
    {
        event: 'NotifyData',
        data: {
            title: 'THÔNG BÓA',
            type: 'error',
            message: 'This is a test notification This is a test notification This is a test notification This is a test notification This is a test notification This is a test notification This is a test notification',
            time: 3000,
            icon: 'fa-solid fa-headphones',
        },
    },
])

interface Notification extends NotifyData {
    id: string;
    isExiting?: boolean;
}

const Notify: React.FC = React.memo(() => {
    const { editMode, setNotifyColors, notifyColors } = useHudStore();

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showPicker, setShowPicker] = useState(false);

    useUpdateData({
        NotifyData: (data) => {
            const id = `${Date.now()}-${Math.random()}`;

            const audio = new Audio('./sound/notify.mp3');
            audio.play().catch((err) => console.warn('Sound play failed:', err));

            setNotifications((prev) => [...prev, { ...data, id }]);

            setTimeout(() => {
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.id === id ? { ...n, isExiting: true } : n
                    )
                );

                setTimeout(() => {
                    setNotifications((prev) => prev.filter((n) => n.id !== id));
                }, 300);
            }, data.time);
        },
    });

    const displayNotifications = editMode.editMode
        ? Array.from({ length: 4 }).map((_, i) => notifications[i] || { id: `empty-${i}`, title: 'THÔNG BÁO', message: 'ĐÂY LÀ THÔNG BÁO THỬ NGHIỆM', icon: 'fa-solid fa-bell', isExiting: false, type: 'success', time: 3000 })
        : notifications;

    const handleChangeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setNotifyColors(newColor);
    };

    const handleRightClick = (e: React.MouseEvent) => {
        if (!editMode.editMode) return;
        e.preventDefault();
        setShowPicker(true);
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
            <DraggableHudItem id="notify" defaultX={98} defaultY={15} editMode={editMode.editMode}>
                <div className="w-[20.25rem] h-full space-y-5" onContextMenu={handleRightClick}>
                    {displayNotifications.map((notify) => (
                        <div
                            key={notify.id}
                            className={`w-full min-h-16 relative flex items-center justify-center flex-col border-[0.0625rem] border-solid ${notify.isExiting ? 'animate-slideOut' : 'animate-slideIn'}`}
                            style={{
                                borderColor: notifyColors.colors,
                                background: darken(notifyColors.colors, 80),
                            }}
                            >
                            {notify.title && (
                                <>
                                    <div className="w-[2.90494rem] h-[2.90494rem] absolute left-[0.81rem] flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                            <rect width="30" height="30" fill={darken(notifyColors.colors, 80)} fillOpacity="0.45" />
                                            <path d="M0 0H6L0 6V0Z" fill={notifyColors.colors} />
                                            <path d="M30 30H19.2L30 19.2V30Z" fill={notifyColors.colors} />
                                            <path d="M0 30L8.4 30L-6.29444e-07 22.8L0 30Z" fill={notifyColors.colors} fillOpacity="0.2" />
                                            <path d="M30 0L16.8 1.15398e-06L30 12L30 0Z" fill={notifyColors.colors} fillOpacity="0.2" />
                                        </svg>
                                        <i className={`${notify.icon} absolute text-[1.1875rem] text-white`}></i>
                                    </div>
                                    <div className="mt-[0.31rem] absolute top-[0.2rem] left-[4.51rem] uppercase text-[1rem] font-bold font-[Saira]" style={{color: notifyColors.colors}}>
                                        {notify.title}
                                    </div>
                                    <div
                                        className="w-[15.25rem] text-white text-[0.9rem] font-bold mt-[2rem] ml-[4.31rem] mb-[0.5rem] font-[Saira]"
                                        dangerouslySetInnerHTML={{ __html: notify.message }}
                                    ></div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
                {showPicker && editMode.editMode && (
                    <input
                        type="color"
                        value={notifyColors.colors}
                        onChange={handleChangeColor}
                        onBlur={() => setShowPicker(false)}
                        autoFocus
                        className="absolute left-full ml-2 w-8 h-8 p-0 border-none cursor-pointer"
                    />
                )}
            </DraggableHudItem>
        </>
    );
});

export default Notify;

