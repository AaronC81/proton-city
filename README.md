# Proton City
[http://proton.city/](http://proton.city/)

This is a web app which lets you look up the compatibility of various Steam
games when used with Proton on Linux.

It uses a dump of the /r/ProtonForSteam Google Sheet, imported into SQLite.

## Deployment
  1. Run `npm install` to generate the `node_modules` directory. I've used Node 10.9 for development.
  2. Run `sh build.sh` to generate the `docs` directory.
  3. Copy `server.js`, `package.json` and `docs` to your server.
  4. Obtain a Steam Web API key and put it in an environment variable called
     `PROTON_CITY_STEAM_KEY`.
  5. Put some random text in `PROTON_CITY_SESSION_SECRET` to encrypt sessions.
  6. To run a development server, run `node server.js`. Your server is hosted
     on port `8080`.
  7. To set up a more permanent server, follow [this guide](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04)
     which uses Nginx and PM2.

## Contributing
Just submit a pull request!