import { useEffect, useState } from "react";
import Fade from "./components/utils/transitions/Fade";
import useNuiEvent from "./hooks/useNuiEvent";
import { debugData } from "./utils/debugData";
import Header from "./components/Header";
import { fetchNui } from "./utils/fetchNui";
import type { CategoryProps } from "./typings/category";
import Category from "./components/Category";
import Dashboard from "./components/categories/Dashboard";
import type { OpenData, Player } from "./typings/open";
import Players from "./components/categories/Players";

debugData<OpenData>([
  {
    action: 'openAdmin',
    data: {
      players: {
        players: [
          { charName: 'Andrew Pierce', id: 15, steam: 458745156, accName: 'Ravage', admin: true },
          { charName: 'Sarah Brassi', id: 11, steam: 154876512, accName: 'mrs.sarahh', admin: true },
          { charName: 'Mathew Cavazza', id: 8, steam: 124568725, accName: 'mathew' },
          { charName: 'Antonny Goodman', id: 25, steam: 123783242, accName: 'Mrdudecall' },
          { charName: 'Jesse Pinkman', id: 35, steam: 101204538, accName: 'iamboss' },
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
    { name: 'players', icon: 'fa-solid fa-users' }
  ]);
  const currentCategory = categories.find(c => c.active)?.name || 'dashboard';
  const [player, setPlayer] = useState<Player | null>(null);
  const [peds, setPeds] = useState();

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
    <Fade in={visible}>
      <div className="font-[Inter] h-2/3 w-3/5 bg-gradient-to-r from-black to-[#122202] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded
      border-2 border-gray-500">
        <Header exit={() => handleClose()} />
        <div className="flex h-[85%]">
          <div className="w-fit px-10 flex flex-col gap-3">
            {categories.map((category, index) => (
              <Category key={`category-${index}`} icon={category.icon} active={category?.active} setactive={() => changeCategory(category.name)} />
            ))}
          </div>
          <div className="w-full h-full">
            {currentCategory === 'dashboard' && <Dashboard data={data} changeCategory={(name: string) => changeCategory(name)} setPlayer={(data: Player) => setPlayer(data)} />}
            {currentCategory === 'players' && <Players data={data as OpenData} player={player} setPlayer={setPlayer} peds={peds} handleClose={handleClose} />}
          </div>
        </div>
      </div>
    </Fade>
  )
};

export default App;