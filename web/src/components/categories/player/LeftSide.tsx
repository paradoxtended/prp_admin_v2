import { useState } from "react";
import type { Player } from "../../../typings/open";
import { setClipboard } from "../../../utils/setClipboard";
import { Locale } from "../../store/locale";
import type { PlayerProps } from "../Player";
import { fetchNui } from "../../../utils/fetchNui";

const LeftSide: React.FC<{
    data: Player;
    player: PlayerProps | null;
    setPlayer: any;
    changeAccountAmount: (type?: 'bank' | 'money', action?: 'add' | 'remove', amount?: number) => void;
    changeJob: (name?: string, grade?: number, remove?: boolean) => void;
    fetchPlayer: (id: number, load?: boolean) => void;
    modals: {
        main: (value: boolean) => void;
        ped: (value: boolean) => void;
    }
}> = ({ data, player, setPlayer, changeAccountAmount, changeJob, fetchPlayer, modals }) => {
    const [imgError, setImgError] = useState(false);

    const changePedModel = (model: string | number | undefined, reset?: boolean, perm?: boolean) => {
        if (reset) {
            fetchNui('reset_model', Number(data.id))

            // Wait for ped to change
            setTimeout(() => fetchPlayer(data.id), 250);

            return
        }

        fetchNui('set_model', {
            target: data.steam,
            model: model,
            perm: perm
        })

        // Wait for ped to change
        setTimeout(() => fetchPlayer(data.id), 250);
    };

    return (
        <div className="w-2/3 flex flex-col gap-3">
            <div className="flex items-center gap-3">
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
            <div className="bg-neutral-900 px-5 py-4 rounded-md border border-neutral-700 text-white text-sm">
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
            <div className="flex items-center gap-3">
                <div className="bg-neutral-900 w-1/2 px-5 py-4 rounded-md border border-neutral-700 text-white flex flex-col gap-3 h-full">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-[15px]">{Locale.ui_stateId || 'State ID'}</p>
                        <button onClick={() => setClipboard(data.stateId.toString())} className="bg-neutral-800 px-3 py-1 rounded-full border text-[13px] 
                                        border-neutral-700 hover:bg-neutral-700 duration-200 hover:border-neutral-500">{Locale.ui_copy || 'Copy'}</button>
                    </div>
                    <p className="text-xl font-bold">{data.stateId}</p>
                </div>
                <div className="bg-neutral-900 w-1/2 px-5 py-4 rounded-md border border-neutral-700 text-white flex flex-col gap-3 h-full">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold text-[15px]">{Locale.ui_current_coords || 'Current Coords'}</p>
                        <button onClick={() => setClipboard(`${player?.coords.x}, ${player?.coords.y}, ${player?.coords.z}`)}
                            className="bg-neutral-800 px-3 py-1 rounded-full border text-[13px] border-neutral-700 hover:bg-neutral-700
                                        duration-200 hover:border-neutral-500">{Locale.ui_copy || 'Copy'}</button>
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
            <div className="flex items-center gap-3">
                <div className="bg-neutral-900 w-1/2 px-5 py-4 rounded-md border border-neutral-700 text-white flex flex-col gap-3">
                    <p className="font-semibold text-[15px]">{Locale.ui_bank_account || 'Bank Account'}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1 text-[13px]">
                            <p className="text-neutral-500">{Locale.ui_money_amount || 'Money Amount'}</p>
                            <p className="font-medium">${player?.account.bank.toLocaleString('en-US')}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <button className="w-1/2 text-[13px] bg-neutral-800 border border-neutral-600 rounded-full py-1.5
                                        hover:bg-neutral-700 hover:border-neutral-500 duration-200"
                            onClick={() => changeAccountAmount('bank', 'add')}>
                            {Locale.ui_add_money || 'Add Money'}
                        </button>
                        <button className="w-1/2 text-[13px] bg-neutral-800 border border-neutral-600 rounded-full py-1.5
                                        hover:bg-neutral-700 hover:border-neutral-500 duration-200"
                            onClick={() => changeAccountAmount('bank', 'remove')}>
                            {Locale.ui_remove_money || 'Remove Money'}
                        </button>
                    </div>
                </div>
                <div className="bg-neutral-900 w-1/2 px-5 py-4 rounded-md border border-neutral-700 text-white flex flex-col gap-3">
                    <p className="font-semibold text-[15px]">{Locale.ui_money || 'Money'}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1 text-[13px]">
                            <p className="text-neutral-500">{Locale.ui_money_amount || 'Money Amount'}</p>
                            <p className="font-medium">${player?.account.cash.toLocaleString('en-US')}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <button className="w-1/2 text-[13px] bg-neutral-800 border border-neutral-600 rounded-full py-1.5
                                        hover:bg-neutral-700 hover:border-neutral-500 duration-200"
                            onClick={() => changeAccountAmount('money', 'add')}>
                            {Locale.ui_add_money || 'Add Money'}
                        </button>
                        <button className="w-1/2 text-[13px] bg-neutral-800 border border-neutral-600 rounded-full py-1.5
                                        hover:bg-neutral-700 hover:border-neutral-500 duration-200"
                            onClick={() => changeAccountAmount('money', 'remove')}>
                            {Locale.ui_remove_money || 'Remove Money'}
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-neutral-900 px-5 py-4 rounded-md border border-neutral-700 text-white flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <p className="font-semibold text-[15px]">{Locale.ui_current_job || 'Current Job'}</p>
                    <button onClick={() => changeJob()} className="text-[13px] bg-neutral-800 border border-neutral-600 rounded-full px-3 py-1.5
                                    hover:bg-neutral-700 hover:border-neutral-500 duration-200">{Locale.ui_change_job || 'Change Job'}</button>
                </div>
                <div className="flex items-center gap-16">
                    <div className="text-sm flex flex-col">
                        <p className="text-neutral-600">{Locale.ui_job_name || 'Job Name'}</p>
                        <p className="font-semibold">{player?.jobs.name}</p>
                    </div>
                    <div className="text-sm flex flex-col">
                        <p className="text-neutral-600">{Locale.ui_job_label || 'Job Label'}</p>
                        <p className="font-semibold">{player?.jobs.label}</p>
                    </div>
                    <div className="text-sm flex flex-col">
                        <p className="text-neutral-600">{Locale.ui_job_grade || 'Job Rank'}</p>
                        <p className="font-semibold">{player?.jobs.grade}</p>
                    </div>
                </div>
                <button onClick={() => changeJob(undefined, undefined, true)} className="w-fit text-[13px] bg-neutral-800 border border-neutral-600 rounded-full px-3 py-1.5
                                hover:bg-neutral-700 hover:border-neutral-500 duration-200">{Locale.ui_remove_job || 'Remove Job'}</button>
            </div>
            <div className="bg-neutral-900 px-5 py-4 rounded-md border border-neutral-700 text-white flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <p className="font-semibold text-[15px]">{Locale.ui_custom_model || 'Custom Model'}</p>
                    <button onClick={() => changePedModel(undefined, true)} className="text-[13px] bg-neutral-800 border border-neutral-600 rounded-full px-3 py-1.5
                                    hover:bg-neutral-700 hover:border-neutral-500 duration-200">{Locale.ui_reset_model || 'Reset Model'}</button>
                </div>
                <div className="flex items-center gap-5">
                    <div className="bg-neutral-800 w-1/4 h-40 rounded-lg border border-neutral-600 flex items-center justify-center">
                        <img
                            src={`https://docs.fivem.net/peds/${player?.ped}.webp`}
                            className="max-w-[130px] max-h-[130px]"
                            onError={() => setImgError(true)}
                            onLoad={() => setImgError(false)}
                            style={{ display: imgError ? "none" : "block" }}
                        />
                    </div>
                    <div className="w-3/4 flex flex-col gap-3">
                        <div className="text-[13px] flex flex-col gap-1">
                            <p className="font-medium">{Locale.ui_ped_model || 'Ped Model'}</p>
                            <input type="text"
                                value={player?.ped}
                                onChange={(e) => setPlayer((prev: any) => ({
                                    ...prev!,
                                    ped: e.target.value
                                }))}
                                placeholder={Locale.ui_ped_model || 'Ped Model'}
                                className="w-full focus:outline-none bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 placeholder:text-neutral-500
                                            focus:border-lime-600"/>
                        </div>
                        <div className="flex items-center w-full gap-3">
                            <button onClick={() => { modals.ped(true); modals.main(true); }} className="text-[13px] bg-neutral-800 border border-neutral-600 rounded-full px-3 py-1.5 w-full
                                            hover:bg-neutral-700 hover:border-neutral-500 duration-200">{Locale.ui_browse_models || 'Browse Models'}</button>
                            <button onClick={() => changePedModel(player?.ped)} className="text-[13px] bg-neutral-800 border border-neutral-600 rounded-full px-3 py-1.5 w-full
                                            hover:bg-neutral-700 hover:border-neutral-500 duration-200">{Locale.ui_set_ped || 'Set Ped'}</button>
                            <button onClick={() => changePedModel(player?.ped, undefined, true)} className="text-[13px] bg-neutral-800 border border-neutral-600 rounded-full px-3 py-1.5 w-full
                                            hover:bg-neutral-700 hover:border-neutral-500 duration-200">{Locale.ui_set_ped_perm || 'Set Ped (perm)'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default LeftSide;