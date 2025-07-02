import { useEffect, useState } from "react";
import { Locale } from "../../store/locale";
import Fade from "../../utils/transitions/Fade";

const PedsModal: React.FC<{
  peds: any;
  visible: boolean;
  onClose: () => void;
  onConfirm: (model: string) => void;
}> = ({ peds, visible, onClose, onConfirm }) => {
    const [query, setQuery] = useState<string>('');
    const [filter, setFilter] = useState(peds);

    useEffect(() => {
        const reduced = peds.filter((model: any) => {
            return model.Name.toLowerCase().includes(query.toLowerCase())
        });

        setFilter(reduced);
    }, [query]);

    useEffect(() => setQuery(''), [visible]);

    return (
        <Fade in={visible}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto opacity-100 pt-3 pl-3 pr-2 pb-3 bg-neutral-900 w-[500px] rounded
            border border-neutral-700 flex flex-col items-center text-white gap-3">
                <i onClick={onClose} className="fa-solid fa-xmark absolute top-2 right-2.5 text-neutral-600 cursor-pointer hover:text-neutral-500 duration-200"></i>
                <p className="font-semibold text-[22px] my-1">{Locale.ui_select_ped || 'Select ped from list'}</p>
                <div className="w-full relative">
                    <input type="text"
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full focus:outline-none bg-neutral-800 px-4 py-2 text-sm rounded-md border border-neutral-600
                        focus:border-lime-600 placeholder:text-neutral-500"
                        placeholder={Locale.ui_search || 'Search...'}
                    />
                    <i className="fa-solid fa-magnifying-glass absolute top-1/2 -translate-y-1/2 right-3 text-neutral-400 scale-90 pointer-events-none"></i>
                </div>
                <div className="h-80 grid grid-cols-3 gap-3 overflow-y-auto overflow-x-hidden w-full pr-2 relative">
                    {filter.map((model: any, index: number) => (
                        <div key={`pedModel-${index}`}>
                            <div onClick={() => onConfirm(model.Name.toLowerCase())} className="bg-neutral-800 h-36 rounded-lg border border-neutral-600 flex items-center justify-center
                            hover:border-lime-600 cursor-pointer duration-200">
                                <img 
                                    src={`https://docs.fivem.net/peds/${model.Name.toLowerCase()}.webp`}
                                    className="max-w-[100px] max-h-[100px]"
                                />
                            </div>
                            <p className="text-sm text-center mt-3">{model.Name.toLowerCase()}</p>
                        </div>
                    ))}
                    {filter.length === 0 && (
                        <p className="text-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{Locale.ui_no_results || 'No results'}</p>
                    )}
                </div>
            </div>
        </Fade>
  );
};

export default PedsModal;