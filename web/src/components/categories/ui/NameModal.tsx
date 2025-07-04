import { useEffect, useState } from "react";
import { Locale } from "../../store/locale";
import Fade from "../../utils/transitions/Fade";

const NameModal: React.FC<{
    name: string;
    visible: boolean;
    onClose: () => void;
    onConfirm: (data: { firstname?: string, lastname?: string }) => void;
}> = ({ name, visible, onClose, onConfirm }) => {
    const [firstname, lastname] = name.split(" ");
    const [data, setData] = useState<{ firstname?: string, lastname?: string }>({
        firstname: firstname,
        lastname: lastname
    });

    useEffect(() => {
        setData({
            firstname: firstname,
            lastname: lastname
        });
    }, [visible])

    return (
        <Fade in={visible}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto opacity-100">
                <div className="bg-neutral-900 w-96 text-white flex flex-col p-3 gap-5 rounded border border-neutral-700">
                    <p className="mx-auto text-lg font-semibold">{Locale.ui_update_char_names || 'Update character names'}</p>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <p className="text-white text-sm">{Locale.ui_firstname || 'Firstname'}</p>
                            <input type="text"
                                defaultValue={data.firstname}
                                onChange={(e) => setData(prev => ({...prev, firstname: e.target.value}))}
                                placeholder={Locale.ui_firstname || 'Firstname'}
                                className="bg-neutral-800 focus:outline-none rounded border border-neutral-700 px-3 py-1.5 w-full text-sm text-neutral-300
                                focus:border-lime-600 placeholder:text-neutral-500"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-white text-sm">{Locale.ui_lastname || 'Lastname'}</p>
                            <input type="text"
                                defaultValue={data.lastname}
                                onChange={(e) => setData(prev => ({...prev, lastname: e.target.value}))}
                                placeholder={Locale.ui_lastname || 'Lastname'}
                                className="bg-neutral-800 focus:outline-none rounded border border-neutral-700 px-3 py-1.5 w-full text-sm text-neutral-300
                                focus:border-lime-600 placeholder:text-neutral-500"
                            />
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                            <button onClick={onClose} className="text-sm bg-red-700/10 border border-red-600 rounded-full w-full py-1
                            hover:bg-red-700/20 duration-200">{Locale.ui_cancel || 'Cancel'}</button>
                            <button onClick={() => onConfirm(data)} className="text-sm bg-lime-500/10 border border-lime-600 rounded-full w-full py-1
                            hover:bg-lime-500/20 duration-200">{Locale.ui_update || 'Update'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </Fade>
    )
};

export default NameModal;