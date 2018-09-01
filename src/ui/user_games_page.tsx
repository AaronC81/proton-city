import * as React from "react";
import { SteamUser } from "../steam_user";
import * as Database from "../database";
import { Loader } from "./loader";
import { GameRow } from "./game_row";

type UserGamesPageProps = {};
type UserGamesPageState = {
    signedIn: boolean,
    games: Database.Game[],
    sort: string
};

export class UserGamesPage
    extends React.Component<UserGamesPageProps, UserGamesPageState> {
    constructor(props: UserGamesPageProps) {
        super(props);
        this.state = {
            signedIn: null,
            games: null,
            sort: "highest-rating-first"
        };

        this.getGames();
    }

    /**
     * Gets games and set state when finished.
     */
    async getGames() {
        const games = await SteamUser.ownedGames();
        if (games == null) {
            this.setState({ signedIn: false });
            return;
        }
        this.setState({ signedIn: true, games });
    }

    /**
     * Fired when the <select> is changed to update state.sort.
     */
    updateSort(e: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({ sort: e.target.value });
    }

    /**
     * An Array.prototype.sort compare function which uses an appropriate
     * comparison method based on state.sort.
     */
    compareFunction(a: Database.Game, b: Database.Game): number {
        switch (this.state.sort) {
            case "highest-rating-first":
                return Math.sign((b.averageStateScore || 0) - (a.averageStateScore || 0));
            case "lowest-rating-first":
                return Math.sign((a.averageStateScore || 0) - (b.averageStateScore || 0));
            case "highest-entries-first":
                return Math.sign(b.entries.length - a.entries.length);
            case "lowest-entries-first":
                return Math.sign(a.entries.length - b.entries.length);
            default:
                return 0;       
        }
    }

    render() {
        // TODO: Make this better
        if (this.state.games == null && this.state.signedIn == null) {
            return <Loader />;
        }
        if (!this.state.signedIn) {
            return <h1>You aren't signed in!</h1>;
        }

        return <div>
            <div id="results">
                <div id="sort-selector" style={{ fontSize: "1.4rem", padding: "20px" }}>
                    Sort games by: <select
                        onChange={this.updateSort.bind(this)}
                        // TODO: A tad ugly on Firefox
                        style={{
                            padding: "10px",
                            border: "0 solid transparent",
                            borderRadius: "10px",
                            fontSize: "1.4rem"
                        }}>
                        <option value="highest-rating-first">
                            ones which work well (highest rating first)
                        </option>
                        <option value="highest-entries-first">
                            ones which are well tested (most entries first)
                        </option>
                        <option value="lowest-entries-first">
                            ones I should test (fewest entries first)
                        </option>
                        <option value="lowest-rating-first">
                            ones I should try to fix (lowest rating first)
                        </option>
                    </select>
                </div>
            {
                this.state.games
                    .sort(this.compareFunction.bind(this))
                    .map((game, i) => <GameRow game={game} key={i} />)
            }
            </div>
        </div>;
    }
}