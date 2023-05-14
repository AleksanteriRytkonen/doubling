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
const index_1 = __importDefault(require("./index"));
const supertest_1 = __importDefault(require("supertest"));
/*afterEach(() => {
    app.close()
})*/
describe('app', () => {
    it('listens on port 8000', (done) => {
        (0, supertest_1.default)(index_1.default)
            .get('/')
            .expect(200, done);
    });
});
describe('Game Engine API', () => {
    const bet = 10;
    const choice = 'large';
    let playerWithBalance;
    let playerWithoutBalance;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const createPlayerResponse = yield (0, supertest_1.default)(index_1.default)
            .post('/players')
            .send({
            name: 'Teppo',
            balance: 100
        });
        playerWithBalance = createPlayerResponse.body.playerId;
        const createPlayerWithoutBalanceResponse = yield (0, supertest_1.default)(index_1.default)
            .post('/players')
            .send({
            name: 'Jaakko',
            balance: 0
        });
        playerWithoutBalance = createPlayerWithoutBalanceResponse.body.playerId;
    }));
    describe('POST /players /GET /players/:id', () => {
        it('create a player and check that details are correct', () => __awaiter(void 0, void 0, void 0, function* () {
            const createPlayerResponse = yield (0, supertest_1.default)(index_1.default)
                .post('/players')
                .send({
                name: 'Teppo',
                balance: 100
            })
                .expect(200)
                .expect('Content-Type', /json/);
            const playerId = createPlayerResponse.body.playerId;
            const getPlayerResponse = yield (0, supertest_1.default)(index_1.default)
                .get(`/players/${playerId}`)
                .expect(200)
                .expect('Content-Type', /json/);
            const player = getPlayerResponse.body;
            expect(player).toHaveProperty('id', playerId);
            expect(player).toHaveProperty('name', 'Teppo');
            expect(player).toHaveProperty('balance', 100);
        }));
    });
    describe('POST /play', () => {
        it('start a game succesfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const playResponse = yield (0, supertest_1.default)(index_1.default)
                .post('/play')
                .send({
                player_id: playerWithBalance,
                bet,
                choice
            })
                .expect(200)
                .expect('Content-Type', /json/);
            const body = playResponse.body;
            if (body.win !== undefined) {
                expect(body).toMatchObject({
                    win: 20,
                    gameId: expect.any(String),
                    card: expect.any(Number)
                });
            }
            else if (body.message !== undefined) {
                expect(body).toMatchObject({
                    message: "Game lost"
                });
            }
            else {
                fail('Unexpected response body');
            }
        }));
        it('no balance to start a game', () => __awaiter(void 0, void 0, void 0, function* () {
            const playResponse = yield (0, supertest_1.default)(index_1.default)
                .post('/play')
                .send({
                player_id: playerWithoutBalance,
                bet,
                choice
            })
                .expect(403)
                .expect('Content-Type', /json/);
            const msg = playResponse.body;
            expect(msg).toHaveProperty('error', 'You dont have enough money to play');
        }));
        it('player not found', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(index_1.default)
                .post('/play')
                .send({
                playerId: 123,
                bet,
                choice
            })
                .expect(500);
        }));
    });
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
});
