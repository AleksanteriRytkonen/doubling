const request = require('supertest')
import app from './index'

describe('Eka testi', () => {
    describe('POST /api/players', () => {
        it('should create a new player', async () => {
            const response = await request(app)
                .post('/api/players')
                .send({
                    name: 'Allu',
                    balance: 100
                })
            console.log(response)
        })
    })
})