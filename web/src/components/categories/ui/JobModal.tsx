import { useEffect, useState } from "react";
import { Locale } from "../../store/locale";
import Fade from "../../utils/transitions/Fade";

const JobModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: { name: string, grade: number }) => void;
}> = ({ visible, onClose, onConfirm }) => {
    const [job, setJob] = useState<{ name: string | null, grade: number | null }>({ name: null, grade: null });
    
    useEffect(() => setJob({ name: null, grade: null }), [visible]);

    return (
        <Fade in={visible}>
            <div>
                <div className="fixed inset-0 bg-black bg-opacity-70 z-20 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto opacity-100 z-50">
                    <div className="bg-neutral-900 w-96 text-white flex flex-col p-3 gap-5 rounded border border-neutral-700">
                        <p className="mx-auto font-semibold">
                            {Locale.ui_change_job || 'Change Job'}
                        </p>

                        <div className="flex flex-col gap-1 text-sm">
                            <p className="text-neutral-500">{Locale.ui_job_name || 'Job Name'}</p>
                            <input type="text"
                            onChange={(e) => setJob(prev => ({ ...prev, name: e.target.value }))}
                            placeholder={Locale.ui_job_name || 'Job Name'}
                            className="w-full bg-neutral-800 border border-neutral-700 focus:outline-none focus:border-lime-600 rounded px-3 py-1 text-sm
                            placeholder:text-neutral-500"/>
                        </div>

                        <div className="flex flex-col gap-1 text-sm">
                            <p className="text-neutral-500">{Locale.ui_job_grade || 'Job Rank'}</p>
                            <input type="number"
                            onChange={(e) => setJob(prev => ({ ...prev, grade: Number(e.target.value) }))}
                            placeholder={Locale.ui_job_grade || 'Job Rank'}
                            className="w-full bg-neutral-800 border border-neutral-700 focus:outline-none focus:border-lime-600 rounded px-3 py-1 text-sm
                            placeholder:text-neutral-500"/>
                        </div>

                        <div className="text-sm flex items-center gap-3">
                            <button className="bg-red-700/50 border border-red-600 rounded-full w-1/2 py-1 hover:bg-red-700/30 duration-200"
                            onClick={onClose}>{Locale.ui_cancel || 'Cancel'}</button>
                            <button className="bg-lime-500/20 border border-lime-600 rounded-full w-1/2 py-1 hover:bg-lime-500/30 duration-200"
                            onClick={() => onConfirm({ name: job.name as string, grade: job.grade as number })}>{Locale.ui_confirm || 'Confirm'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </Fade>
  );
};

export default JobModal;