interface PlayersProps {
    count: number;
    jobs: { label: string; amount: number; color: string; }[];
    admins: { nickname: string; id: number; role?: string }[]
}

export interface OpenData {
    players: PlayersProps
}