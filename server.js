const express = require("express");
const request = require("request-promise-native");
const Database = require("better-sqlite3");
const steam = require("steam-login");

const app = express();
require('express-async-await')(app);

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

app.use(require('body-parser').json());
app.use(express.static('docs'));
app.use(require('express-session')(
    {
        resave: false,
        saveUninitialized: false,
        secret: process.env.PROTON_CITY_SESSION_SECRET
    }
));
// TODO: Detect realm somehow?
app.use(steam.middleware({
	realm: 'https://proton.city/', 
    verify: 'https://proton.city/steamauth/verify',
	apiKey: process.env.PROTON_CITY_STEAM_KEY
}));

app.get('/', (req, res) => {
    res.redirect("/index.html");
});

// Middleware for API routes.
function api(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    next();
}

async function gameById(id) {
    const target_uri =
        `https://store.steampowered.com/api/appdetails?appids=${id}`
    const result = await request.get(target_uri);
    const json = JSON.parse(result);

    return Object.keys(json).map(key => {
        data = json[key].data;
        if (data == undefined) return null;
        return {
            game_name: data.name,
            game_id: data.steam_appid,
            game_image:
                `https://steamcdn-a.akamaihd.net/steam/apps/${data.steam_appid}/header.jpg`,
            store_link:
                `https://store.steampowered.com/app/${data.steam_appid}/`,
            entries: getEntries(key)
        };
    })[0];
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

app.get('/api/games/search/:term', api, async (req, res) => {
    const games = await gameSearch(req.params.term);
    res.send(games);
});

app.get('/api/games/search/:term/with_entries', api, async (req, res) => {
    const games = await gameSearch(req.params.term);
    res.send(games.map(game => {
        return {...game, ...{ entries: getEntries(game.game_id) }}
    }));
});

app.get('/api/games/:id', api, async (req, res) => {
    const game = await gameById(parseInt(req.params.id));
    res.send(game);
});

app.get('/api/games/:id/entries', api, async (req, res) => {
    res.send(getEntries(req.params.id));
});

app.get('/api/user/owned', api, steam.enforceLogin('/api/user/none'), async (req, res) => {
    const url = "http://api.steampowered.com/IPlayerService/GetOwnedGames" +
        `/v0001/?key=${process.env.PROTON_CITY_STEAM_KEY}` +
        `&steamid=${req.user.steamid}` +
        "&format=json"

    const ownedGamesRaw = await request.get(url);
    const ownedGames = JSON.parse(ownedGamesRaw);
    const ownedGameIds = Object.keys(ownedGames.response.games)
        .map(key => ownedGames.response.games[key].appid);

    console.log(ownedGameIds);
    const gamesInfo = await Promise.all(
        ownedGameIds.map(gameById)
    );

    res.send(gamesInfo.filter(x => x != null));
});

app.get('/api/user/info', api, steam.enforceLogin('/api/user/none'), (req, res) => {
    res.send(req.user);
});

app.get('/api/user/none', api, (req, res) => {
    throw new Error("Not authenticated");
})
// EXPERIMENTAL. Not indented as an endpoint for actual use.
app.post('/api/formsubmit', api, steam.enforceLogin('/steamauth/authenticate'),
    async (req, res) => {
        const jsonBody = req.body;
        const gameId = jsonBody.game_id
        const gameInfo = await gameById(gameId);

        // Map actual data to Google Forms fields
        const formData = {
            "entry.1749841339": gameId,
            "entry.1362798785": gameInfo.game_name,
            "entry.1093685090": jsonBody.distro,
            "entry.838626445": jsonBody.graphics_version,
            "entry.1860993042": jsonBody.hardware,
            "entry.325314142": jsonBody.state,
            "entry.555963429": jsonBody.description,
            "entry.52236258": jsonBody.game_version,
            "entry.477478923": jsonBody.proton_version
        };

        const result = await request.post("https://docs.google.com/forms/d/e/" +
            "1FAIpQLSeefaYQduMST_lg0IsYxZko8tHLKe2vtVZLFaPNycyhY4bidQ/" +
            "formResponse", { formData });
        
        res.send({});
    }
);

app.get('/steamauth/info', steam.enforceLogin('/steamauth/invalid'), (req, res) => {
    res.send(req.user);
});

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

// Error handler for API routes.
app.use('/api', (err, req, res, next) => {
    res.status(500).send({ 
        error_message: err.message
    });
});

app.listen("8080", "0.0.0.0")
