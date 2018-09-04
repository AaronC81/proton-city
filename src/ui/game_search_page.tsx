import * as React from "react";
import { Header } from "./header";
import { GameSearch } from "./game_search";
import { HorizontalDivider } from "./global_components";
import styled from "styled-components";

const Footer = styled.div`
    font-size: 1.2rem;
    color: #333;
    margin: 20px;
`

const Break = styled.br`
    line-height: 2.5rem;
`

type GameSearchPageProps = { search?: string }
type GameSearchPageState = {}

export class GameSearchPage
    extends React.Component<GameSearchPageProps, GameSearchPageState> {
    render() {
        return (
            <div>
                <GameSearch start={this.props.search} />
                <HorizontalDivider />
                <Footer>
                    This web app uses data from /r/ProtonForSteam's <a href="https://docs.google.com/spreadsheets/d/1DcZZQ4HL_Ol969UbXJmFG8TzOHNnHoj8Q1f8DIFe8-8/edit">compatibility Google Sheet</a> and
                    presents it as a much more practical search engine.
                    <Break />
                    Games are scored from 5 to 0, with 5 being "Completely Stable" and 0 being "Won't Start".
                    <Break />
                    This was created by <a href="https://twitter.com/OrangeFlash81">Aaron Christiansen</a>.
                    <Break />
                </Footer>
            </div>
        )
    }
}
