import * as React from "react"
import { Account } from "./account"

type HeaderProps = {}
type HeaderState = {}

/**
 * The entire app's header and navigation.
 */
export class Header extends React.Component<HeaderProps, HeaderState> {
    render() {
        return <div style={{
                width: "100%",
                backgroundImage: "url(/img/bg.png)",
                backgroundSize: "cover",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            }}>
            <div style={{ padding: "20px" }}>
                <span style={{
                    color: "black",
                    fontWeight: "bold",
                    paddingRight: "20px"
                }}>Proton City</span>
                <span>
                    <a href="/">Home</a>
                    &nbsp;| <a href="/user_games.html"><b>NEW!</b> My Games</a> 
                    &nbsp;| <a href="https://addons.mozilla.org/en-GB/firefox/addon/proton-city/"><b>NEW!</b> Firefox Extension</a>
                    &nbsp;| <a href="https://github.com/OrangeFlash81/proton-city">GitHub</a>
                </span>
            </div>
            <div style={{ padding: "20px" }}>
                <Account />
            </div>
        </div>
    }
}