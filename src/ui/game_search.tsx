import * as React from "react";
import * as Database from "../database";
import { GameRow } from "./game_row";
import { Loader } from "./loader";
import { CentredContent } from "./global_components";
import styled from "styled-components";

type GameSearchProps = { start?: string }
type GameSearchState = {
    searchTerm: string,
    searchResults: Database.Game[],
    loading: boolean
}

const outPad = 50;
const SearchContainer = styled.div`
    width: calc(100% - ${outPad}px * 2);
    padding: ${outPad}px;
`;

const SearchInput = styled.input`
    background-color: white;

    width: calc(100% - 50px);
    font-size: 2.5rem;
    border: 0px solid transparent;
    border-radius: 10px;

    padding: 25px;
`

const ResultStatus = styled.h2`
    text-align: center;
    color: #666;
`

export class GameSearch extends React.Component<GameSearchProps, GameSearchState> {
    constructor(props: GameSearchProps) {
        super(props)
        this.state = { searchTerm: props.start || "", searchResults: [], loading: false }

        this.setSearchResults();
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
            return <ResultStatus />
        } else if (this.state.searchTerm.length < 3) {
            return <ResultStatus>Type at least 3 characters.</ResultStatus>
        } else {
            return this.state.searchResults.length == 0
                ? <ResultStatus>No results.</ResultStatus>
                : <div>{this.state.searchResults.map((game, i) =>
                    <GameRow game={game} key={i} />)}</div>
        }
    }

    render() {
        return (
            <div>
                <SearchContainer>
                    <form action="/" method="get" onSubmit={(e) => { e.preventDefault(); return false; }}>
                        <SearchInput
                            id="search-box"
                            name="search"
                            type="text"
                            value={this.state.searchTerm}
                            onChange={this.handleSearchTermChange.bind(this)}
                            placeholder="Type the name of a game" />
                    </form>
                </SearchContainer>
                <CentredContent>
                    { this.state.loading
                        ? <Loader />
                        : this.renderResults()}
                </CentredContent>
            </div>
        )
    }
}