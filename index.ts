import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import sqlite3 from 'sqlite3';
//import { open } from 'sqlite';
import dotenv from 'dotenv';
import { DbHelper } from './helpers/dbhelper';
import { Account } from './interfaces/Account';
import { Player } from './interfaces/player';
import { Game } from './interfaces/Game';
import { GameHelp } from './helpers/gamehelp';

dotenv.config();

/*const db = new sqlite3.Database(':memory:')
db.serialize(() => {
    db.run('CREATE TABLE players(id TEXT PRIMARY KEY,name TEXT,balance REAL)')
    db.run('CREATE TABLE games(id TEXT PRIMARY KEY,player_id TEXT,timestamp TEXT,bet REAL,choice TEXT,card INTEGER,win INTEGER,profit REAL)')
})*/
const dbHelp = new DbHelper()
const gameHelp = new GameHelp()
const db = dbHelp.createDb()

const app: Express = express()
app.use(bodyParser.json())
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.post('/players', async (req: Request, res: Response) => {
    // TODO add a check that balance is a number
    const player: Player = req.body
    const id = uuidv4()
    try {
        await dbHelp.createPlayer(db, player, id)
        res.json({playerId: id})
    } catch (err) {
        res.status(500).send('Error creating player')
    }
    
})

app.get('/players/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const player = await dbHelp.getPlayer(db, id)
        res.json(player)
    } catch (err) {
        res.status(500).send('Error fetching player')
    }
})

app.post('/play', async (req: Request, res: Response) => {
    const { player_id, bet, choice } = req.body
    const id = uuidv4()
    try {
        const balance = await dbHelp.getPlayerBalance(db, player_id)
        if (balance < bet) {
            return res.status(403).json({ error: 'You dont have enough money to play' })
        }
        await dbHelp.updatePlayer(db, player_id, bet, balance)
        /*const card = Math.floor(Math.random() * 13) + 1
        console.log(gameHelp.playRound(bet, choice))*/
        const round = gameHelp.playRound(bet, choice)

        //const win = (choice === 'small' && card <= 6) || (choice === 'large' && card >= 8)
        if (round.win === 0) {
            const game: Game = {
                id: id,
                player_id,
                timestamp: new Date().toISOString(),
                bet,
                choice,
                card: round.card,
                win: round.win,
                profit: 0
            }
            await dbHelp.createGame(db, game)
            res.status(200).json({ message: 'Game lost' })
        } else {
            // PLAY MORE
            const game: Game = {
                id: id,
                player_id,
                timestamp: new Date().toISOString(),
                bet,
                choice,
                card: round.card,
                win: round.win,
                profit: round.win - bet
            }
            await dbHelp.createGame(db, game)
            res.status(200).json({ win: round.win, card: round.card, gameId: id })
        }
    } catch (err) {
        return res.status(500).send('player not found')
    }
})
app.post('/games/continue', async (req: Request, res: Response) => {
    const { id, choice } = req.body
    try {
        const game: Game = await dbHelp.getGame(db, id)
        if (game.win === 0) {
            res.status(400).json({ message: 'Cant continue a lost game' })
        } else {
            game.win = gameHelp.playRound(game.win, choice).win
            game.profit = game.win - game.bet
            try {
                await dbHelp.updateGame(db, game)
            } catch (err) {
                console.error('Unable to update game win', err)
            }
            if (game.win === 0) {
                res.status(400).json({ message: 'Game lost' })
            } else {
                res.status(200).json({ message: 'Game won', game })
            }
        }
    } catch (err) {
        console.error('Error fetching game', err)
    }
})
app.post('/withdraw', async (req: Request, res: Response) => {
    const { id } = req.body
    try {
        const game: Game = await dbHelp.getGame(db, id)
        const player = await dbHelp.getPlayer(db, game.player_id)
        const newBalance = game.win + player.balance
        await dbHelp.updatePlayer(db, game.player_id, 0, newBalance)
        // After withdraw set game win to 0 to prevent little balance abuse
        game.win = 0
        await dbHelp.updateGame(db, game)
        res.json({ balance: newBalance })
    } catch (err) {
        res.status(500).json({ errorMsg: 'Error finding game', err })
    }
})
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app