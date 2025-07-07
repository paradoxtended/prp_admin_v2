import { useEffect, useState } from "react";
import { Locale } from "../../store/locale";
import Fade from "../../utils/transitions/Fade";

const BanModal: React.FC<{
    visible: boolean;
    onClose: () => void;
    onConfirm: (data: { message?: string; duration?: number, type?: string }) => void;
}> = ({ visible, onClose, onConfirm }) => {
    const [data, setData] = useState<{ message?: string; duration?: number, type?: string }>({
        message: '',
        duration: undefined,
        type: 'minutes'
    });

    useEffect(() => setData({
        message: '',
        duration: undefined,
        type: 'minutes'
    }), [visible])

    return (
        <Fade in={visible}>
            <div>
                <div className="fixed inset-0 bg-black bg-opacity-70 z-20 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto opacity-100 z-50">
                    <div className="bg-neutral-900 w-96 text-white flex flex-col p-4 gap-5 rounded border border-neutral-700 relative">
                        <i className="fa-solid fa-xmark absolute top-3 right-3 scale-90 text-neutral-600 cursor-pointer"
                        onClick={onClose}></i>
                        <p className="font-semibold">{Locale.ui_ban || 'Ban'}</p>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-2 text-white">
                                <p className="text-white text-[13px] font-medium">{Locale.ui_message || 'Message'}</p>
                                <input type="text"
                                    defaultValue={data.message}
                                    onChange={(e) => setData((prev) => ({...prev, message: e.target.value }))}
                                    placeholder={Locale.ui_ban_reason || 'Reason for banning'}
                                    className="bg-neutral-800 rounded border border-neutral-700 px-3 py-1.5 w-full text-[13px]
                                    placeholder:text-neutral-500 focus:outline outline-1 outline-offset-2 outline-lime-600"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-white">
                                <p className="text-white text-[13px] font-medium">{Locale.ui_duration || 'Duration'}</p>
                                <input type="number"
                                    defaultValue={data.duration}
                                    onChange={(e) => setData((prev) => ({...prev, duration: Number(e.target.value) }))}
                                    placeholder={Locale.ui_duration || 'Duration'}
                                    className="bg-neutral-800 rounded border border-neutral-700 px-3 py-1.5 w-full text-[13px]
                                    placeholder:text-neutral-500 focus:outline outline-1 outline-offset-2 outline-lime-600"
                                />
                            </div>
                            <div className="flex flex-col gap-2 text-white">
                                <p className="text-white text-[13px] font-medium">{Locale.ui_duration_type || 'Duration type'}</p>
                                <div className="flex items-center text-[13px] gap-2">
                                    <p className={`rounded-full py-1 w-full text-center border cursor-pointer
                                        hover:bg-lime-500/10 hover:border-lime-600 duration-200
                                        ${data.type === 'minutes' ? 'bg-lime-500/10 border-lime-600' : 'bg-neutral-800 border-neutral-700'}`}
                                        onClick={() => setData((prev) => ({...prev, type: 'minutes' }))}>{Locale.ui_minutes || 'Minutes'}</p>
                                    <p className={`rounded-full py-1 w-full text-center border cursor-pointer
                                        hover:bg-lime-500/10 hover:border-lime-600 duration-200
                                        ${data.type === 'hours' ? 'bg-lime-500/10 border-lime-600' : 'bg-neutral-800 border-neutral-700'}`}
                                        onClick={() => setData((prev) => ({...prev, type: 'hours' }))}>{Locale.ui_hours || 'Hours'}</p>
                                    <p className={`rounded-full py-1 w-full text-center border cursor-pointer
                                        hover:bg-lime-500/10 hover:border-lime-600 duration-200
                                        ${data.type === 'days' ? 'bg-lime-500/10 border-lime-600' : 'bg-neutral-800 border-neutral-700'}`}
                                        onClick={() => setData((prev) => ({...prev, type: 'days' }))}>{Locale.ui_days || 'Days'}</p>
                                    <p className={`rounded-full py-1 w-full text-center border cursor-pointer
                                        hover:bg-lime-500/10 hover:border-lime-600 duration-200
                                        ${data.type === 'perm' ? 'bg-lime-500/10 border-lime-600' : 'bg-neutral-800 border-neutral-700'}`}
                                        onClick={() => setData((prev) => ({...prev, type: 'perm' }))}>{Locale.ui_perm || 'Perm'}</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => onConfirm(data)} className="text-sm bg-neutral-800 border border-neutral-600 rounded-full w-full py-1.5
                        hover:bg-neutral-700 hover:border-neutral-500 duration-200">{Locale.ui_confirm || 'Confirm'}</button>
                    </div>
                </div>
            </div>
        </Fade>
    )
};

export default BanModal;