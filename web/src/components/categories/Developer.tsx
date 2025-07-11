import { useEffect, useState } from "react";
import Loader from "../utils/Loading";
import { Locale } from "../store/locale";
import { fetchNui } from "../../utils/fetchNui";
import type { ActionsProps } from "../../typings/open";
import { isEnvBrowser } from "../../utils/misc";
import Fade from "../utils/transitions/Fade";
import { setClipboard } from "../../utils/setClipboard";

type BasicCoords = { x: number, y: number, z: number, w: number };

interface Coords {
    player: BasicCoords;
    camera: BasicCoords;
}

const Developer: React.FC<{
    actions: ActionsProps;
    close: () => void;
}> = ({ actions, close }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [action, setAction] = useState<ActionsProps>({
        noclip: actions?.noclip,
        vanish: actions?.vanish,
        names: actions?.names,
        blips: actions?.blips
    })
    const [object, setObject] = useState<{model?: string, freeze?: boolean}>({});
    const [vehicle, setVehicle] = useState<{model?: string, spawnIn?: boolean}>({});
    const [coords, setCoords] = useState<Coords | null>();
    const [showHeading, setShowHeading] = useState<string[]>([]);

    useEffect(() => {
        if (!visible) return;

        if (isEnvBrowser()) {
            setCoords({
                player: {
                    x: 458.45,
                    y: 478.8751,
                    z: 95.6748,
                    w: 78.15
                },
                camera: {
                    x: 498.45,
                    y: 475.821,
                    z: 79.586452,
                    w: 78.15
                }
            })

            return
        }

        (async() => {
            const response: Coords | null = await fetchNui('getCoords');

            if (response) {
                setCoords(response)
            }
        })()
    }, [visible])

    useEffect(() => {
        setTimeout(() => setVisible(true), 500);
    }, []);

    return (
        visible ? (
            <div className="flex flex-col gap-5 mr-5 pr-5 pb-1 overflow-auto h-full">
                <p className="text-[26px] text-white font-bold">{Locale.ui_developer_center || 'Developer Center'}</p>
                <div className="flex items-center text-white text-[13px] gap-5">
                    <button className="bg-neutral-900 w-full py-1.5 border border-neutral-700 rounded-full
                    hover:bg-neutral-800 hover:border-neutral-600 duration-200"
                    onClick={() => fetchNui('heal', -1)}>{Locale.ui_heal_everyone || 'Heal Everyone'}</button>
                    <button className="bg-neutral-900 w-full py-1.5 border border-neutral-700 rounded-full
                    hover:bg-neutral-800 hover:border-neutral-600 duration-200"
                    onClick={() => fetchNui('revive', -1)}>{Locale.ui_revive_everyone || 'Revive Everyone'}</button>
                </div>
                <div className="text-white text-sm flex flex-col gap-4">
                    <div className="flex items-center gap-4 w-full">
                        <label className="flex items-center justify-between bg-neutral-900 px-5 py-5 rounded border border-neutral-700 cursor-pointer w-full">
                            <p>{Locale.ui_noclip || 'Noclip'}</p>
                            
                            <div className="relative inline-flex items-center">
                                <input type="checkbox" className="sr-only peer" checked={action.noclip}
                                onChange={() => {
                                    fetchNui('noclip');
                                    setAction(prev => ({
                                        ...prev,
                                        noclip: !prev.noclip,
                                    }));
                                }}/>
                                <div className="w-10 h-5 bg-neutral-600 rounded-full peer peer-checked:bg-lime-600 transition-all duration-300"></div>
                                <div className="absolute top-0.5 left-0.5 bg-neutral-900 w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                            </div>
                        </label>
                        <label className="flex items-center justify-between bg-neutral-900 px-5 py-5 rounded border border-neutral-700 cursor-pointer w-full">
                            <p>{Locale.ui_vanish || 'Vanish'}</p>
                            
                            <div className="relative inline-flex items-center">
                                <input type="checkbox" className="sr-only peer" checked={action.vanish} 
                                onChange={() => {
                                    fetchNui('vanish');
                                    setAction(prev => ({
                                        ...prev,
                                        vanish: !prev.vanish,
                                    }));
                                }}/>
                                <div className="w-10 h-5 bg-neutral-600 rounded-full peer peer-checked:bg-lime-600 transition-all duration-300"></div>
                                <div className="absolute top-0.5 left-0.5 bg-neutral-900 w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                            </div>
                        </label>
                    </div>
                    <div className="flex items-center gap-4 w-full">
                        <label className="flex items-center justify-between bg-neutral-900 px-5 py-5 rounded border border-neutral-700 cursor-pointer w-full">
                            <p>{Locale.ui_player_blips || 'Blips'}</p>
                            
                            <div className="relative inline-flex items-center">
                                <input type="checkbox" className="sr-only peer" checked={action.blips} 
                                onChange={() => {
                                    fetchNui('player_blips');
                                    setAction(prev => ({
                                        ...prev,
                                        blips: !prev.blips,
                                    }));
                                }}/>
                                <div className="w-10 h-5 bg-neutral-600 rounded-full peer peer-checked:bg-lime-600 transition-all duration-300"></div>
                                <div className="absolute top-0.5 left-0.5 bg-neutral-900 w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                            </div>
                        </label>
                        <label className="flex items-center justify-between bg-neutral-900 px-5 py-5 rounded border border-neutral-700 cursor-pointer w-full">
                            <p>{Locale.ui_name_plates || 'Name Plates'}</p>
                            
                            <div className="relative inline-flex items-center">
                                <input type="checkbox" className="sr-only peer" checked={action.names}
                                onChange={() => {
                                    fetchNui('player_names');
                                    setAction(prev => ({
                                        ...prev,
                                        names: !prev.names,
                                    }));
                                }}/>
                                <div className="w-10 h-5 bg-neutral-600 rounded-full peer peer-checked:bg-lime-600 transition-all duration-300"></div>
                                <div className="absolute top-0.5 left-0.5 bg-neutral-900 w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                            </div>
                        </label>
                    </div>
                </div>
                <div className="bg-neutral-900 p-4 rounded border border-neutral-700 text-white text-[17px] flex flex-col gap-4">
                    <p className="font-semibold">{Locale.ui_spawn_new_object || 'Spawn new object'}</p>
                    <div className="flex flex-col gap-1">
                        <p className="text-[13px]">{Locale.ui_object_model || 'Object Model'}</p>
                        <input type="text"
                            onChange={(e) => setObject(prev => ({ ...prev, model: e.target.value}))}
                            placeholder='prop_alien_egg_01'
                            className="text-[13px] px-3 py-1.5 bg-neutral-800 rounded-md focus:outline focus:outline-1 focus:outline-lime-600 focus:outline-offset-1
                            border border-neutral-700 placeholder:text-neutral-500"
                        />
                    </div>
                    <label className="cursor-pointer flex items-center gap-3 w-fit">
                        <div className="relative inline-flex items-center">
                            <input type="checkbox" className="sr-only peer"
                                onChange={(e) => setObject(prev => ({ ...prev, freeze: e.target.checked}))}/>
                            <div className="w-10 h-5 bg-neutral-600 rounded-full peer peer-checked:bg-lime-600 transition-all duration-300"></div>
                            <div className="absolute top-0.5 left-0.5 bg-neutral-900 w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                        </div>
                        <p className="text-[13px]">{Locale.ui_freeze_object || 'Freeze Object'}</p>
                    </label>
                    <div className="text-[13px] flex items-center gap-3">
                        <button className="w-full border border-red-600 rounded-full bg-red-500/10 py-1.5
                        hover:bg-red-500/20 duration-200"
                        onClick={() => {
                            fetchNui('delete_entity', false);
                            close();
                        }}>{Locale.ui_delete_object || 'Delete Object'}</button>
                        <button className="w-full border border-red-600 rounded-full bg-red-500/10 py-1.5
                        hover:bg-red-500/20 duration-200"
                        onClick={() => {
                            fetchNui('delete_entity', true);
                            close();
                        }}>{Locale.ui_delete_closest_entity || 'Delete closest entity'}</button>
                        <button className="w-full border border-neutral-700 rounded-full bg-neutral-800 py-1.5
                        hover:bg-neutral-700 hover:border-neutral-500 duration-200"
                        onClick={() => {
                            if (object.model === '' || object.model === null || !object.model) return;
                            fetchNui('spawn_object', object);
                            close();
                        }}>{Locale.ui_delete_spawn_object || 'Spawn object'}</button>
                    </div>
                </div>
                <div className="bg-neutral-900 p-4 rounded border border-neutral-700 text-white text-[17px] flex flex-col gap-4">
                    <p className="font-semibold">{Locale.ui_spawn_car || 'Spawn vehicle'}</p>
                    <div className="flex flex-col gap-1">
                        <p className="text-[13px]">{Locale.ui_vehicle_model || 'Vehicle Model'}</p>
                        <input type="text"
                            onChange={(e) => setVehicle(prev => ({ ...prev, model: e.target.value}))}
                            placeholder='adder'
                            className="text-[13px] px-3 py-1.5 bg-neutral-800 rounded-md focus:outline focus:outline-1 focus:outline-lime-600 focus:outline-offset-1
                            border border-neutral-700 placeholder:text-neutral-500"
                        />
                    </div>
                    <label className="cursor-pointer flex items-center gap-3 w-fit">
                        <div className="relative inline-flex items-center">
                            <input type="checkbox" className="sr-only peer"
                                onChange={(e) => setVehicle(prev => ({ ...prev, spawnIn: e.target.checked}))}/>
                            <div className="w-10 h-5 bg-neutral-600 rounded-full peer peer-checked:bg-lime-600 transition-all duration-300"></div>
                            <div className="absolute top-0.5 left-0.5 bg-neutral-900 w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                        </div>
                        <p className="text-[13px]">{Locale.ui_spawn_inside || 'Spawn inside'}</p>
                    </label>
                    <button className="border border-neutral-700 rounded-full bg-neutral-800 py-1.5
                        hover:bg-neutral-700 hover:border-neutral-500 duration-200 w-fit text-[13px] px-5"
                    onClick={() => {
                        if (vehicle.model === '' || !vehicle.model) return;
                        fetchNui('spawn_vehicle', vehicle);
                        close();
                    }}>
                        {Locale.ui_spawn_car || 'Spawn vehicle'}
                    </button>
                </div>
                <div className="bg-neutral-900 p-4 rounded border border-neutral-700 text-white text-[17px] flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold">{Locale.ui_current_coords || 'Current coords'}</p>
                        <div className="flex items-center gap-3">
                            <button className="border border-neutral-700 rounded-full bg-neutral-800 py-1.5
                            hover:bg-neutral-700 hover:border-neutral-500 duration-200 w-fit text-[13px] px-5"
                            onClick={() => setClipboard(`${coords?.player.x}, ${coords?.player.y}, ${coords?.player.z}`)}>{Locale.ui_copy_vec3 || 'Copy VEC3'}</button>
                            <button className="border border-neutral-700 rounded-full bg-neutral-800 py-1.5
                            hover:bg-neutral-700 hover:border-neutral-500 duration-200 w-fit text-[13px] px-5"
                            onClick={() => setClipboard(`${coords?.player.x}, ${coords?.player.y}, ${coords?.player.z}, ${coords?.player.w}`)}>{Locale.ui_copy_vec4 || 'Copy VEC4'}</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm bg-neutral-800 w-fit px-2 py-1 rounded border border-neutral-700">
                            <p className="text-neutral-500">X</p>
                            <p>{coords?.player.x.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm bg-neutral-800 w-fit px-2 py-1 rounded border border-neutral-700">
                            <p className="text-neutral-500">Y</p>
                            <p>{coords?.player.y.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm bg-neutral-800 w-fit px-2 py-1 rounded border border-neutral-700">
                            <p className="text-neutral-500">Z</p>
                            <p>{coords?.player.z.toFixed(2)}</p>
                        </div>
                        <Fade in={showHeading.includes('player')}>
                            <div className="flex items-center gap-2 text-sm bg-neutral-800 w-fit px-2 py-1 rounded border border-neutral-700">
                                <p className="text-neutral-500">W</p>
                                <p>{coords?.player.w.toFixed(2)}</p>
                            </div>
                        </Fade>
                    </div>
                    <label className="cursor-pointer flex items-center gap-3 w-fit">
                        <div className="relative inline-flex items-center">
                            <input type="checkbox" className="sr-only peer"
                                onChange={(e) => { 
                                    if (e.target.checked)
                                        setShowHeading(prev => [...prev, 'player'])
                                    else
                                        setShowHeading(prev => (prev.filter(val => val !== 'player')))
                                }}/>
                            <div className="w-10 h-5 bg-neutral-600 rounded-full peer peer-checked:bg-lime-600 transition-all duration-300"></div>
                            <div className="absolute top-0.5 left-0.5 bg-neutral-900 w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                        </div>
                        <p className="text-[13px]">{Locale.ui_include_heading || 'Include heading'}</p>
                    </label>
                </div>
                <div className="bg-neutral-900 p-4 rounded border border-neutral-700 text-white text-[17px] flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold">{Locale.ui_current_coords_camera || 'Current camera coords'}</p>
                        <div className="flex items-center gap-3">
                            <button className="border border-neutral-700 rounded-full bg-neutral-800 py-1.5
                            hover:bg-neutral-700 hover:border-neutral-500 duration-200 w-fit text-[13px] px-5"
                            onClick={() => setClipboard(`${coords?.camera.x}, ${coords?.camera.y}, ${coords?.camera.z}`)}>{Locale.ui_copy_vec3 || 'Copy VEC3'}</button>
                            <button className="border border-neutral-700 rounded-full bg-neutral-800 py-1.5
                            hover:bg-neutral-700 hover:border-neutral-500 duration-200 w-fit text-[13px] px-5"
                            onClick={() => setClipboard(`${coords?.camera.x}, ${coords?.camera.y}, ${coords?.camera.z}, ${coords?.camera.w}`)}>{Locale.ui_copy_vec4 || 'Copy VEC4'}</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm bg-neutral-800 w-fit px-2 py-1 rounded border border-neutral-700">
                            <p className="text-neutral-500">X</p>
                            <p>{coords?.camera.x.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm bg-neutral-800 w-fit px-2 py-1 rounded border border-neutral-700">
                            <p className="text-neutral-500">Y</p>
                            <p>{coords?.camera.y.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm bg-neutral-800 w-fit px-2 py-1 rounded border border-neutral-700">
                            <p className="text-neutral-500">Z</p>
                            <p>{coords?.camera.z.toFixed(2)}</p>
                        </div>
                        <Fade in={showHeading.includes('camera')}>
                            <div className="flex items-center gap-2 text-sm bg-neutral-800 w-fit px-2 py-1 rounded border border-neutral-700">
                                <p className="text-neutral-500">W</p>
                                <p>{coords?.camera.w.toFixed(2)}</p>
                            </div>
                        </Fade>
                    </div>
                    <label className="cursor-pointer flex items-center gap-3 w-fit">
                        <div className="relative inline-flex items-center">
                            <input type="checkbox" className="sr-only peer"
                                onChange={(e) => { 
                                    if (e.target.checked)
                                        setShowHeading(prev => [...prev, 'camera'])
                                    else
                                        setShowHeading(prev => (prev.filter(val => val !== 'camera')))
                                }}/>
                            <div className="w-10 h-5 bg-neutral-600 rounded-full peer peer-checked:bg-lime-600 transition-all duration-300"></div>
                            <div className="absolute top-0.5 left-0.5 bg-neutral-900 w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
                        </div>
                        <p className="text-[13px]">{Locale.ui_include_heading || 'Include heading'}</p>
                    </label>
                </div>
            </div>
        ) : <Loader />
    )
};

export default Developer;