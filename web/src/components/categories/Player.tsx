import { useEffect, useState } from "react";
import type { Player as PlayerData } from "../../typings/open";
import Loading from "../utils/Loading";
import { isEnvBrowser } from "../../utils/misc";
import { fetchNui } from "../../utils/fetchNui";
import { Locale } from "../store/locale";
import AccountModal from "./ui/AccountModal";
import JobModal from "./ui/JobModal";
import PedsModal from "./ui/PedsModal";
import RightSide from "./player/RightSide";
import LeftSide from "./player/LeftSide";
import ItemModal from "./ui/ItemModal";
import NameModal from "./ui/NameModal";
import MessageModal from "./ui/MessageModal";
import KickModal from "./ui/KickModal";
import BanModal from "./ui/BanModal";

export interface PlayerProps {
    banned: boolean;
    identifiers?: { steam?: string, license?: string, discord?: string };
    coords: { x: number, y: number, z: number };
    account: { bank: number, cash: number };
    jobs: { name: string; label: string; grade: string | number };
    ped: number | string;
}

export interface PlayerActionsProps { 
    name: string; 
    label: string; 
    shouldClose?: boolean; // If true, admin menu will close after selecting
    modal?: React.Dispatch<React.SetStateAction<boolean>>; // If defined then defined model will pop up
    color?: string; // HEX value
}

