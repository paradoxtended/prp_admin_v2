import { useEffect, useState } from "react";
import Fade from "./components/utils/transitions/Fade";
import useNuiEvent from "./hooks/useNuiEvent";
import { debugData } from "./utils/debugData";
import Header from "./components/Header";
import { fetchNui } from "./utils/fetchNui";

debugData([
  {
    action: 'openAdmin',
    data: {}
  }
])

const App: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);

  useNuiEvent('openAdmin', () => {
    setVisible(true);
  });

  const handleClose = () => {
    setVisible(false);
    fetchNui('closeAdmin');
  };

  // Hides the context menu on ESC
  useEffect(() => {
    if (!visible) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) handleClose();
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible]);

  return (
    <Fade in={visible}>
      <div className="h-2/3 w-3/5 bg-gradient-to-r from-black to-[#122202] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded
      border-2 border-gray-500">
        <Header exit={() => handleClose()} />
      </div>
    </Fade>
  )
};

export default App;