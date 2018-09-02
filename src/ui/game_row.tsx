import * as React from "react";
import * as Database from "../database";

type GameRowProps = { game: Database.Game, fixed?: boolean }
type GameRowState = { showingDetails: boolean } 

/**
 * A row representing a game, which displays its score. Can be clicked to 
 * toggle more details.
 */
export class GameRow extends React.Component<GameRowProps, GameRowState> {
    constructor(props: GameRowProps) {
        super(props)

        // If this is fixed, start it open, otherwise start it closed
        this.state = { showingDetails: props.fixed }
    }

    /**
     * Show details if they're hidden, or hide them if they're showing. Does
     * nothing if fixed.
     */
    toggleDetails() {
        if (this.props.fixed) return;

        this.setState({ showingDetails: !this.state.showingDetails });
    }

    /**
     * Renders the details portion of this row.
     */
    getDetails() {
        const game = this.props.game;
        return (
            <div>
                <div className="links">
                    <a href={ `/submit.html?id=${this.props.game.gameId}` }>
                        <b>Submit a report</b>
                    </a> | <a href={ game.storeLink }>
                        Steam Store page
                    </a> | <a href={ `/game.html?id=${this.props.game.gameId}` }>
                        Permalink
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
                                        { entry.graphicsVersion || "Unknown"},{" "}
                                        { entry.gameVersion || "Unknown" },{" "}
                                        { entry.protonVersion } Proton
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

    /**
     * A reference to the thumbnail image element.
     */
    thumbImg: HTMLImageElement;

    render() {
        const game = this.props.game
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
                                /* Show white on N/A */
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