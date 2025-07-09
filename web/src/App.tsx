import { useEffect, useState } from "react";
import Fade from "./components/utils/transitions/Fade";
import useNuiEvent from "./hooks/useNuiEvent";
import { debugData } from "./utils/debugData";
import Header from "./components/Header";
import { fetchNui } from "./utils/fetchNui";
import type { CategoryProps } from "./typings/category";
import Category from "./components/Category";
import Dashboard from "./components/categories/Dashboard";
import type { ActionsProps, EntityProps as EntityData, OpenData, Player } from "./typings/open";
import Players from "./components/categories/Players";
import { isEnvBrowser } from "./utils/misc";
import Developer from "./components/categories/Developer";
import EntityProps from "./components/EntityProps";

debugData<OpenData>([
  {
    action: 'openAdmin',
    data: {
      players: {
        players: [
          { charName: 'Andrew Pierce', id: 15, steam: 'char1:156465484132054asdaw8d4as564da', accName: 'Ravage', admin: true, online: true, stateId: 3 },
          { charName: 'Sarah Brassi', id: 11, steam: 'char1:asdas4da4s86d4asd54as6d84a6s8d', accName: 'unknown', admin: true, online: false, stateId: 2 },
          { charName: 'Mathew Cavazza', id: 8, steam: 'char1:asdasd456165123181dasdasdasdad', accName: 'mathew', online: true, stateId: 5 },
          { charName: 'Antonny Goodman', id: 25, steam: 'char1:d846adw68a4s5d1a6w54d68aw4da65', accName: 'Mrdudecall', online: true, stateId: 1 },
          { charName: 'Jesse Pinkman', id: 35, steam: 'char1:dasda4d648ad68a4d56as1d4a684da', accName: 'iamboss', online: true, stateId: 4 },
        ],
        jobs: [
          { label: 'Medical', amount: 2, color: '#f87171' },
          { label: 'Police', amount: 17, color: '#2563eb' },
          { label: 'DOJ', amount: 0, color: '#eab308' },
        ],
      }
    }
  }
])

const App: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [data, setData] = useState<OpenData>();
  const [categories, setCategories] = useState<CategoryProps[]>([
    { name: 'dashboard', icon: 'fa-solid fa-house', active: true },
    { name: 'players', icon: 'fa-solid fa-users' },
    { name: 'developer', icon: 'fa-solid fa-terminal' }
  ]);
  const currentCategory = categories.find(c => c.active)?.name || 'dashboard';
  const [player, setPlayer] = useState<Player | null>(null);
  const [peds, setPeds] = useState();
  const [screenshot, setScreenshot] = useState<any | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [entity, setEntity] = useState<EntityData | null>(null);

  async function fetchPeds() {
   const headers = {};

    const response = await fetch('https://raw.githubusercontent.com/DurtyFree/gta-v-data-dumps/refs/heads/master/peds.json', {
      headers: headers
    });

    if (response.status === 304) {
      return;
    }

    if (!response.ok) throw new Error(response.statusText);

    return await response.json();
  }

  useEffect(() => {
    (async () => {
      try {
        const peds = await fetchPeds();
        
        setPeds(peds);
      } catch (err) {
        console.error('Error fetching peds:', err);
      }
    })();
  }, []);

  useNuiEvent('openAdmin', (data: OpenData) => {
    setData(data);
    setVisible(true);
  });

  useNuiEvent('entityProps', (data: EntityData) => {
    setEntity(data);
  })

  useNuiEvent('hideEntityProps', () => {
    const wrapper = document.querySelector('.entity-modal') as HTMLElement;

    if (wrapper === null) return;

    wrapper.style.animation = 'flyOut 250ms forwards';

    setTimeout(() => {
      if (entity !== null) {
        setEntity(null)
      };
    }, 250)
  })

  useNuiEvent('screenshot', (image: string) => {
    setScreenshot(image);
  })

  const handleClose = () => {
    setVisible(false);
    setScreenshot(null);
    fetchNui('closeAdmin');
  };

  useEffect(() => {
    const root = document.getElementById('root');

    if (!showModal) {
      if (isEnvBrowser()) {
        // https://i.imgur.com/iPTAdYV.png - Night time img
        root!.style.backgroundImage = 'url("https://i.imgur.com/3pzRj9n.png")';
        root!.style.backgroundSize = 'cover';
        root!.style.backgroundRepeat = 'no-repeat';
        root!.style.backgroundPosition = 'center';

        return;
      }

      root!.style.background = 'none';
    } else {
      root!.style.background = 'rgba(0, 0, 0, 0.85)';
    }
  }, [showModal]);

  // Hides the context menu on ESC
  useEffect(() => {
    if (!isEnvBrowser()) document.getElementById('root')!.style.background = 'none';
    setShowModal(false);

    if (!visible && !screenshot) return;

    const keyHandler = (e: KeyboardEvent) => {
      if (['Escape'].includes(e.code)) handleClose();
    };

    window.addEventListener('keydown', keyHandler);

    return () => window.removeEventListener('keydown', keyHandler);
  }, [visible, screenshot]);

  const changeCategory = (name: string) => {
    if (name === 'players' && currentCategory === 'players') setPlayer(null);

    setCategories(prev => 
      prev.map(cat => ({
        ...cat,
        active: cat.name === name
      }))
    )
  }

  return (
    <>
      <Fade in={screenshot ? true :false}>
        <img
          src={screenshot}
          className="w-[1500px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded border border-neutral-900"
        />
      </Fade>
      <Fade in={visible}>
        <div className={`h-2/3 w-3/5 bg-gradient-to-r from-[#000000f9] to-[#122202f9] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded
        border-2 border-gray-500 ${showModal && 'pointer-events-none'}`}>
          <Header exit={() => handleClose()} />
          <div className="flex h-[85%]">
            <div className="w-fit px-10 flex flex-col gap-3">
              {categories.map((category, index) => (
                <Category key={`category-${index}`} icon={category.icon} active={category?.active} setactive={() => changeCategory(category.name)} />
              ))}
            </div>
            <div className="w-full h-full">
              {currentCategory === 'dashboard' && <Dashboard data={data} changeCategory={(name: string) => changeCategory(name)} setPlayer={(data: Player) => setPlayer(data)} />}
              {currentCategory === 'players' && <Players data={data as OpenData} player={player} setPlayer={setPlayer} peds={peds} handleClose={handleClose} setShowModal={setShowModal} />}
              {currentCategory === 'developer' && <Developer actions={data?.actions as ActionsProps} close={handleClose} />}
            </div>
          </div>
        </div>
      </Fade>
      {entity !== null &&
        <EntityProps entity={entity} />
      }
    </>
  )
};

export default App;