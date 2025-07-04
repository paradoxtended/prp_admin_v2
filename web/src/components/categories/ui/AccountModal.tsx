import { useEffect, useState } from "react";
import { Locale } from "../../store/locale";
import Fade from "../../utils/transitions/Fade";

const AccountModal: React.FC<{
  data: { type: string | null, action: string | null };
  visible: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}> = ({ data, visible, onClose, onConfirm }) => {
    const [amount, setAmount] = useState<string>('');
    const title = data.action === 'add' && data.type === 'bank' ? (Locale.ui_add_bank_money || 'Add Bank Money') :
                  data.action === 'remove' && data.type === 'bank' ? (Locale.ui_remove_bank_money || 'Remove Bank Money') :
                  data.action === 'add' && data.type === 'money' ? (Locale.ui_add_cash || 'Add Cash') :
                  data.action === 'remove' && data.type === 'money' ? (Locale.ui_remove_cash || 'Remove Cash') : Locale.ui_change_account_status || 'Change Account Status';

    useEffect(() => setAmount(''), [visible]);

    return (
        <Fade in={visible}>
            <div>
                <div className="fixed inset-0 bg-black bg-opacity-70 z-20 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto opacity-100 z-50">
                    <div className="bg-neutral-900 w-96 text-white flex flex-col p-3 gap-5 rounded border border-neutral-700">
                        <p className="mx-auto font-semibold">
                            {title}
                        </p>
                        <div className="flex flex-col gap-2">
                            <input type="number"
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={Locale.ui_enter_ammount || 'Enter amount'}
                            className="w-full bg-neutral-800 border border-neutral-700 focus:outline-none focus:border-lime-600 rounded px-3 py-1 text-sm
                            placeholder:text-neutral-500"/>

                            <div className="flex text-sm items-center justify-end gap-1">
                                <button className="bg-neutral-800 border border-neutral-700 rounded-full px-3 py-1 hover:border-lime-600 hover:bg-lime-500/20 duration-200"
                                onClick={() => onConfirm(Number(1000))}>$1000</button>
                                <button className="bg-neutral-800 border border-neutral-700 rounded-full px-3 py-1 hover:border-lime-600 hover:bg-lime-500/20 duration-200"
                                onClick={() => onConfirm(Number(2500))}>$2500</button>
                                <button className="bg-neutral-800 border border-neutral-700 rounded-full px-3 py-1 hover:border-lime-600 hover:bg-lime-500/20 duration-200"
                                onClick={() => onConfirm(Number(5000))}>$5000</button>
                            </div>
                        </div>

                        <div className="text-sm flex items-center gap-3">
                            <button className="bg-red-700/50 border border-red-600 rounded-full w-1/2 py-1 hover:bg-red-700/30 duration-200"
                            onClick={onClose}>{Locale.ui_cancel || 'Cancel'}</button>
                            <button className="bg-lime-500/20 border border-lime-600 rounded-full w-1/2 py-1 hover:bg-lime-500/30 duration-200"
                            onClick={() => onConfirm(Number(amount))}>{Locale.ui_confirm || 'Confirm'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </Fade>
  );
};

export default AccountModal;