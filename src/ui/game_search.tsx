import * as React from "react";
import * as Database from "../database";
import { GameRow } from "./game_row";
import { Loader } from "./loader";

type GameSearchProps = {}
type GameSearchState = {
    searchTerm: string,
    searchResults: Database.Game[],
    loading: boolean
}

export class GameSearch extends React.Component<GameSearchProps, GameSearchState> {
    constructor(props: GameSearchProps) {
        super(props)
        this.state = { searchTerm: "", searchResults: [], loading: false }
    }

    handleSearchTermChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ searchTerm: event.target.value, loading: true }, () => {
            this.setSearchResults();    
        })
    }

    async setSearchResults() {
        if (this.state.searchTerm.length < 3) {
            this.setState({ loading: false });
            return;
        }
        const searchResults = await Database.gameSearch(this.state.searchTerm);
        this.setState({ searchResults, loading: false });
    }

    renderResults(): JSX.Element {
        if (this.state.searchTerm.length == 0) {
            return <h2 className="info"></h2>
        } else if (this.state.searchTerm.length < 3) {
            return <h2 className="info">Type at least 3 characters.</h2>
        } else {
            return this.state.searchResults.length == 0
                ? <h2 className="info">No results.</h2>
                : <div>{this.state.searchResults.map((game, i) =>
                    <GameRow game={game} key={i} />)}</div>
        }
    }

    render() {
        return (
            <div>
                <div id="search-box-container">
                    <input
                        id="search-box"
                        type="text"
                        value={this.state.searchTerm}
                        onChange={this.handleSearchTermChange.bind(this)}
                        placeholder="Type the name of a game" />
                </div>
                <div id="results">
                    { this.state.loading
                        ? <Loader />
                        : this.renderResults()}
                </div>
            </div>
        )
    }
}