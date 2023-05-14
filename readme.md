- **Ajaaksesi projekti**
1. Kloonaa projekti
2. asenna node.js v.18.16.0
3. npm install
- **Testien suorittaminen**
  - npm run test
- **Sovelluksen ajaminen**
  - npm run dev

**Rajapinnat**
### POST /players
    Luo uuden pelaajan
    Ottaa bodyn parametreinä objektin mallia { "name": "Teppo", "balance": 100 }
    antaa vastauksena pelaajalle generoidun id:n esim { "playerId": "5baa020b-87c9-4288-b052-e2730fb60ab9" }
### GET /players/:id
    Hakee pelaajan tiedot id:n perusteella
    Palauttaa vastauksessa seuraavan kaltaisen
    {
        "id": "5baa020b-87c9-4288-b052-e2730fb60ab9",
        "name": "Teppo",
        "balance": 100
    }
### POST /play
    Aloittaa uuden pelin
    ottaa parametreina objektin, joka sisältää pelaaja id:n, panoksen ja valinnan small vai large
    {
        "player_id": "5baa020b-87c9-4288-b052-e2730fb60ab9",
        "bet": 5,
        "choice": "large"
    }
    Jos peli voitettiin palauttaa vastauksena voiton suurude, arvotun kortin ja pelin id:n
    {
        "win": 10,
        "card": 12,
        "gameId": "3fb2da59-c43f-437d-8532-20f510831fb6"
    }
    Jos taas peli hävittiin palauttaa vastauksena viestin
    {
        "message": "Game lost"
    }
### POST /games/continue
    Jos pelaaja voitti ja haluaa jatkaa tuplaamista, voi niin tehdä kutsumalla tätä rajapintaa peli id:llä ja small/large valinnalla
    {
        "id": "f5757bfe-3ca6-4f08-8767-123d6a370d68",
        "choice": "small"
    }
    Jos peli voitetaan palautuu seuraavanlainen viesti
    {
        "message": "Game won",
        "game": {
            "id": "f5757bfe-3ca6-4f08-8767-123d6a370d68",
            "player_id": "5baa020b-87c9-4288-b052-e2730fb60ab9",
            "timestamp": "2023-05-14T20:22:38.703Z",
            "bet": 5,
            "choice": "large",
            "card": 9,
            "win": 20,
            "profit": 15
        }
    }
    Jos taas peli hävitään palautuu
    {
        "message": "Game lost"
    }
    Jos pelaaja yrittää pelata jo valmiiksi hävityn pelin id:llä palautuu seuraava viesti
    {
        "message": "Cant continue a lost game"
    }
### POST /withdraw
    Kotiuttakseen voitot pitää kutsua tätä rajapintaa pelin id:llä
    {
        "id": "f5757bfe-3ca6-4f08-8767-123d6a370d68"
    }
    ja se palauttaa vastauksena pelitilin saldon palautuksen jälkeen
    {
        "balance": 60
    }