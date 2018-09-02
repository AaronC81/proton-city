import * as React from "react";
import { Header } from "./header";
import { GameSearch } from "./game_search";

type GameSearchPageProps = {}
type GameSearchPageState = {}

export class GameSearchPage
    extends React.Component<GameSearchPageProps, GameSearchPageState> {
    render() {
        return (
            <div>
                <GameSearch />
                <hr id="separator" />
                <div id="footer">
                    This web app uses data from /r/ProtonForSteam's <a href="https://docs.google.com/spreadsheets/d/1DcZZQ4HL_Ol969UbXJmFG8TzOHNnHoj8Q1f8DIFe8-8/edit">compatibility Google Sheet</a> and
                    presents it as a much more practical search engine.
                    <br />
                    Games are scored from 5 to 0, with 5 being "Completely Stable" and 0 being "Won't Start".
                    <br />
                    This was created by <a href="https://twitter.com/OrangeFlash81">Aaron Christiansen</a>.
                    <br />
                </div>
            </div>
        )
    }
}
