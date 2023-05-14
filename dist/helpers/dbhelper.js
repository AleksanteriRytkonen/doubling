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
exports.DbHelper = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
class DbHelper {
    createDb() {
        const db = new sqlite3_1.default.Database(':memory:');
        db.serialize(() => {
            db.run('CREATE TABLE players(id TEXT PRIMARY KEY,name TEXT,balance REAL)');
            db.run('CREATE TABLE games(id TEXT PRIMARY KEY,player_id TEXT,timestamp TEXT,bet REAL,choice TEXT,card INTEGER,win INTEGER,profit REAL)');
        });
        return db;
    }
    getPlayerBalance(db, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                db.get('SELECT balance FROM players WHERE id=?', id, (err, row) => {
                    var _a;
                    if (err) {
                        reject(err);
                    }
                    else if (!row) {
                        reject();
                    }
                    else {
                        const obj = row;
                        const balance = (_a = obj.balance) !== null && _a !== void 0 ? _a : 0;
                        resolve(balance);
                    }
                });
            });
        });
    }
    createPlayer(db, player, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                db.run('INSERT INTO players VALUES (?, ?, ?)', [id, player.name, player.balance], (err) => {
                    if (err)
                        reject(err);
                    resolve();
                });
            });
        });
    }
    createGame(db, game) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                db.run('INSERT INTO games VALUES(?,?,?,?,?,?,?,?)', [game.id, game.player_id, game.timestamp, game.bet, game.choice, game.card, game.win, game.profit], (err) => {
                    if (err)
                        reject(err);
                    resolve();
                });
            });
        });
    }
    updateGame(db, game) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                db.run('UPDATE games SET win = ? WHERE id = ?', game.win, game.id, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
    }
    getGame(db, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                db.get('SELECT * FROM games WHERE id=?', id, (err, row) => {
                    if (err) {
                        reject(err);
                    }
                    else if (!row) {
                        console.error('Error finding row');
                        reject();
                    }
                    else {
                        //const balance: Account = row as Account
                        const game = row;
                        resolve(game);
                    }
                });
            });
        });
    }
    getPlayer(db, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                db.get('SELECT * FROM players WHERE id=?', id, (err, row) => {
                    if (err) {
                        reject(err);
                    }
                    else if (!row) {
                        reject('No player found');
                    }
                    else {
                        const player = row;
                        resolve(player);
                    }
                });
            });
        });
    }
    updatePlayer(db, id, bet, balance) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBalance = bet > 0 ? balance - bet : balance;
            return new Promise((resolve, reject) => {
                db.run('UPDATE players SET balance = ? WHERE id = ?', newBalance, id, (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                }));
            });
        });
    }
}
exports.DbHelper = DbHelper;
