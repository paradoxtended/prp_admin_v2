import { useEffect, useState } from "react";
import { Locale } from "../../store/locale";
import Fade from "../../utils/transitions/Fade";

const MessageModal: React.FC<{
    visible: boolean;
    onClose: () => void;
    onConfirm: (message: string) => void;
}> = ({ visible, onClose, onConfirm }) => {
    const [message, setMessage] = useState<string>('');

    useEffect(() => setMessage(''), [visible])

    return (
        <Fade in={visible}>
            <div>
                <div className="fixed inset-0 bg-black bg-opacity-70 z-20 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto opacity-100 z-50">
                    <div className="bg-neutral-900 w-96 text-white flex flex-col p-4 gap-5 rounded border border-neutral-700 relative">
                        <i className="fa-solid fa-xmark absolute top-3 right-3 scale-90 text-neutral-600 cursor-pointer"
                        onClick={onClose}></i>
                        <p className="font-semibold">{Locale.ui_create_me_message || 'Create Me Message'}</p>
                        <div className="flex flex-col gap-2 text-white">
                            <p className="text-white text-[13px] font-medium">{Locale.ui_message || 'Message'}</p>
                            <input type="text"
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={Locale.ui_message_to_show || 'Message to show on the /me'}
                                className="bg-neutral-800 rounded border border-neutral-700 px-3 py-1.5 w-full text-[13px]
                                placeholder:text-neutral-500 focus:outline outline-1 outline-offset-2 outline-lime-600"
                            />
                        </div>
                        <button onClick={() => onConfirm(message)} className="text-sm bg-neutral-800 border border-neutral-600 rounded-full w-full py-1.5
                        hover:bg-neutral-700 hover:border-neutral-500 duration-200">{Locale.ui_confirm || 'Confirm'}</button>
                    </div>
                </div>
            </div>
        </Fade>
    )
};

export default MessageModal;