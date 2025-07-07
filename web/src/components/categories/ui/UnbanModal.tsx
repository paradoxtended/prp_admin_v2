import { Locale } from "../../store/locale";
import Fade from "../../utils/transitions/Fade";

const UnbanModal: React.FC<{
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
}> = ({ visible, onClose, onConfirm }) => {
    return (
        <Fade in={visible}>
            <div>
                <div className="fixed inset-0 bg-black bg-opacity-70 z-20 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto opacity-100 z-50">
                    <div className="bg-neutral-900 w-96 text-white flex flex-col p-4 gap-5 rounded border border-neutral-700 relative">
                        <i className="fa-solid fa-xmark absolute top-3 right-3 scale-90 text-neutral-600 cursor-pointer"
                        onClick={onClose}></i>
                        <p className="font-semibold">{Locale.ui_unban || 'Unban'}</p>
                        <p className="text-sm">{Locale.ui_unban_message || 'Are you sure you want to unban this player?'}</p>
                        <button onClick={() => onConfirm()} className="text-sm bg-neutral-800 border border-neutral-600 rounded-full w-full py-1.5
                        hover:bg-neutral-700 hover:border-neutral-500 duration-200">{Locale.ui_confirm || 'Confirm'}</button>
                    </div>
                </div>
            </div>
        </Fade>
    )
};

export default UnbanModal;