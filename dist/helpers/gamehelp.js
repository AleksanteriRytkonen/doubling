"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameHelp = void 0;
class GameHelp {
    playRound(bet, choice) {
        const card = Math.floor(Math.random() * 13) + 1;
        const win = (choice === 'small' && card <= 6) || (choice === 'large' && card >= 8);
        const obj = { win: win ? bet * 2 : 0, card };
        return obj; //win ? bet * 2 : 0
    }
}
exports.GameHelp = GameHelp;
