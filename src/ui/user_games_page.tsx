import * as React from "react";
import { SteamUser } from "../steam_user";
import * as Database from "../database";
import { Loader } from "./loader";
import { GameRow } from "./game_row";
import { CentredContent } from "./global_components";
import styled from "styled-components";

const FilterPanel = styled.div`
    font-size: 1.4rem;
    padding: 20px;
`

const FilterSelect = styled.select`
    padding: 10px;
    border: 0 solid transparent;
    border-radius: 10px;
    font-size: 1.4rem;
`

type UserGamesPageProps = {};
type UserGamesPageState = {
    signedIn: boolean,
    couldGetGames: boolean,
    games: Database.Game[],
    sort: string,
    excludeNative: boolean
};

export class UserGamesPage
    extends React.Component<UserGamesPageProps, UserGamesPageState> {
    constructor(props: UserGamesPageProps) {
        super(props);
        this.state = {
            signedIn: null,
            couldGetGames: null,
            games: null,
            sort: "highest-rating-first",
            excludeNative: false
        };

        this.getGames();
    }

    /**
     * Gets games and set state when finished.
     */
    async getGames() {
        const info = await SteamUser.info();
        if (info == null) {
            this.setState({ signedIn: false });
            return;
        }
        const games = await SteamUser.ownedGames();
        if (games == null) {
            this.setState({ couldGetGames: false });
            return;
        }
        this.setState({ signedIn: true, couldGetGames: true, games });
    }

    /**
     * Fired when the <select> is changed to update state.sort.
     */
    updateSort(e: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({ sort: e.target.value });
    }

    /**
     * Fired when the 'Hide games with native Linux support' <input> is changed.
     */
    updateExcludeLinux(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ excludeNative: e.target.checked });
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
        if (this.state.games == null && this.state.signedIn == null) {
            return <Loader />;
        }
        if (!this.state.signedIn) {
            return <CentredContent>
                <h1>
                    You need to <a href="/steamauth/authenticate">sign in</a> first.
                </h1>
            </CentredContent>;
        }
        if (!this.state.couldGetGames) {
            return <CentredContent>
                <h1>
                    Couldn't get your games.
                </h1>
                <p>Try signing out and back in. Also, this may occur if your Steam profile is private.</p>
            </CentredContent>
        }

        return <div>
            <CentredContent>
                <FilterPanel>
                    Sort games by: <FilterSelect
                        onChange={this.updateSort.bind(this)}>
                        // TODO: A tad ugly on Firefox
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
                    </FilterSelect>
                    <br/>
                    <input type="checkbox" id="exclude-linux" onChange={this.updateExcludeLinux.bind(this)} />
                    <label htmlFor="exclude-linux">Hide games with native Linux support</label>
                </FilterPanel>
            {
                this.state.games
                    .sort(this.compareFunction.bind(this))
                    .filter(game => this.state.excludeNative
                        ? !game.hasLinuxVersion
                        : true)
                    .map((game, i) => <GameRow game={game} key={i} />)
            }
            </CentredContent>
        </div>;
    }
}