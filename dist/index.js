"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const uuid_1 = require("uuid");
//import { open } from 'sqlite';
const dotenv_1 = __importDefault(require("dotenv"));
const dbhelper_1 = require("./helpers/dbhelper");
const gamehelp_1 = require("./helpers/gamehelp");
dotenv_1.default.config();
/*const db = new sqlite3.Database(':memory:')
db.serialize(() => {
    db.run('CREATE TABLE players(id TEXT PRIMARY KEY,name TEXT,balance REAL)')
    db.run('CREATE TABLE games(id TEXT PRIMARY KEY,player_id TEXT,timestamp TEXT,bet REAL,choice TEXT,card INTEGER,win INTEGER,profit REAL)')
})*/
const dbHelp = new dbhelper_1.DbHelper();
const gameHelp = new gamehelp_1.GameHelp();
const db = dbHelp.createDb();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const port = process.env.PORT;
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.post('/players', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO add a check that balance is a number
    const player = req.body;
    const id = (0, uuid_1.v4)();
    try {
        yield dbHelp.createPlayer(db, player, id);
        res.json({ playerId: id });
    }
    catch (err) {
        res.status(500).send('Error creating player');
    }
}));
app.get('/players/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const player = yield dbHelp.getPlayer(db, id);
        res.json(player);
    }
    catch (err) {
        res.status(500).send('Error fetching player');
    }
}));
app.post('/play', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { player_id, bet, choice } = req.body;
    const id = (0, uuid_1.v4)();
    try {
        const balance = yield dbHelp.getPlayerBalance(db, player_id);
        if (balance < bet) {
            return res.status(403).json({ error: 'You dont have enough money to play' });
        }
        yield dbHelp.updatePlayer(db, player_id, bet, balance);
        const round = gameHelp.playRound(bet, choice);
        //const win = (choice === 'small' && card <= 6) || (choice === 'large' && card >= 8)
        if (round.win === 0) {
            const game = {
                id: id,
                player_id,
                timestamp: new Date().toISOString(),
                bet,
                choice,
                card: round.card,
                win: round.win,
                profit: 0
            };
            yield dbHelp.createGame(db, game);
            res.status(200).json({ message: 'Game lost' });
        }
        else {
            // PLAY MORE
            const game = {
                id: id,
                player_id,
                timestamp: new Date().toISOString(),
                bet,
                choice,
                card: round.card,
                win: round.win,
                profit: round.win - bet
            };
            yield dbHelp.createGame(db, game);
            res.status(200).json({ win: round.win, card: round.card, gameId: id });
        }
    }
    catch (err) {
        return res.status(500).send('player not found');
    }
}));
app.post('/games/continue', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, choice } = req.body;
    try {
        const game = yield dbHelp.getGame(db, id);
        if (game.win === 0) {
            res.status(400).json({ message: 'Cant continue a lost game' });
        }
        else {
            game.win = gameHelp.playRound(game.win, choice).win;
            game.profit = game.win - game.bet;
            try {
                yield dbHelp.updateGame(db, game);
            }
            catch (err) {
                console.error('Unable to update game win', err);
            }
            if (game.win === 0) {
                res.status(400).json({ message: 'Game lost' });
            }
            else {
                res.status(200).json({ message: 'Game won', game });
            }
        }
    }
    catch (err) {
        console.error('Error fetching game', err);
    }
}));
app.post('/withdraw', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        const game = yield dbHelp.getGame(db, id);
        const player = yield dbHelp.getPlayer(db, game.player_id);
        const newBalance = game.win + player.balance;
        yield dbHelp.updatePlayer(db, game.player_id, 0, newBalance);
        // After withdraw set game win to 0 to prevent little balance abuse
        game.win = 0;
        yield dbHelp.updateGame(db, game);
        res.json({ balance: newBalance });
    }
    catch (err) {
        res.status(500).json({ errorMsg: 'Error finding game', err });
    }
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
exports.default = app;
