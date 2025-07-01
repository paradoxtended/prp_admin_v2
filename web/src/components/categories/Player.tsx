import { useEffect, useState } from "react";
import type { Player as PlayerData } from "../../typings/open";
import Loading from "../utils/Loading";
import { isEnvBrowser } from "../../utils/misc";
import { fetchNui } from "../../utils/fetchNui";
import { Locale } from "../store/locale";
import { setClipboard } from "../../utils/setClipboard";

interface PlayerProps {
    banned: boolean;
    identifiers?: { steam?: string, license?: string, discord?: string };
    coords: { x: number, y: number, z: number };
}

const Player: React.FC<{
    data: PlayerData;
}> = ({ data }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [player, setPlayer] = useState<PlayerProps | null>(null);

    const fetchPlayer = async (id: number) => {
        setVisible(false);

        if (isEnvBrowser()) {
            setPlayer({
                banned: false,
                identifiers: {
                    steam: '154848647',
                    license: '4dasda46845165132as1564',
                    discord: '175486616128'
                },
                coords: { x: 841.6, y: 3785.3, z: 458.2 }
            });

            setTimeout(() => setVisible(true), 500);
            return
        }

        try {
            const response: PlayerProps = await fetchNui('getPlayerData', id);
            if (!response) return;

            setPlayer(response);
            setTimeout(() => setVisible(true), 500);
        } catch (err) {
            console.error("Failed to fetch player data", err);
        }
    };

    useEffect(() => {
        fetchPlayer(data.id);
    }, []);

    return (
        visible ? (
            <div className="h-full flex flex-col gap-3">
                <div className="flex text-white items-center justify-between">
                    <p className="font-bold text-2xl">{data.charName} ({data.id})</p>
                    <div className="flex items-center gap-2">
                        <p className={`text-sm border rounded px-2 py-1
                            ${player ? 'bg-lime-500/20 border-lime-500' : 'bg-red-500/20 border-red-600'}`}>{player ? 'Online' : 'Offline'}
                        </p>
                        <button onClick={async () => fetchPlayer(data.id)} 
                        className="flex items-center gap-2 text-sm border rounded px-2 py-1 border-neutral-600 bg-neutral-900 hover:bg-neutral-800 duration-200 cursor-pointer">
                            <i className="fa-solid fa-arrows-rotate"></i>
                            {Locale.ui_refresh || 'Refresh'}
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-2/3">
                    <div className="text-white bg-neutral-900 w-full px-3 py-4 rounded-md border border-neutral-700 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-[15px]">{Locale.ui_accName || 'Account Name'}</p>
                            <i className="fa-regular fa-copy text-neutral-400 bg-neutral-800 w-8 h-8 flex items-center justify-center rounded-full
                            border border-neutral-600 hover:bg-neutral-700 duration-200 cursor-pointer hover:border-neutral-500"
                            onClick={() => setClipboard(data.accName)}></i>
                        </div>
                        <p className="font-bold text-lg max-w-40 overflow-hidden">{data.accName}</p>
                    </div>
                    <div className="text-white bg-neutral-900 w-full px-3 py-4 rounded-md border border-neutral-700 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-[15px]">{Locale.ui_steam || 'Steam'}</p>
                            <i className="fa-regular fa-copy text-neutral-400 bg-neutral-800 w-8 h-8 flex items-center justify-center rounded-full
                            border border-neutral-600 hover:bg-neutral-700 duration-200 cursor-pointer hover:border-neutral-500"
                            onClick={() => setClipboard(player?.identifiers?.steam || player?.identifiers?.license || '')}></i>
                        </div>
                        <p className="font-bold text-lg max-w-40 overflow-hidden">{player?.identifiers?.steam || player?.identifiers?.license}</p>
                    </div>
                    <div className="text-white bg-neutral-900 w-full h-full px-3 py-4 rounded-md border border-neutral-700 flex flex-col gap-3">
                        <p className="font-medium text-[15px]">{Locale.ui_currently_banned || 'Currently Banned'}</p>
                        <p className="font-bold text-lg max-w-40 overflow-hidden">{player?.banned ? Locale.ui_yes || 'Yes' : Locale.ui_no || 'No'}</p>
                    </div>
                </div>
                <div className="bg-neutral-900 w-2/3 px-5 py-4 rounded-md border border-neutral-700 text-white text-sm">
                    <p className="font-semibold">{Locale.ui_identifiers || 'Identifiers'}</p>
                    <div className="mt-5 text-[13px]">
                        {player?.identifiers?.steam && (
                            <div className="flex items-center justify-between mt-4">
                                <p>{Locale.ui_steam || 'Steam'}</p>
                                <div className="flex items-center gap-2 text-neutral-600">
                                    <p>{player.identifiers.steam}</p>
                                    <i className="fa-regular fa-copy cursor-pointer duration-200 hover:text-neutral-500"
                                    onClick={() => setClipboard(player?.identifiers?.steam || '')}></i>
                                </div>
                            </div>
                        )}
                        {player?.identifiers?.license && (
                            <div className="flex items-center justify-between mt-4">
                                <p>{Locale.ui_license || 'License'}</p>
                                <div className="flex items-center gap-2 text-neutral-600">
                                    <p>{player.identifiers.license}</p>
                                    <i className="fa-regular fa-copy cursor-pointer duration-200 hover:text-neutral-500"
                                    onClick={() => setClipboard(player?.identifiers?.license || '')}></i>
                                </div>
                            </div>
                        )}
                        {player?.identifiers?.discord && (
                            <div className="flex items-center justify-between mt-4">
                                <p>{Locale.ui_discord || 'Discord'}</p>
                                <div className="flex items-center gap-2 text-neutral-600">
                                    <p>{player.identifiers.discord}</p>
                                    <i className="fa-regular fa-copy cursor-pointer duration-200 hover:text-neutral-500"
                                    onClick={() => setClipboard(player?.identifiers?.discord || '')}></i>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-2/3 flex items-center gap-3">
                    <div className="bg-neutral-900 w-1/2 px-5 py-4 rounded-md border border-neutral-700 text-white flex flex-col gap-3 h-full">
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">{Locale.ui_stateId || 'State ID'}</p>
                            <button onClick={() => setClipboard(data.id.toString())} className="bg-neutral-800 px-3 py-1 rounded-full border text-sm border-neutral-700 hover:bg-neutral-700
                            duration-200 hover:border-neutral-500">{Locale.ui_copy|| 'Copy'}</button>
                        </div>
                        <p className="text-xl font-bold">{data.id}</p>
                    </div>
                    <div className="bg-neutral-900 w-1/2 px-5 py-4 rounded-md border border-neutral-700 text-white flex flex-col gap-3 h-full">
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">{Locale.ui_current_coords || 'Current Coords'}</p>
                            <button onClick={() => setClipboard(`${player?.coords.x}, ${player?.coords.y}, ${player?.coords.z}`)} 
                            className="bg-neutral-800 px-3 py-1 rounded-full border text-sm border-neutral-700 hover:bg-neutral-700
                            duration-200 hover:border-neutral-500">{Locale.ui_copy|| 'Copy'}</button>
                        </div>
                        <div className="text-sm flex items-center gap-2">
                            <div className="flex items-center bg-neutral-800 w-fit px-2.5 gap-2 py-1 rounded-md border border-neutral-700">
                                <p className="text-neutral-600">X</p>
                                <p>{player?.coords.x.toFixed(1)}</p>
                            </div>
                            <div className="flex items-center bg-neutral-800 w-fit px-2.5 gap-2 py-1 rounded-md border border-neutral-700">
                                <p className="text-neutral-600">Y</p>
                                <p>{player?.coords.y.toFixed(1)}</p>
                            </div>
                            <div className="flex items-center bg-neutral-800 w-fit px-2.5 gap-2 py-1 rounded-md border border-neutral-700">
                                <p className="text-neutral-600">Z</p>
                                <p>{player?.coords.z.toFixed(1)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : <Loading />
    )
};

export default Player;