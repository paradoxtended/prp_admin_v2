export interface Player {
    charName: string; 
    id: number; 
    steam: string | number; 
    accName: string; 
    admin?: boolean
}

interface PlayersProps {
    players: Player[]
    jobs: { label: string; amount: number; color: string; }[];
}

export interface OpenData {
    players: PlayersProps
}