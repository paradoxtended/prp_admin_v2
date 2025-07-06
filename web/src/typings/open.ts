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

export interface OpenData {
    players: PlayersProps
}