export interface Game {
    id: string,
    player_id: string,
    timestamp: string,
    bet: number,
    choice: string,
    card: number,
    win: number,
    profit: number
}