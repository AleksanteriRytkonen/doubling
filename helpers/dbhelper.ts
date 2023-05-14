import sqlite3 from 'sqlite3';
import { Account } from '../interfaces/Account';
import { v4 as uuidv4 } from 'uuid';
import { Player } from '../interfaces/player';
import { Game } from '../interfaces/Game';
export class DbHelper {
    createDb() {
        const db = new sqlite3.Database(':memory:')
        db.serialize(() => {
            db.run('CREATE TABLE players(id TEXT PRIMARY KEY,name TEXT,balance REAL)')
            db.run('CREATE TABLE games(id TEXT PRIMARY KEY,player_id TEXT,timestamp TEXT,bet REAL,choice TEXT,card INTEGER,win INTEGER,profit REAL)')
        })
        return db
    }
    async getPlayerBalance(db: sqlite3.Database, id: string): Promise<number> {
        return new Promise((resolve, reject) => {
            db.get('SELECT balance FROM players WHERE id=?', id, (err, row) => {
                if (err) {
                    reject(err)
                } else if (!row) {
                    reject()
                } else {
                    const obj: { balance?: number } = row
                    const balance = obj.balance ?? 0
                    resolve(balance)
                }
            })
        })
    }

    async createPlayer(db: sqlite3.Database, player: Player, id: string) {
        return new Promise<void>((resolve, reject) => {
            db.run(
                'INSERT INTO players VALUES (?, ?, ?)',
                [id, player.name, player.balance],
                (err) => {
                    if (err) reject(err);
                    resolve();
                }
            );
        });
    }

    async createGame(db: sqlite3.Database, game: Game) {
        return new Promise<void>((resolve, reject) => {
            db.run('INSERT INTO games VALUES(?,?,?,?,?,?,?,?)',
            [game.id, game.player_id, game.timestamp, game.bet, game.choice, game.card, game.win, game.profit],
            (err) => {
                if (err) reject(err)
                resolve()
            }
            )
        })
    }

    async updateGame(db: sqlite3.Database, game: Game) {
        return new Promise<void>((resolve, reject) => {
            db.run('UPDATE games SET win = ? WHERE id = ?', game.win, game.id, (err: any) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

    async getGame(db: sqlite3.Database, id: string): Promise<Game> {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM games WHERE id=?', id, (err, row) => {
                if (err) {
                    reject(err)
                } else if (!row) {
                    console.error('Error finding row')
                    reject()
                } else {
                    //const balance: Account = row as Account
                    const game: Game = row as Game
                    resolve(game)
                }
            })
        })
    }


    async getPlayer(db: sqlite3.Database, id: string): Promise<Player> {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM players WHERE id=?', id, (err, row) => {
                if (err) {
                    reject(err)
                } else if (!row) {
                    reject('No player found')
                } else {
                    const player: Player = row as Player
                    resolve(player)
                }
            })
        })
    }

    async updatePlayer(db: sqlite3.Database, id: string, bet: number, balance: number) {
        const newBalance = bet > 0 ? balance - bet : balance
        return new Promise<void>((resolve, reject) => {
            db.run('UPDATE players SET balance = ? WHERE id = ?', newBalance, id, async (err: any) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }
}