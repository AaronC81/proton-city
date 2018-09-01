import * as React from "react";
import { SteamUser } from "../steam_user";
import * as Database from "../database";
import { Loader } from "./loader";
import { GameRow } from "./game_row";

type UserGamesProps = {};
type UserGamesState = { signedIn: boolean, games: Database.Game[] };

export class UserGames extends React.Component<UserGamesProps, UserGamesState> {
    constructor(props: UserGamesProps) {
        super(props);
        this.state = { signedIn: null, games: null };
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

    render() {
        // TODO: Make this better
        if (this.state.games == null && this.state.signedIn == null) {
            return <Loader />;
        }
        if (!this.state.signedIn) {
            return <h1>You aren't signed in!</h1>;
        }

        return <div>
            {
                this.state.games.map((game, i) => <GameRow game={game} key={i} />)
            }
        </div>;
    }
}