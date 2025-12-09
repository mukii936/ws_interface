import { useState, useEffect } from 'react';

const useTimeday = () => {
    const [date, setDate] = useState<string>('');
    const [time, setTime] = useState<string>('');

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const formattedDate = now.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' });
            const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
            setDate(formattedDate);
            setTime(formattedTime);
        };

        updateDateTime();
        const intervalId = setInterval(updateDateTime, 1000);

        return () => clearInterval(intervalId); 
    }, []);

    return {
        date,
        time
    };
};

export default useTimeday;
