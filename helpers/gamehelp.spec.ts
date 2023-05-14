import { GameHelp } from "./gamehelp";

const game = new GameHelp()

describe('peli', () => {
    test('Play a round, should return bet * 2 or 0', () => {
        const obj = game.playRound(10, 'large')
        expect(obj.win === 20 || obj.win === 0).toBe(true)
    })
})