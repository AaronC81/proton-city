import * as React from "react"
import { Account } from "./account"
import { Styles } from "./styles";

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
                justifyContent: "space-between"
            }}>
            <div style={{ padding: "20px" }}>
                <span style={{
                    color: "black",
                    fontWeight: "bold",
                    paddingRight: "20px",
                    ...Styles.navLink
                }}>Proton City</span>
                <span style={ Styles.navLink }>
                    <a href="/" style={ Styles.navLink }>Home</a>
                    &nbsp;| <a href="/user_games.html" style={ Styles.navLink }><b>NEW!</b> My Games</a> 
                    &nbsp;| <a href="https://addons.mozilla.org/en-GB/firefox/addon/proton-city/" style={ Styles.navLink }><b>NEW!</b> Firefox Extension</a>
                    &nbsp;| <a href="https://github.com/OrangeFlash81/proton-city" style={ Styles.navLink }>GitHub</a>
                </span>
            </div>
            <div style={{ padding: "20px" }}>
                <Account />
            </div>
        </div>
    }
}