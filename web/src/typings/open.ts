export interface Player {
    charName: string; 
    id: number; 
    steam: string; 
    accName: string; 
    admin?: boolean;
    online: boolean;
    stateId: number;
}

interface PlayersProps {
    players: Player[]
    jobs: { label: string; amount: number; color: string; }[];
}

export interface ActionsProps {
    noclip: boolean;
    vanish: boolean;
    names: boolean;
    blips: boolean;
}

export interface OpenData {
    players: PlayersProps,
    actions?: ActionsProps
}

export interface EntityProps {
    coords: { x: number; y: number; z: number };
    heading: number;
    model: string | number;
    networkOwner?: string | number;
    plate?: string;
}