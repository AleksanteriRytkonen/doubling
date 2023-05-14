HTTP Interface:
The HTTP interface between the game client and the game engine could consist of the following endpoints:
POST /players

Creates a new player with the given name and initial balance.
Request body: { "name": "player name", "balance": initial_balance }
Response body: { "id": "player id", "name": "player name", "balance": initial_balance }
GET /players/:id

Returns information about the player with the given id.
Response body: { "id": "player id", "name": "player name", "balance": current_balance }
POST /games

Starts a new game round with the given player, bet and choice.
Request body: { "playerId": "player id", "bet": bet_amount, "choice": "small" or "large" }
Response body: { "card": drawn_card, "win": true or false, "profit": profit_amount, "balance": new_balance }
POST /games/:id/continue

Continues the game round by doubling the bet and choosing a new card.
Response body: { "card": drawn_card, "win": true or false, "profit": profit_amount, "balance": new_balance }
POST /games/:id/withdraw

Withdraws the winnings and adds them to the player's balance.
Response body: { "balance": new_balance }