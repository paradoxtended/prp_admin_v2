import { setClipboard } from "../../utils/setClipboard";
import { Locale } from "../store/locale";
import type { BannedPlayer } from "./Players";

const BannedTable: React.FC<{
    data: BannedPlayer[];
    unban: (license: string) => void;
}> = ({ data, unban }) => {
    return (
        <table className="w-full">
            <thead className="text-white text-[13px] text-left border-b border-neutral-700 bg-neutral-900">
                <tr>
                    <th className="px-3 py-2">{Locale.ui_license || 'License'}</th>
                    <th className="px-3 py-2">{Locale.ui_banned_by || 'Banned By'}</th>
                    <th className="px-3 py-2">{Locale.ui_expire || 'Expire'}</th>
                    <th className="px-3 py-2">{Locale.ui_reason || 'Reason'}</th>
                </tr>
            </thead>
            <tbody>
                {data?.map((ply, index) => (
                    <tr key={`player-${index}`} className="border-b border-neutral-700 last:border-none bg-neutral-900 hover:bg-neutral-800 duration-200">
                        <td className="px-3 py-2 text-sm text-white">
                            <div className="flex items-center justify-between">
                                <p className="hover:text-lime-500 w-fit cursor-pointer duration-200"
                                onClick={() => unban(ply.license)}>{ply.license}</p>
                                <i className="fa-regular fa-copy text-neutral-600 cursor-pointer hover:text-neutral-500 duration-200" 
                                onClick={() => setClipboard(ply.license)}></i>
                            </div>
                        </td>
                        <td className="px-3 py-2 text-sm text-white">{ply.bannedBy}</td>
                        <td className="px-3 py-2 text-sm text-white">{ply.expire}</td>
                        <td className="px-3 py-2 text-sm text-white max-w-52 line-clamp-1">{ply.reason}</td>
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

export default BannedTable;