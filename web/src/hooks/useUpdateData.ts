import { useEffect } from 'react';

interface Updaters {
  [key: string]: (data: any) => void;
}

const useUpdateData = (updaters: Updaters) => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { event: eventType, data } = event.data;
      if (updaters[eventType]) {
        updaters[eventType](data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [updaters]);
};

export default useUpdateData;
