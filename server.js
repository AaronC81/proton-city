const express = require("express");
const request = require("request-promise-native");
const Database = require("better-sqlite3")

const app = express();
const db = new Database("db/proton-city.db");

/*
Schema:
DB.create_table? :entries do
  primary_key :id
  String :description
  String :distro
  String :hardware
  String :game_id
  String :native_version
  String :proton_version # TODO: Replace default
  String :game_version
  String :state
  String :user_steam_id
  DateTime :submission_time
end

DB.create_table? :sessions do
  primary_key :id
  String :steam_id
  String :session_token
end
*/

app.use(express.static('docs'));

app.get('/', (req, res) => {
    res.redirect("/index.html");
});

async function gameById(id) {
    const target_uri =
        `https://store.steampowered.com/api/appdetails?appids=${id}`
    const result = await request.get(target_uri);
    const json = JSON.parse(result);
    const entries = getEntries(id);

    const data = json[id].data;

    return {
        game_name: data.name,
        game_id: data.steam_appid,
        game_image:
            `https://steamcdn-a.akamaihd.net/steam/apps/${data.steam_appid}/header.jpg`,
        store_link:
            `https://store.steampowered.com/app/${data.steam_appid}/`,
        entries: entries
    };
}

async function gameSearch(term) {
    const target_uri =
        `https://store.steampowered.com/api/storesearch/?term=${term}`
    const result = await request.get(target_uri);
    const json = JSON.parse(result);

    return json.items.map(x => ({
        game_name: x.name,
        game_id: x.id,
        game_image:
            `https://steamcdn-a.akamaihd.net/steam/apps/${x.id}/header.jpg`,
        store_link:
            `https://store.steampowered.com/app/${x.id}/`
    }));
}

function getEntries(gameId) {
    const stmt =
        db.prepare("SELECT * FROM entries WHERE game_id=?");
    return stmt.all(gameId.toString());
}

app.get('/api/games/search/:term', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    gameSearch(req.params.term).then(games =>
        res.send(JSON.stringify(games)));
});

app.get('/api/games/search/:term/with_entries', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    gameSearch(req.params.term).then(games =>
        res.send(JSON.stringify(games.map(game => {
            return {...game, ...{ entries: getEntries(game.game_id) }}
        })))
    );
});

app.get('/api/games/:id', (req, res) => {
    gameById(parseInt(req.params.id)).then(game =>
        res.send(JSON.stringify(game)));
})

app.get('/api/games/:id/entries', (req, res) => {
    getEntries(req.params.id, rows => res.send(JSON.stringify(rows)));
});

app.listen("8080", "0.0.0.0")
