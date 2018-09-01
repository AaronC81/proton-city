import * as React from "react"

type HeaderProps = {}
type HeaderState = {}

/**
 * The entire app's header and navigation.
 */
export class Header extends React.Component<HeaderProps, HeaderState> {
    render() {
        return <div id="header">
            <h1>Proton City</h1>
            <div id="nav">
                <a href="/">Search</a> | <a href="https://github.com/OrangeFlash81/proton-city">GitHub</a>
            </div>
        </div>
    }
}