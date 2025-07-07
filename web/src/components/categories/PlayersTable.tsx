import { useEffect, useRef, useState } from "react";
import type { Player } from "../../typings/open";
import { setClipboard } from "../../utils/setClipboard";
import { Locale } from "../store/locale";
import { fetchNui } from "../../utils/fetchNui";
import BanModal from "./ui/BanModal";
import KickModal from "./ui/KickModal";

type SortField = 'charName' | 'stateId' | 'steam' | 'accName';

const PlayersTable: React.FC<{
    data: Player[];
    sortBy: string;
    sortDirection: string;
    onSort: (field: SortField) => void;
    handleClose: () => void;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    setPlayer: (data: Player) => void;
}> = ({ data, sortBy, sortDirection, onSort, handleClose, setShowModal, setPlayer }) => {
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
    const [modal, setModal] = useState<'ban' | 'kick' | undefined>();
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const renderSortIcon = (field: SortField) => {
        if (sortBy !== field)
            return <i className="fa-solid fa-arrow-up-short-wide cursor-pointer text-neutral-600 duration-200 hover:text-neutral-500" 
                    onClick={() => onSort(field)} />; 

        return (
            <i className={`fa-solid ${sortDirection === 'asc' ? 'fa-arrow-down-short-wide' : 'fa-arrow-up-short-wide'} cursor-pointer text-neutral-600 duration-200 hover:text-neutral-500`}
            onClick={() => onSort(field)} />
        );
    };

    const toggleDropdown = (index: number) => {
        setOpenDropdownIndex(prev => prev === index ? null : index);
        setCurrentPlayer(data[index]);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdownIndex(null);
                setCurrentPlayer(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
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
                            <td className="relative text-center">
                                <i className="fa-solid fa-ellipsis-vertical text-neutral-600 cursor-pointer hover:text-neutral-500 duration-200
                                px-2.5 py-1 hover:bg-lime-500/20 rounded"
                                onClick={() => toggleDropdown(index)}></i>

                                {openDropdownIndex === index && (
                                    <div className="absolute top-[90%] z-10 left-1/2 -translate-x-1/2 bg-neutral-900 border border-neutral-700 rounded min-w-36 text-white p-1
                                    flex flex-col gap-1 text-[13px]"
                                    ref={dropdownRef}>
                                        <button className="flex items-center gap-3 px-3 py-1 rounded w-full
                                        hover:bg-lime-500/20 duration-200"
                                        onClick={() => setPlayer(ply)}>
                                            <i className="fa-regular fa-user"></i>
                                            <p>{Locale.ui_details || 'Details'}</p>
                                        </button>
                                        <button className="flex items-center gap-3 px-3 py-1 rounded w-full
                                        hover:bg-lime-500/20 duration-200"
                                        onClick={() => {
                                            handleClose();
                                            fetchNui('spectate', ply.id);
                                        }}>
                                            <i className="fa-regular fa-eye"></i>
                                            <p>{Locale.ui_spectate || 'Spectate'}</p>
                                        </button>
                                        <button className="flex items-center gap-3 px-3 py-1 rounded w-full
                                        hover:bg-lime-500/20 duration-200"
                                        onClick={() => {
                                            handleClose();
                                            fetchNui('screenshot', ply.id)
                                        }}>
                                            <i className="fa-solid fa-tv"></i>
                                            <p>{Locale.ui_screenshot || 'Screenshot'}</p>
                                        </button>
                                        <button className="flex items-center gap-3 px-3 py-1 rounded w-full
                                        hover:bg-lime-500/20 duration-200"
                                        onClick={() => {
                                            setShowModal(true);
                                            setModal('ban');
                                            toggleDropdown(index);
                                        }}>
                                            <i className="fa-solid fa-gavel"></i>
                                            <p>{Locale.ui_ban_player || 'Ban Player'}</p>
                                        </button>
                                        <button className="flex items-center gap-3 px-3 py-1 rounded w-full
                                        hover:bg-lime-500/20 duration-200"
                                        onClick={() => {
                                            setShowModal(true);
                                            setModal('kick');
                                            toggleDropdown(index);
                                        }}>
                                            <i className="fa-regular fa-circle-xmark"></i>
                                            <p>{Locale.ui_kick_player || 'Kick Player'}</p>
                                        </button>
                                    </div>
                                )}
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
            <BanModal 
                visible={modal === 'ban'}
                onClose={() => {
                    setShowModal(false);
                    setModal(undefined);
                    setCurrentPlayer(null);
                }}
                onConfirm={(ban: { message?: string; duration?: number, type?: string, id?: number | undefined | string }) => {
                    setModal(undefined);
                        
                    if (!ban.type || ban.type === '') {
                        return
                    }

                    if (!ban.message || ban.message === '') {
                        ban.message = Locale.ui_no_reason_provided || 'No reason provided.'
                    }

                    ban.id = currentPlayer?.steam;

                    fetchNui('ban', ban);

                    setCurrentPlayer(null);
                    handleClose();
                }}
            />
            <KickModal
                visible={modal === 'kick'}
                onClose={() => {
                    setShowModal(false);
                    setModal(undefined);
                    setCurrentPlayer(null);
                }}
                onConfirm={(message: string) => {
                    setModal(undefined);
                    setShowModal(false);
                        
                    if (!message || message === '') {
                        return
                    }

                    fetchNui('kick', {
                        message: message,
                        id: currentPlayer?.steam
                    });

                    setCurrentPlayer(null);
                    handleClose();
                }}
            />
        </>
    )
};

export default PlayersTable;