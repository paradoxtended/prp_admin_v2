import { useEffect, useState } from "react";
import { Locale } from "../../store/locale";
import Fade from "../../utils/transitions/Fade";

const ItemModal: React.FC<{
    visible: boolean;
    onClose: () => void;
    onConfirm: (data: { name?: string, amount?: number, json?: string }) => void;
}> = ({ visible, onClose, onConfirm }) => {
    const [data, setData] = useState<{ name?: string, amount?: number, json?: string }>({});

    useEffect(() => setData({}), [visible]);

    return (
        <Fade in={visible}>
            <div>
                <div className="fixed inset-0 bg-black bg-opacity-70 z-20 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto opacity-100 z-50">
                    <div className="bg-neutral-900 w-96 text-white flex flex-col p-3 gap-5 rounded border border-neutral-700">
                        <p className="mx-auto text-lg font-semibold">{Locale.ui_give_item || 'Give Item'}</p>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <p className="text-white text-sm">{Locale.ui_item_name || 'Item name'}</p>
                                <input type="text"
                                    onChange={(e) => setData(prev => ({...prev, name: e.target.value}))}
                                    placeholder={Locale.ui_item_name || 'Item name'}
                                    className="bg-neutral-800 focus:outline-none rounded border border-neutral-700 px-3 py-1.5 w-full text-sm text-neutral-400
                                    focus:border-lime-600 placeholder:text-neutral-500"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-white text-sm">{Locale.ui_item_amount || 'Item amount'}</p>
                                <input type="number"
                                    onChange={(e) => setData(prev => ({...prev, amount: Number(e.target.value)}))}
                                    placeholder={Locale.ui_item_amount || 'Item amount'}
                                    className="bg-neutral-800 focus:outline-none rounded border border-neutral-700 px-3 py-1.5 w-full text-sm text-neutral-400
                                    focus:border-lime-600 placeholder:text-neutral-500"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-white text-sm">{Locale.ui_json || 'Json'}</p>
                                <textarea
                                    onChange={(e) => setData(prev => ({...prev, json: e.target.value}))}
                                    style={{ resize: "none" }}
                                    rows={3}
                                    placeholder={Locale.ui_json || 'Json'}
                                    className="bg-neutral-800 focus:outline-none rounded border border-neutral-700 px-3 py-1.5 w-full text-[13px] text-neutral-400
                                    focus:border-lime-600 placeholder:text-neutral-500"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={onClose} className="text-sm bg-red-700/10 border border-red-600 rounded-full w-full py-1
                                hover:bg-red-700/20 duration-200">{Locale.ui_cancel || 'Cancel'}</button>
                                <button onClick={() => onConfirm(data)} className="text-sm bg-lime-500/10 border border-lime-600 rounded-full w-full py-1
                                hover:bg-lime-500/20 duration-200">{Locale.ui_give_item || 'Give Item'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fade>
    )
};

export default ItemModal;