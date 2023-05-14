"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gamehelp_1 = require("./gamehelp");
const game = new gamehelp_1.GameHelp();
describe('peli', () => {
    test('Play a round, should return bet * 2 or 0', () => {
        const obj = game.playRound(10, 'large');
        expect(obj.win === 20 || obj.win === 0).toBe(true);
    });
});
