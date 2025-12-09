import React from 'react';
import { useLogStore } from '../../store/useLogStore';

const LogBox: React.FC<{ show: boolean }> = ({ show }) => {
  const logs = useLogStore((s) => s.logs);
  const clear = useLogStore((s) => s.clear);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 w-[380px] max-h-[350px] bg-[#000000c7] text-white p-3 rounded-xl overflow-y-auto backdrop-blur-xl shadow-2xl text-sm z-[99999] no-scrollbar">
      <div className="flex justify-between items-center mb-2">
        <div className="font-bold">Console Log</div>
        <button onClick={clear} className="text-red-300 hover:text-red-400">Clear</button>
      </div>
      {logs.map((log, i) => (
        <div
          key={i}
          className={`py-1 border-b border-[#ffffff1e] ${
            log.type === 'error'
              ? 'text-red-400'
              : log.type === 'warn'
              ? 'text-yellow-300'
              : 'text-white'
          }`}
        >
          {log.msg}
        </div>
      ))}
    </div>
  );
};

export default LogBox;
