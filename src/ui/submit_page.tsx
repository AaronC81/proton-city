import * as React from "react";
import * as Database from "../database";
import * as $ from "jquery";
import { Loader } from "./loader";
import styled, { css } from "styled-components";
import { CentredContent } from "./global_components";

const Form = styled.form`
    font-size: 1.2rem;
    padding-top: 20px;
`

const styles = css`
    background-color: white;
    width: 100%;
    border: 0 solid transparent;
    border-radius: 10px;
    margin-bottom: 20px;
    padding-top: 5px;
    padding-bottom: 5px;
    font-size: 1.2rem;
`

const Select = styled.select`${styles}`
const Input = styled.input`${styles}`

const SubmitButton = styled.button`
    width: 100%;
    padding: 10px;
    background-color: #4286f4;
    color: white;
    cursor: pointer;
    font-size: 1.2rem;
    font-weight: bold;
    border: 0 solid transparent;
    border-radius: 10px;
`

type SubmitPageProps = { id: string };
type SubmitPageState = {
    gameInfo: Database.Game,
    submission: "pending" | "success" | "failure"
};

/**
 * A page where the user can submit new game reports.
 */
export class SubmitPage
    extends React.Component<SubmitPageProps, SubmitPageState> {
    constructor(props: SubmitPageProps) {
        super(props);
        this.state = { gameInfo: null, submission: null };
        this.getGameInfo();
    }

    /**
     * Gets game info and sets state.
     */
    async getGameInfo() {
        const gameInfo = await Database.gameById(this.props.id);
        this.setState({ gameInfo });
    }

    /**
     * Gets the name of the name, or null if it hasn't been obtained yet.
     */
    gameName() {
        if (this.state.gameInfo) {
            return this.state.gameInfo.gameName;
        } else {
            return null;
        }
    }

    /**
     * Called to submit the form.
     * TODO: We should probably actually do something on success/fail
     */
    submit(event: React.FormEvent) {
        event.preventDefault();

        this.setState({ submission: "pending" });

        const body: { [id: string]: string } = {};
        ["game_id", "state", "distro", "hardware", "description",
            "driver_version", "proton_version", "game_version"].forEach(x => {
            body[x] = $(`[name=${x}]`).val().toString();
        });

        $.ajax({
            url: "/api/formsubmit",
            type: "POST",
            data: JSON.stringify(body),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).then(() => {
            this.setState({ submission: "success" });
        }).catch(() => {
            this.setState({ submission: "failure" });
        });
        
        return false;
    }

    /**
     * Render either the form or a result screen depending on state.submission.
     */
    renderBody() {
        switch (this.state.submission) {
            case null: return this.renderForm();
            case "pending": return <Loader />;
            case "success": return <div>
                <h1>Submitted</h1>
                <b>Your report has been recorded and should appear in a few hours.</b>
            </div>;
            case "failure": return <div>
                <h1>Failure</h1>
                <b>Something went wrong submitting your report.</b><br/>
                <p>This is probably a bug. Please file a GitHub issue.</p>
            </div>;
        }
    }

    /**
     * The form used for submissions.
     */
    renderForm() {
        // TODO: Clientside validation (Sheets handles serverside)
        // TODO: Save hardware, distro and drivers to localstorage
        return <Form
            onSubmit={this.submit.bind(this)}>
            <input
                type="hidden"
                name="game_id"
                value={ this.state.gameInfo.gameId } />
            
            <label htmlFor="state">State:</label>
            <Select name="state">
                <option value="Completely Stable">
                    Completely Stable - runs flawlessly
                </option>
                <option value="Stable">
                    Stable - runs mostly fine, with a slightly reduced framerate or other minor issues 
                </option>
                <option value="Unstable">
                    Unstable - noticeable issues but is still playable
                </option>
                <option value="Unplayable">
                    Unplayable - too many issues to enjoy the game
                </option>
                <option value="Crashes">
                    Crashes - gameplay is interrupted by fatal errors
                </option>
                <option value="Won't Start">
                    Won't Start - can't get into the menu
                </option>
            </Select>

            <label htmlFor="description">Description: </label><br/>
            <small>Talk briefly about your experience and any workarounds.</small>
            <Input type="text" name="description" />

            <label htmlFor="hardware">Hardware: </label>
            <Input
                type="text"
                name="hardware"
                placeholder="Intel Core i7-7700HQ / GTX 1050 Ti Max-Q" />

            <label htmlFor="distro">Distro: </label>
            <Input
                type="text"
                name="distro"
                placeholder="Ubuntu 16.04 (Kernel 4.18.5)" />

            <label htmlFor="driver_version">Driver version: </label>
            <Input
                type="text"
                name="driver_version"
                placeholder="Nvidia 390" />

            <label htmlFor="proton_version">Proton version: </label>
            <Input
                type="text"
                name="proton_version"
                placeholder="3.7 Beta" />

            <label htmlFor="game_version">Game version: </label>
            <Input
                type="text"
                name="game_version" />

            <SubmitButton>Submit</SubmitButton>
        </Form>;
    }

    render() {
        return <CentredContent>
            <h1>Submit report for { this.gameName() || "..." }</h1>
            <b>
                NOTE: Reports are currently subject to a manual review process
                conducted outside of Proton City. Hopefully a fully automated
                process will be implemented in future, but for now it'll take a
                few hours for your report to appear. Thank you for your
                understanding.
            </b>
            {  
                this.state.gameInfo != null
                    ? this.renderBody()
                    : <Loader />
            }
        </CentredContent>;
    }
}