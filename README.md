# Proton City
[http://proton.city/](proton.city)

This is a web app which lets you look up the compatibility of various Steam
games when used with Proton on Windows.

It uses a dump of the /r/ProtonForSteam Google Sheet, imported into Firebase.

## Building
Make sure you've `npm install`ed, then run `sh build.sh`. The generated site 
is in `docs`.

## Roadmap

  - [X] Basic per-game checking
  - [ ] Steam login flow
  - [ ] Add new compatibility reports (via Steam login)
  - [ ] Show games not in Firebase on search, so that one can make the first
        report for a game
  - [ ] Search Steam library to recommend games with low number of reports
  - [ ] Each game has its own page so it can be linked to
