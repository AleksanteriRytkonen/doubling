import app from './index'
import request from 'supertest'
import { Game } from './interfaces/Game'

/*afterEach(() => {
    app.close()
})*/

describe('app', () => {
    it('listens on port 8000', (done) => {
        request(app)
            .get('/')
            .expect(200, done)
    })
})

describe('Game Engine API', () => {
    const bet = 10
    const choice = 'large'
    let playerWithBalance: string
    let playerWithoutBalance: string
    beforeEach(async () => {
        const createPlayerResponse = await request(app)
            .post('/players')
            .send({
                name: 'Teppo',
                balance: 100
            })
        playerWithBalance = createPlayerResponse.body.playerId
        const createPlayerWithoutBalanceResponse = await request(app)
            .post('/players')
            .send({
                name: 'Jaakko',
                balance: 0
            })
        playerWithoutBalance = createPlayerWithoutBalanceResponse.body.playerId
    })
    describe('POST /players /GET /players/:id', () => {
        it('create a player and check that details are correct', async () => {
            const createPlayerResponse = await request(app)
                .post('/players')
                .send({
                    name: 'Teppo',
                    balance: 100
                })
                .expect(200)
                .expect('Content-Type', /json/)
            const playerId = createPlayerResponse.body.playerId
            const getPlayerResponse = await request(app)
                .get(`/players/${playerId}`)
                .expect(200)
                .expect('Content-Type', /json/)
            const player = getPlayerResponse.body
            expect(player).toHaveProperty('id', playerId)
            expect(player).toHaveProperty('name', 'Teppo')
            expect(player).toHaveProperty('balance', 100)
        })
    })
    describe('POST /play', () => {
        it('start a game succesfully', async () => {
            const playResponse = await request(app)
                .post('/play')
                .send({
                    player_id: playerWithBalance,
                    bet,
                    choice
                })
                .expect(200)
                .expect('Content-Type', /json/)
            const body = playResponse.body
            if (body.win !== undefined) {
                expect(body).toMatchObject({
                    win: 20,
                    gameId: expect.any(String),
                    card: expect.any(Number)
                });
            } else if (body.message !== undefined) {
                expect(body).toMatchObject({
                    message: "Game lost"
                });
            } else {
                fail('Unexpected response body');
            }
        })
        it('no balance to start a game', async () => {
            const playResponse = await request(app)
                .post('/play')
                .send({
                    player_id: playerWithoutBalance,
                    bet,
                    choice
                })
                .expect(403)
                .expect('Content-Type', /json/)
            const msg = playResponse.body
            expect(msg).toHaveProperty('error', 'You dont have enough money to play')
        })
        it('player not found', async () => {
            await request(app)
                .post('/play')
                .send({
                    playerId: 123,
                    bet,
                    choice
                })
                .expect(500)
        })
    })
    /*describe('POST /games/continue', () => {
        beforeEach(async () => {
            const game: Game = {
                id: '1337',
                playerId: playerWithBalance,
                timestamp: new Date().toISOString(),
                bet,
                choice,
                card: 11,
                win: 20,
                profit: 10
            }
        })
    })*/
})