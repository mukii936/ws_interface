import React from 'react';
import Hud from './layout/Hud';
import Shop from './layout/Shop';
import Notify from './layout/Notify';
import DebugUi from './components/misc/DebugUi';
import LogBox from './components/misc/LogBox';
import Economy from './layout/Economy';
import { isEnvBrowser } from './utils/misc';
import { useDevStore } from './store/useDevStore';

const App: React.FC = React.memo(() => {
  const showLog = useDevStore((s) => s.showLog);

  return (
    <div className="w-full h-screen flex justify-center items-center relative">
      <Hud />
      <Shop />
      <Notify />
      <Economy />
      {isEnvBrowser() && (
        <>
          <DebugUi />
          <LogBox show={showLog} />
        </>
      )}
    </div>
  );
});

export default App;
