import type { Player } from "../../../typings/open";
import { fetchNui } from "../../../utils/fetchNui";
import type { PlayerActionsProps } from "../Player";

const RightSide: React.FC<{ 
    playerActions: () => Record<string, PlayerActionsProps[]>;
    handleClose: () => void;
    data: Player;
    modals: {
        main: React.Dispatch<React.SetStateAction<boolean>>;
    }
}> = ({ playerActions, handleClose, data, modals }) => {
    const performAction = (action: PlayerActionsProps) => {
        if (!action.modal || action.modal === undefined) {
            fetchNui(action.name, data.id)
        }

        if (action.shouldClose) {
            handleClose()
        }

        if (action.modal) {
            modals.main(true);
            action.modal(true);
        }
    };
    
    return (
        <div className="w-1/3 flex flex-col gap-3 pr-4">
            <div className="h-2/3 bg-neutral-900 border border-neutral-700 rounded px-5 py-4">
                <div className="text-white flex flex-col gap-3">
                    {Object.entries(playerActions()).map(([category, actions], index) => (
                        <div key={`action-${index}`} className="flex flex-col gap-2">
                            <p className="text-[13px] text-neutral-600">{category}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                                {actions.map((action, index) => (
                                    <button onClick={() => performAction(action)}
                                    key={`action-button-${index}`}
                                    className="text-[13px] bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-600
                                    hover:bg-neutral-700 hover:border-neutral-500 duration-200"
                                    style={{ 
                                        border: `1px solid ${action.color}`, 
                                        backgroundColor: action.color && `${action.color + 20}`,
                                    }}>{action.label}</button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default RightSide;