# Proton City
[http://proton.city/](http://proton.city/)

This is a web app which lets you look up the compatibility of various Steam
games when used with Proton on Linux.

It uses a dump of the /r/ProtonForSteam Google Sheet, imported into SQLite.

## Deployment
  1. Copy `server.js`, `package.json` and `docs` to your server.
  2. Create a new folder called `db`, and create a blank file inside called 
     `proton-city.db`.
  3. Obtain a Steam Web API key and put it in an environment variable called
     `PROTON_CITY_STEAM_KEY`.
  4. Put some random text in `PROTON_CITY_SESSION_SECRET` to encrypt sessions.
  5. To run a development server, run `node server.js`. Your server is hosted
     on port `8080`.
  6. To set up a more permanent server, follow [this guide](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04)
     which uses Nginx and PM2.

## Roadmap

  - [X] Basic per-game checking
  - [X] Steam login flow
  - [ ] Add new compatibility reports through a Google Form wrapper
  - [X] Show games not in database on search, so that one can make the first
        report for a game
  - [X] Search Steam library to recommend games with low number of reports
  - [X] Each game has its own page so it can be linked to

## Contributing
Just submit a pull request!