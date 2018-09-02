import * as React from "react"
import { Account } from "./account"

type HeaderProps = {}
type HeaderState = {}

/**
 * The entire app's header and navigation.
 */
export class Header extends React.Component<HeaderProps, HeaderState> {
    render() {
        return <div id="header" style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between"
            }}>
            <div>
                <h1>Proton City</h1>
                <div id="nav">
                    <a href="/">Search</a>
                    &nbsp;| <a href="/user_games.html"><b>NEW!</b> My Games</a> 
                    &nbsp;| <a href="https://addons.mozilla.org/en-GB/firefox/addon/proton-city/"><b>NEW!</b> Firefox Extension</a>
                    &nbsp;| <a href="https://github.com/OrangeFlash81/proton-city">GitHub</a>
                </div>
            </div>
            <div>
                <Account />
            </div>
        </div>
    }
}