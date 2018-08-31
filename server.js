const express = require("express");
const request = require("request-promise-native");
const Database = require("better-sqlite3");
const steam = require("steam-login");

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
*/

app.use(express.static('docs'));
app.use(require('express-session')(
    {
        resave: false,
        saveUninitialized: false,
        secret: process.env.PROTON_CITY_SESSION_SECRET
    }
));
app.use(steam.middleware({
	realm: 'http://localhost:8080/', 
    verify: 'http://localhost:8080/steamauth/verify',
	apiKey: process.env.PROTON_CITY_STEAM_KEY
}));

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

/**
 * Express middleware which returns a JSON error response if the route throws.
 */
function apiSafe(req, res, next) {
    try {
        next();
    } catch (e) {
        res.send({ 
            errorMessage: e.message
        });
    }
}

app.get('/api/games/search/:term', apiSafe, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    gameSearch(req.params.term).then(games =>
        res.send(JSON.stringify(games)));
});

app.get('/api/games/search/:term/with_entries', apiSafe, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    gameSearch(req.params.term).then(games =>
        res.send(JSON.stringify(games.map(game => {
            return {...game, ...{ entries: getEntries(game.game_id) }}
        })))
    );
});

app.get('/api/games/:id', apiSafe, (req, res) => {
    gameById(parseInt(req.params.id)).then(game =>
        res.send(JSON.stringify(game)));
})

app.get('/api/games/:id/entries', apiSafe, (req, res) => {
    getEntries(req.params.id, rows => res.send(JSON.stringify(rows)));
});

app.get('/steamauth/info', steam.enforceLogin('/steamauth/invalid'), (req, res) => {
    res.send(req.user)
})

app.get('/steamauth/authenticate', steam.authenticate(), (req, res) => {
    res.redirect("/");
});

app.get('/steamauth/verify', steam.verify(), (req, res) => {
    res.redirect("/");
});

app.get('/steamauth/logout', steam.enforceLogin('/'), (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/steamauth/invalid', (req, res) => {
    res.status(401).send("Unauthorized");
});

app.listen("8080", "0.0.0.0")
