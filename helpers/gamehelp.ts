export class GameHelp {
    playRound(bet: number, choice: string): { win: number, card: number } {
        const card = Math.floor(Math.random() * 13) + 1
        const win = (choice === 'small' && card <= 6) || (choice === 'large' && card >= 8)
        const obj = { win: win ? bet * 2 : 0, card}
        return obj//win ? bet * 2 : 0
    }
}