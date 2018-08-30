import * as Database from "./database"
import * as React from "react"

type AppProps = {}
type AppState = {}

export class App extends React.Component<AppProps, AppState> {
    render() {
        return (
            <div>
                <div id="header">
                    <h1>Proton City</h1>
                    <div id="nav">
                        <a href="/">Search</a> | <a href="https://github.com/OrangeFlash81/proton-city">GitHub</a>
                    </div>
                </div>
                <GameSearch />
                <hr id="separator" />
                <div id="footer">
                    This web app uses a data dump of /r/ProtonForSteam's <a href="https://docs.google.com/spreadsheets/d/1DcZZQ4HL_Ol969UbXJmFG8TzOHNnHoj8Q1f8DIFe8-8/edit">compatibility Google Sheet</a> and
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

type GameSearchProps = {}
type GameSearchState = {
    searchTerm: string,
    searchResults: Database.Game[],
    loading: boolean
}

class GameSearch extends React.Component<GameSearchProps, GameSearchState> {
    constructor(props: GameSearchProps) {
        super(props)
        this.state = { searchTerm: "", searchResults: [], loading: false }
    }

    handleSearchTermChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ searchTerm: event.target.value, loading: true });
        this.setSearchResults();
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
                        ? <h2 className="info">Loading...</h2>
                        : this.renderResults()}
                </div>
            </div>
        )
    }
}

type GameRowProps = { game: Database.Game }
type GameRowState = { showingDetails: boolean } 

class GameRow extends React.Component<GameRowProps, GameRowState> {
    constructor(props: GameRowProps) {
        super(props)
        this.state = { showingDetails: false }
    }

    toggleDetails() {
        this.setState({ showingDetails: !this.state.showingDetails })
    }

    getDetails() {
        const game = this.props.game
        return (
            <div>
                <div className="links">
                    <a href={ game.storeLink }>
                        Steam Store page
                    </a>
                </div>
                <table>
                    <thead>
                        <tr>
                            <td>State</td>
                            <td>Description</td>
                            <td>Distro</td>
                            <td>Versions</td>
                            <td>Hardware</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            game.entries.reverse().map((entry, i) =>
                                <tr key={i}>
                                    <td><b>{ entry.state }</b></td>
                                    <td>{ entry.description }</td>
                                    <td>{ entry.distro }</td>
                                    <td>
                                        { entry.drivers }, { entry.gameVersion || "Unknown" }, { entry.protonVersion } Proton
                                    </td>
                                    <td>{ entry.hardware }</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>   
            </div>
        )
    }

    thumbImg: HTMLImageElement

    render() {
        const game = this.props.game
        console.log(game)
        return (
            <div className="game-box">
                <div className="game-row" onClick={this.toggleDetails.bind(this)}>
                    <div className="game-row-info">
                        <img
                            src={ game.gameImage }
                            ref={x => this.thumbImg = x} 
                            onError={
                                // Show a different image on load error
                                () => {
                                    if (this.thumbImg.src != "img/nothumb.jpg") {
                                        this.thumbImg.src = "img/nothumb.jpg"
                                    }
                                }
                            }
                            alt="Thumbnail" /> 
                        <h2>{ game.gameName }</h2>
                    </div>
                    <div className="game-row-score"
                        style={
                            {
                                backgroundColor: isNaN(game.averageStateScore)
                                    ? "white"
                                    : game.averageStateColor
                            }
                        }>
                        <div className="hero">
                            { isNaN(game.averageStateScore)
                                 ? "N/A" : game.averageStateScore }
                        </div>
                        { game.entries.length } entries
                    </div>
                </div>
                <div className="game-details">
                    {this.state.showingDetails ? this.getDetails() : <div />}
                </div>
            </div>
        )
    }
}