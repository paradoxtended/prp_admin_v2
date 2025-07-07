import { useEffect, useState } from "react";
import Loading from "../utils/Loading";
import type { OpenData, Player as PlayerData } from "../../typings/open";
import { Locale } from "../store/locale";
import PlayersTable from "./PlayersTable";
import Player from "./Player";

interface TabProps {
    label: string;
    name: string;
    active?: boolean;
}

export interface BannedPlayer {
    license: string;
    bannedBy: string;
    expire: string;
    reason: string;
}

type SortField = 'charName' | 'stateId' | 'steam' | 'accName';

const PLAYERS_PER_PAGE = 10;

const Players: React.FC<{
    data: OpenData;
    player: PlayerData | null;
    setPlayer: (player: PlayerData | null) => void;
    peds: any;
    handleClose: () => void;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ data, player, setPlayer, peds, handleClose, setShowModal }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [query, setQuery] = useState('');
    const [tabs, setTabs] = useState<TabProps[]>([
        { name: 'all_players', label: Locale.ui_banned_players || 'All Players', active: true },
        { name: 'online_players', label: Locale.ui_online_players || 'Online Players' }
    ]);
    const currentTab = tabs.find(c => c.active)?.name || 'all_players';
    const [filter, setFilter] = useState(data?.players.players || []);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<SortField>('charName');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    
    useEffect(() => {
        setTimeout(() => setVisible(true), 500);
    }, []);

    useEffect(() => {
        const filtered = currentTab === 'online_players' ?
            data?.players.players.filter(player => 
                player.online && (
                player.charName.toLowerCase().includes(query.toLowerCase()) ||
                player.accName.toLowerCase().includes(query.toLowerCase()) ||
                player.id.toString().includes(query.toLowerCase()) ||
                player.steam.toString().includes(query.toLowerCase())
            )
        ) : (
            data.players.players.filter(player => 
                player.charName.toLowerCase().includes(query.toLowerCase()) ||
                player.accName.toLowerCase().includes(query.toLowerCase()) ||
                player.id.toString().includes(query.toLowerCase()) ||
                player.steam.toString().includes(query.toLowerCase())
            )
        );

        const sorted = [...filtered].sort((a, b) => {
            const valA = a[sortBy];
            const valB = b[sortBy];
            if (typeof valA === 'string' && typeof valB === 'string') {
                return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            } else {
                return sortDirection === 'asc' ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
            }
        });

        setFilter(sorted);
        setCurrentPage(1);
    }, [query, data, sortBy, sortDirection, currentTab]);

    const totalPages = Math.ceil(filter.length / PLAYERS_PER_PAGE)

    const paginatedData = filter.slice((currentPage - 1) * PLAYERS_PER_PAGE, currentPage * PLAYERS_PER_PAGE)

     const goToPrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const goToNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        visible && !player ? (
            <div className="h-full pr-10">
                <div className="text-white text-sm bg-neutral-900 w-fit flex justify-center mx-auto px-5 py-1.5 rounded-full">
                    {tabs.map((tab, index) => (
                        <p key={`tab-${index}`}
                        className={`cursor-pointer font-medium px-20 py-1 border rounded ${tab.active ? 'border-lime-600 bg-lime-500/20' : 'border-neutral-900'}`}
                        onClick={() => setTabs(prev => prev.map(prevTab => ({ ...prevTab, active: prevTab.name === tab.name })))}>{tab.label}</p>
                    ))}
                </div>
                <div className="my-5 text-neutral-300 relative">
                    <input type="text"
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={Locale.ui_search || 'Search...'}
                    className="bg-neutral-900 border border-neutral-700 focus:outline-none rounded text-[13px] px-3 py-1.5 w-full placeholder:text-neutral-300
                    focus:outline focus:outline-lime-600 focus:outline-1"/>
                    <i className="fa-solid fa-magnifying-glass absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none scale-90"></i>
                </div>

                
                <PlayersTable
                    data={paginatedData}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    onSort={(field) => {
                        if (sortBy === field) {
                            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                        } else {
                            setSortBy(field);
                            setSortDirection('asc');
                        }
                    }}
                    handleClose={handleClose}
                    setShowModal={setShowModal}
                    setPlayer={(data: PlayerData) => setPlayer(data)}
                />
                
                <div className="text-white text-[13px] flex items-center justify-end mt-5 gap-1">
                    <button onClick={() => goToPrevious()} 
                    className={`bg-neutral-900 px-2 py-1 rounded border border-neutral-700 ${currentPage <= 1 && 'opacity-50 pointer-events-none'}
                    hover:bg-lime-500/20 hover:border-lime-600 duration-200`}
                    >
                        {Locale.ui_previous || 'Previous'}
                    </button>
                    <button onClick={() => goToNext()} 
                    className={`bg-neutral-900 px-2 py-1 rounded border border-neutral-700 ${(currentPage === totalPages || paginatedData.length < 1) && 'opacity-50 pointer-events-none'}
                    hover:bg-lime-500/20 hover:border-lime-600 duration-200`}
                    >
                        {Locale.ui_next || 'Next'}
                    </button>
                </div>
            </div>
        ) : player ? (
            <Player currentPlayer={setPlayer} data={player} peds={peds} handleClose={handleClose} onNameUpdate={(name: string) => setPlayer({ ...player, charName: name })} setShowModal={setShowModal} />
        ) : <Loading />
    )
};

export default Players;