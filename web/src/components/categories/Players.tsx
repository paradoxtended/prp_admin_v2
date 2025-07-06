import { useEffect, useState } from "react";
import Loading from "../utils/Loading";
import type { OpenData, Player as PlayerData } from "../../typings/open";
import { Locale } from "../store/locale";
import PlayersTable from "./PlayersTable";
import Player from "./Player";
import BannedTable from "./BannedTable";
import { isEnvBrowser } from "../../utils/misc";
import { fetchNui } from "../../utils/fetchNui";

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

type SortField = 'charName' | 'id' | 'steam' | 'accName';

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
        { name: 'online_players', label: Locale.ui_online_players || 'Online Players', active: true },
        { name: 'banned_players', label: Locale.ui_banned_players || 'Banned Players' }
    ]);
    const currentTab = tabs.find(c => c.active)?.name || 'online_players';
    const [filter, setFilter] = useState(data?.players.players || []);
    const [filteredBanned, setFilteredBanned] = useState<BannedPlayer[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<SortField>('charName');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [bannedPlayers, setBannedPlayers] = useState<BannedPlayer[] | null>(null);

    const fetchBannedPlayers = async () => {
        setVisible(false);

        if (isEnvBrowser()) {
            setBannedPlayers([
                { license: '8864564asd84as21d564sda', bannedBy: 'Ravage', expire: '2025-07-06 11:54:28', reason: 'VDM bad boy!' },
                { license: '1264564das9das51d65as4d', bannedBy: 'Patress', expire: '2025-07-06 11:54:28', reason: 'RDM' },
                { license: '18a4sd56as1d0as26d165as', bannedBy: 'mrs.sarahh', expire: '2025-07-06 11:54:28', reason: 'disrespectful to admin' },
                { license: '4da8sd4as2d61a651d81a56', bannedBy: 'timot', expire: 'PERMANENT', reason: 'cheating' },
                { license: '123as4d54as9d8as1d23as4', bannedBy: 'Ravage', expire: '2025-07-06 11:54:28', reason: 'exploiting scripts' }
            ]);
        
            setTimeout(() => setVisible(true), 500);
            return
        }
        
        try {
            const response: BannedPlayer[] = await fetchNui('getBannedPlayers');
            if (!response) return;
                
            setBannedPlayers(response);
            setTimeout(() => setVisible(true), 500);
        } catch (err) {
            console.error("Failed to fetch banned players", err);
        }
    };

    useEffect(() => {
        if (currentTab === 'banned_players') {
            fetchBannedPlayers();
        }
    }, [currentTab]);
    
    useEffect(() => {
        setTimeout(() => setVisible(true), 500);
    }, []);

    useEffect(() => {
        if (currentTab === 'online_players') {
            const filtered = data?.players.players.filter(player => 
                player.charName.toLowerCase().includes(query.toLowerCase()) ||
                player.accName.toLowerCase().includes(query.toLowerCase()) ||
                player.id.toString().includes(query.toLowerCase()) ||
                player.steam.toString().includes(query.toLowerCase())
            ) || [];

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
        } else {
            const filtered = bannedPlayers?.filter(player => 
                player.license.toLowerCase().includes(query.toLowerCase()) ||
                player.bannedBy.toLowerCase().includes(query.toLowerCase()) ||
                player.reason.toLowerCase().includes(query.toLowerCase()) ||
                player.expire.toLowerCase().includes(query.toLowerCase())
            ) || [];

            setFilteredBanned(filtered);
            setCurrentPage(1);
        }
    }, [query, data, sortBy, sortDirection, currentTab, bannedPlayers]);

    const totalPages = currentTab === 'online_players'
    ? Math.ceil(filter.length / PLAYERS_PER_PAGE)
    : Math.ceil(filteredBanned.length / PLAYERS_PER_PAGE);

    const paginatedData = currentTab === 'online_players' 
    ? filter.slice((currentPage - 1) * PLAYERS_PER_PAGE, currentPage * PLAYERS_PER_PAGE)
    : filteredBanned.slice((currentPage - 1) * PLAYERS_PER_PAGE, currentPage * PLAYERS_PER_PAGE);

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
                    focus:border-lime-600"/>
                    <i className="fa-solid fa-magnifying-glass absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none scale-90"></i>
                </div>

                {currentTab === 'online_players' && (
                    <PlayersTable
                        data={paginatedData as PlayerData[]}
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
                        setPlayer={(data: PlayerData) => setPlayer(data)}
                    />
                )}

                {currentTab === 'banned_players' && (
                    <BannedTable 
                        data={paginatedData as BannedPlayer[]}
                        unban={(license: string) => {
                            fetchNui('unban', license);
                            fetchBannedPlayers();
                        }}
                    />
                )}
                
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