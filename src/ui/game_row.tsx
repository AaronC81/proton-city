import * as React from "react";
import * as Database from "../database";
import styled from "styled-components";

const GameRowOuter = styled.div`
    background-color: white;
    margin: 10px;
    border: 1px solid gray;
    border-radius: 5px;
    box-shadow: gray 3px 3px 3px;
`

const GameRowMain = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    cursor: pointer;

    @media only screen and (max-width: 480px) {
        flex-direction: column;
    }
`

const GameRowInfo = styled.div`
    display: flex;
    flex-direction: row;
`

const GameRowThumbImage = styled.img`
    height: 100px;
`

const GameRowGameName = styled.h2`
    padding: 10px;
`

const GameRowScorePanel = styled.div`
    text-align: center;
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    min-width: 150px;
`

const GameRowAverageScore = styled.div`
    font-size: 2rem;
`

const GameDetailsLinks = styled.div`
    padding: 10px;
`

const GameDetailsTable = styled.table`
    width: 100%;

    border: 1px solid gray;
    border-collapse: collapse;
    padding: 5px;

    & td, tr {
        border: 1px solid gray;
        border-collapse: collapse;
        padding: 5px;
    }
`

const GameDetailsTableHead = styled.thead`
    font-weight: bold;
`

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
                <GameDetailsLinks>
                    <a href={ `/submit.html?id=${this.props.game.gameId}` }>
                        <b>Submit a report</b>
                    </a> | <a href={ game.storeLink }>
                        Steam Store page
                    </a> | <a href={ `/game.html?id=${this.props.game.gameId}` }>
                        Permalink
                    </a> 
                </GameDetailsLinks>
                <GameDetailsTable>
                    <GameDetailsTableHead>
                        <tr>
                            <td>State</td>
                            <td>Description</td>
                            <td>Distro</td>
                            <td>Versions</td>
                            <td>Hardware</td>
                        </tr>
                    </GameDetailsTableHead>
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
                </GameDetailsTable>   
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
            <GameRowOuter>
                <GameRowMain onClick={this.toggleDetails.bind(this)}>
                    <GameRowInfo>
                        <GameRowThumbImage
                            src={ game.gameImage }
                            ref={(x: any) => this.thumbImg = x} 
                            onError={
                                // Show a different image on load error
                                () => {
                                    if (this.thumbImg.src != "img/nothumb.jpg") {
                                        this.thumbImg.src = "img/nothumb.jpg"
                                    }
                                }
                            }
                            alt="Thumbnail" /> 
                        <GameRowGameName>{ game.gameName }</GameRowGameName>
                    </GameRowInfo>
                    <GameRowScorePanel
                        style={
                            {
                                /* Show white on N/A */
                                backgroundColor: isNaN(game.averageStateScore)
                                    ? "white"
                                    : game.averageStateColor
                            }
                        }>
                        <GameRowAverageScore>
                            { isNaN(game.averageStateScore)
                                 ? "N/A" : game.averageStateScore }
                        </GameRowAverageScore>
                        { game.entries.length } entries
                    </GameRowScorePanel>
                </GameRowMain>
                <div>
                    {this.state.showingDetails ? this.getDetails() : <div />}
                </div>
            </GameRowOuter>
        )
    }
}