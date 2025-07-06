import type { Player } from "../../typings/open";
import { setClipboard } from "../../utils/setClipboard";
import { Locale } from "../store/locale";

type SortField = 'charName' | 'stateId' | 'steam' | 'accName';

const PlayersTable: React.FC<{
    data: Player[];
    sortBy: string;
    sortDirection: string;
    onSort: (field: SortField) => void;
    setPlayer: (data: Player) => void;
}> = ({ data, sortBy, sortDirection, onSort, setPlayer }) => {
    const renderSortIcon = (field: SortField) => {
        if (sortBy !== field)
            return <i className="fa-solid fa-arrow-up-short-wide cursor-pointer text-neutral-600 duration-200 hover:text-neutral-500" 
                    onClick={() => onSort(field)} />; 

        return (
            <i className={`fa-solid ${sortDirection === 'asc' ? 'fa-arrow-down-short-wide' : 'fa-arrow-up-short-wide'} cursor-pointer text-neutral-600 duration-200 hover:text-neutral-500`}
            onClick={() => onSort(field)} />
        );
    };

    return (
        <table className="w-full">
            <thead className="text-white text-[13px] text-left border-b border-neutral-700 bg-neutral-900">
                <tr>
                    <th className="px-3 py-2">
                        <div className="flex items-center gap-5">
                            <p>{Locale.ui_charName || 'Character Name'}</p>
                            {renderSortIcon('charName')}
                        </div>
                    </th>
                    <th className="px-3 py-2">
                        <div className="flex items-center gap-5">
                            <p>{Locale.ui_stateId || 'State ID'}</p>
                            {renderSortIcon('stateId')}
                        </div>
                    </th>
                    <th className="px-3 py-2">{Locale.ui_steam || 'Steam'}</th>
                    <th className="px-3 py-2">
                        <div className="flex items-center gap-5">
                            <p>{Locale.ui_accName || 'Account Name'}</p>
                            {renderSortIcon('accName')}
                        </div>
                    </th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {data?.map((ply, index) => (
                    <tr key={`player-${index}`} className="border-b border-neutral-700 last:border-none bg-neutral-900 hover:bg-neutral-800 duration-200">
                        <td className="px-3 py-2 text-sm text-white">
                            <div className="flex items-center justify-between">
                                <p className="hover:text-lime-500 duration-200 cursor-pointer"
                                onClick={() => setPlayer(ply)}
                                >
                                    {ply.charName}
                                </p>
                                <i className="fa-regular fa-copy text-neutral-600 cursor-pointer hover:text-neutral-500 duration-200"
                                onClick={() => setClipboard(ply.charName)}></i>
                            </div>
                        </td>
                        <td className="px-3 py-2 text-sm text-white">
                            <div className="flex items-center justify-between">
                                <p>{ply.stateId}</p>
                                <i className="fa-regular fa-copy text-neutral-600 cursor-pointer hover:text-neutral-500 duration-200"
                                onClick={() => setClipboard(ply.stateId.toString())}></i>
                            </div>
                        </td>
                        <td className="px-3 py-2 text-sm text-white">
                            <div className="flex items-center justify-between">
                                <p>{ply.steam.includes(':') ? ply.steam.split(':')[1] : ply.steam}</p>
                                <i className="fa-regular fa-copy text-neutral-600 cursor-pointer hover:text-neutral-500 duration-200"
                                onClick={() => setClipboard(ply.steam.toString())}></i>
                            </div>
                        </td>
                        <td className="px-3 py-2 text-sm text-white">
                            <div className="flex items-center justify-between">
                                <p>{ply.accName}</p>
                                <i className="fa-regular fa-copy text-neutral-600 cursor-pointer hover:text-neutral-500 duration-200"
                                onClick={() => setClipboard(ply.accName)}></i>
                            </div>
                        </td>
                        <td className="text-center">
                            <i className="fa-solid fa-ellipsis-vertical text-neutral-600 cursor-pointer hover:text-neutral-500 duration-200
                            px-2.5 py-1 hover:bg-lime-500/20 rounded"></i>
                        </td>
                    </tr>
                ))}
                {data.length < 1 && (
                    <tr className="bg-neutral-900">
                        <td colSpan={5} className="px-3 py-3 text-sm text-white text-center">{Locale.ui_no_results || 'No results'}</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
};

export default PlayersTable;