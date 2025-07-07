import { useEffect, useState } from "react";
import Loader from "../utils/Loading";
import { Locale } from "../store/locale";
import { fetchNui } from "../../utils/fetchNui";
import type { ActionsProps } from "../../typings/open";

const Developer: React.FC<{
    actions: ActionsProps;
}> = ({ actions }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [action, setAction] = useState<ActionsProps>({
        noclip: actions?.noclip,
        vanish: actions?.vanish
    })

    useEffect(() => {
        setTimeout(() => setVisible(true), 500);
    }, []);

    return (
        visible ? (
            <div className="flex flex-col gap-5 mr-5 pr-5">
                <p className="text-[26px] text-white font-bold">{Locale.ui_developer_center || 'Developer Center'}</p>
                <div className="flex items-center text-white text-[13px] gap-5">
                    <button className="bg-neutral-900 w-full py-1.5 border border-neutral-700 rounded-full
                    hover:bg-neutral-800 hover:border-neutral-600 duration-200"
                    onClick={() => fetchNui('heal', -1)}>{Locale.ui_heal_everyone || 'Heal Everyone'}</button>
                    <button className="bg-neutral-900 w-full py-1.5 border border-neutral-700 rounded-full
                    hover:bg-neutral-800 hover:border-neutral-600 duration-200"
                    onClick={() => fetchNui('revive', -1)}>{Locale.ui_revive_everyone || 'Revive Everyone'}</button>
                </div>
                <div className="text-white text-sm">
                    <div className="flex items-center gap-5 w-full">
                        <label className="flex items-center justify-between bg-neutral-900 px-5 py-5 rounded border border-neutral-700 cursor-pointer w-full">
                            <p>{Locale.ui_noclip || 'Noclip'}</p>
                            
                            <div className="relative inline-flex items-center">
                                <input type="checkbox" className="sr-only peer" checked={action.noclip}
                                onChange={() => {
                                    fetchNui('noclip');
                                    setAction(prev => ({
                                        ...prev,
                                        noclip: !prev.noclip,
                                    }));
                                }}/>
                                <div className="w-10 h-5 bg-neutral-600 rounded-full peer peer-checked:bg-lime-600 transition-all duration-300"></div>
                                <div className="absolute top-0.5 left-0.5 bg-neutral-900 w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                            </div>
                        </label>
                        <label className="flex items-center justify-between bg-neutral-900 px-5 py-5 rounded border border-neutral-700 cursor-pointer w-full">
                            <p>{Locale.ui_vanish || 'Vanish'}</p>
                            
                            <div className="relative inline-flex items-center">
                                <input type="checkbox" className="sr-only peer" checked={action.vanish} 
                                onChange={() => {
                                    fetchNui('vanish');
                                    setAction(prev => ({
                                        ...prev,
                                        vanish: !prev.vanish,
                                    }));
                                }}/>
                                <div className="w-10 h-5 bg-neutral-600 rounded-full peer peer-checked:bg-lime-600 transition-all duration-300"></div>
                                <div className="absolute top-0.5 left-0.5 bg-neutral-900 w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        ) : <Loader />
    )
};

export default Developer;