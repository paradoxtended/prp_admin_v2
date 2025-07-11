import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import Loading from "../utils/Loading";
import { Locale } from "../store/locale";
import type { OpenData, Player } from "../../typings/open";

const Dashboard: React.FC<{ 
    data?: OpenData;
    changeCategory: (name: string) => void;
    setPlayer: (data: Player) => void;
}> = ({ data, changeCategory, setPlayer }) => {
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => setVisible(true), 500);
    }, []);

    return (
        visible ? (
            <div className="h-full pr-10 flex flex-col gap-3">
                <div className="w-full h-1/2 flex gap-3">
                    <div className="w-3/4 h-fit max-h-[100%] p-5 bg-neutral-900 border border-neutral-700 rounded text-white">
                        <div className="flex items-center justify-between">
                            <p className="font-semibold text-[15px]">{Locale.ui_current_players || 'Current Players on Server'}</p>
                            <p className="text-lime-400 font-bold text-lg">{data?.players.players.filter(ply => ply.online).length}</p>
                        </div>
                        <div className="flex items-center gap-3 my-5 flex-wrap max-h-36 overflow-auto">
                            {data?.players.jobs.map((job, index) => (
                                <div key={`dashboard-jobs-${index}`} className='flex items-center gap-3 px-2 py-0.5 rounded-lg text-[15px]' style={{ background: job.color + 40, border: `1px solid ${job.color}` }}>
                                    <p style={{ color: job.color }}>{job.label}</p>
                                    <p className="text-white font-semibold">{job.amount}</p>
                                </div>
                            ))}
                        </div>
                        <div className="text-sm">
                            <p className="bg-neutral-800 w-fit px-3 py-1.5 rounded-full border border-neutral-700 cursor-pointer
                            hover:bg-neutral-700 hover:border-neutral-500 duration-200"
                            onClick={() => changeCategory('players')}>{Locale.ui_online_players || 'Online Players'}</p>
                        </div>
                    </div>
                    <div className="w-1/3 h-full py-5 bg-neutral-900 border border-neutral-700 rounded text-white">
                        <div className="flex items-center justify-between px-5">
                            <p className="font-semibold text-[15px]">{Locale.ui_admins_online || 'Admins Online'}</p>
                            <p className="text-lime-400 font-bold text-lg">{data?.players.players.filter(ply => ply.admin && ply.online).length}</p>
                        </div>
                        <div className="mt-3 flex flex-col gap-2 h-56 overflow-auto px-5">
                            {data?.players.players.filter(ply => ply.admin && ply.online).map((admin, index) => (
                                <div key={`admin-${index}`} 
                                className="group flex items-center text-sm justify-between bg-[#202020] px-2 py-1 rounded-md border border-neutral-600 cursor-pointer"
                                onClick={() => { changeCategory('players'); setPlayer(admin) }}>
                                    <p className="group-hover:text-lime-500 duration-200">{admin.accName}</p>
                                    <p className="bg-lime-500/20 border border-lime-500 rounded-md px-1.5 py-0.5 text-[13px]">Admin</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-full h-[300px] p-5 bg-neutral-900 border border-neutral-700 rounded text-white text-sm flex flex-col gap-3">
                    <p className="font-semibold text-[15px]">{Locale.ui_players_activity || 'Players Activity'}</p>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                        data={data?.chart}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4d7c0f" stopOpacity={0.8}/>
                            <stop offset="100%" stopColor="#000000" stopOpacity={0.8}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#737373" fontSize={13} />
                        <YAxis stroke="#737373" fontSize={13} allowDecimals={false} />
                        <CartesianGrid vertical={false} opacity={0.1} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="uv" stroke="#84cc16" fillOpacity={1} fill="url(#colorUv)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        ) : <Loading />
    )
};

const CustomTooltip: React.FC<{
    active?: boolean;
    payload?: any;
    label?: any;
}> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-900 border border-neutral-700 shadow rounded p-2 text-sm">
        <p className="text-neutral-500">{Locale.ui_time || 'Time'}: {label}</p>
        <p className="text-lime-500 font-semibold">
          {Locale.ui_amount || 'Amount'}: {payload[0].value}
        </p>
      </div>
    );
  }

  return null;
};

export default Dashboard;