const Player: React.FC<{
    data: PlayerData;
    peds: any;
    handleClose: () => void;
    onNameUpdate?: (name: string) => void;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ data, peds, handleClose, onNameUpdate, setShowModal }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [player, setPlayer] = useState<PlayerProps | null>(null);

    const [accountModal, setAccountModal] = useState<boolean>(false);
    const [account, setAccount] = useState<{ type: string | null, action: string | null }>({ type: null, action: null });

    const [jobModal, setJobModal] = useState<boolean>(false);

    const [pedModal, setPedModal] = useState<boolean>(false);

    const [itemModal, setItemModal] = useState<boolean>(false);
    const [namesModal, setNamesModal] = useState<boolean>(false);
    const [meMessage, setMeMessage] = useState<boolean>(false);
    const [kickModal, setKickModal] = useState<boolean>(false);
    const [banModal, setBanModal] = useState<boolean>(false);

    const playerActions = (): Record<string, PlayerActionsProps[]> => {
        return {
            [Locale.ui_general_settings || 'General settings']: [
                { name: 'spectate', label: Locale.ui_spectate || 'Spectate', shouldClose: true },
                { name: 'screenshot', label: Locale.ui_screenshot || 'Screenshot', shouldClose: true },
                { name: 'revive', label: Locale.ui_revive || 'Revive' },
                { name: 'heal', label: Locale.ui_heal || 'Heal' },
                { name: 'kill', label: Locale.ui_kill || 'Kill' },
                { name: 'reset_bucket', label: Locale.ui_reset_bucket || 'Reset bucket' },
                { name: 'open_inventory', label: Locale.ui_open_inventory || 'Open Inventory', shouldClose: true },
                { name: 'freeze', label: Locale.ui_freeze || 'Freeze' },
                { name: 'mute', label: Locale.ui_mute || 'Mute' },
                { name: 'clothing_menu', label: Locale.ui_clothing_menu || 'Clothing Menu' },
                { name: 'give_item', label: Locale.ui_give_item || 'Give Item', modal: setItemModal },
                { name: 'update_name', label: Locale.ui_update_char_names || 'Update character names', modal: setNamesModal }
            ],
            [Locale.ui_teleports || 'Teleports']: [
                { name: 'teleport_to_player', label: Locale.ui_teleport_to_player || 'Teleport to Player', shouldClose: true },
                { name: 'teleport_to_me', label: Locale.ui_teleport_to_me || 'Teleport Player to Me', shouldClose: true },
                { name: 'teleport_to_car', label: Locale.ui_teleport_to_car || 'Teleport to Player\'s Car', shouldClose: true }
            ],
            [Locale.ui_narrative || 'Narrative']: [
                { name: 'create_me_message', label: Locale.ui_create_me_message || 'Create Me Message', modal: setMeMessage }
            ],
            [Locale.ui_moderation || 'Moderation'] : [
                { name: 'kick', label: Locale.ui_kick || 'Kick', color: '#eab308', modal: setKickModal },
                { name: 'ban', label: Locale.ui_ban || 'Ban', color: '#ef4444', modal: setBanModal },
            ]
        }
    }

    const fetchPlayer = async (id: number, load?: boolean) => {
        if (load) setVisible(false);

        if (isEnvBrowser()) {
            setPlayer({
                banned: false,
                identifiers: {
                    steam: '154848647',
                    license: '4dasda46845165132as1564',
                    discord: '175486616128'
                },
                coords: { x: 841.6, y: 3785.3, z: 458.2 },
                account: { bank: 750, cash: 11548 },
                jobs: { name: 'government', label: 'Government', grade: 3 },
                ped: -509558803
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
        fetchPlayer(data.id, true);
    }, []);

    useEffect(() => {
        if (typeof player?.ped === 'number' && peds.length) {
            const ped = peds.find((model: any) =>
                model.SignedHash === player.ped
            );

            setPlayer((prev) => ({
                ...prev!,
                ped: ped.Name.toLowerCase()
            }))
        }
    }, [player?.ped, peds])

    const changeAccountAmount = (type?: 'bank' | 'money', action?: 'add' | 'remove', amount?: number) => {
        if (amount && amount !== 0) {
            fetchNui('change_account_status', {
                target: data.id,
                type: account.type,
                action: account.action,
                amount: amount
            })

            fetchPlayer(data.id);

            return
        }

        setAccount({ type: type as string, action: action as string });
        setAccountModal(true);
        setShowModal(true);
    };

    const changeJob = (name?: string, grade?: number, remove?: boolean) => {
        if (name && grade !== null || grade !== undefined) {
            fetchNui('change_job', {
                target: data.id,
                name: name,
                grade: grade,
            })

            fetchPlayer(data.id);

            return
        } else if (remove) {
            fetchNui('change_job', {
                target: data.id,
                name: 'unemployed',
                grade: 0,
            })

            fetchPlayer(data.id);

            return
        }

        setJobModal(true);
        setShowModal(true);
    };

    return (
        visible ? (
            <>
                <div className='h-full flex flex-col gap-3 overflow-auto mr-5 pb-1'>
                    <div className="flex text-white items-center justify-between pr-4">
                        <p className="font-bold text-3xl">{data.charName} ({data.id})</p>
                        <div className="flex items-center gap-2">
                            <p className={`text-sm border rounded px-2 py-1
                                ${player ? 'bg-lime-500/20 border-lime-500' : 'bg-red-500/20 border-red-600'}`}>{player ? 'Online' : 'Offline'}
                            </p>
                            <button onClick={async () => fetchPlayer(data.id, true)}
                                className="flex items-center gap-2 text-sm border rounded px-2 py-1 border-neutral-600 bg-neutral-900 hover:bg-neutral-800 duration-200 cursor-pointer">
                                <i className="fa-solid fa-arrows-rotate"></i>
                                {Locale.ui_refresh || 'Refresh'}
                            </button>
                        </div>
                    </div>
                    <div className="w-full flex gap-3">
                        <LeftSide data={data} player={player} setPlayer={setPlayer} changeAccountAmount={changeAccountAmount} changeJob={changeJob} fetchPlayer={fetchPlayer}
                            modals={{
                                main: setShowModal,
                                ped: setPedModal,
                            }} />
                        <RightSide playerActions={playerActions} handleClose={handleClose} data={data} 
                            modals={{
                                main: setShowModal,
                            }} />
                    </div>
                </div>
                <AccountModal
                    data={account}
                    visible={accountModal}
                    onClose={() => {
                        setAccountModal(false);
                        setShowModal(false);
                    }}
                    onConfirm={(amount: number) => {
                        changeAccountAmount(undefined, undefined, amount);
                        setAccountModal(false);
                        setShowModal(false);
                    }}
                />
                <JobModal
                    visible={jobModal}
                    onClose={() => {
                        setJobModal(false);
                        setShowModal(false);
                    }}
                    onConfirm={(data: { name: string, grade: number }) => {
                        changeJob(data.name, data.grade);
                        setJobModal(false);
                        setShowModal(false);
                    }}
                />
                <PedsModal
                    peds={peds}
                    visible={pedModal}
                    onClose={() => {
                        setPedModal(false);
                        setShowModal(false);
                    }}
                    onConfirm={(model: string) => {
                        setPlayer((prev) => ({
                            ...prev!,
                            ped: model
                        }));
                        setPedModal(false);
                        setShowModal(false);
                    }}
                />
                <ItemModal 
                    visible={itemModal}
                    onClose={() => {
                        setItemModal(false);
                        setShowModal(false);
                    }}
                    onConfirm={(item: { name?: string, amount?: number, json?: string, id?: number }) => {
                        setItemModal(false);
                        setShowModal(false);

                        if (!item.name) return;
                        item.id = Number(data.id);

                        fetchNui('give_item', item);
                    }}
                />
                <NameModal 
                    name={data.charName}
                    visible={namesModal}
                    onClose={() => {
                        setNamesModal(false);
                        setShowModal(false);
                    }}
                    onConfirm={(names: { firstname?: string, lastname?: string, id?: number }) => {
                        setNamesModal(false);
                        setShowModal(false);

                        if (!names.firstname || !names.lastname || names.firstname === '' || names.lastname === '') {
                            return
                        }

                        names.id = data.id
                        
                        fetchNui('update_character_names', names);
                        onNameUpdate?.(`${names.firstname.charAt(0).toUpperCase() + names.firstname.slice(1)} ${names.lastname.charAt(0).toUpperCase() + names.lastname.slice(1)}`);
                        fetchPlayer(data.id);

                        // Close admin menu so new name will be updated everywhere
                        handleClose();
                    }}
                />
                <MessageModal
                    visible={meMessage}
                    onClose={() => {
                        setMeMessage(false);
                        setShowModal(false);
                    }}
                    onConfirm={(message: string) => {
                        setMeMessage(false);
                        setShowModal(false);
                        
                        if (!message || message === '') {
                            return
                        }

                        fetchNui('create_me_message', {
                            message: message,
                            id: data.id
                        })
                    }}
                />
                <KickModal
                    visible={kickModal}
                    onClose={() => {
                        setShowModal(false);
                        setKickModal(false);
                    }}
                    onConfirm={(message: string) => {
                        setKickModal(false);
                        setShowModal(false);
                        
                        if (!message || message === '') {
                            return
                        }

                        fetchNui('kick', {
                            message: message,
                            id: data.id
                        })
                    }}
                />
                <BanModal 
                    visible={banModal}
                    onClose={() => {
                        setShowModal(false);
                        setBanModal(false);
                    }}
                    onConfirm={(message: string) => {
                        setBanModal(false);
                        setShowModal(false);
                        
                        if (!message || message === '') {
                            return
                        }

                        fetchNui('ban', {
                            message: message,
                            id: data.id
                        })
                    }}
                />
            </>
        ) : <Loading />
    )
};

export default Player;