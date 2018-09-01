import * as React from "react"
import { SteamUser } from "../steam_user";
import { Loader } from "./loader";

type AccountProps = {}
type AccountState = { signedIn: boolean, userInfo: any }

/**
 * Allows a user to sign in or out of their Steam account.
 */
export class Account extends React.Component<AccountProps, AccountState> {
    constructor(props: AccountProps) {
        super(props);
        this.state = { signedIn: null, userInfo: null };
        this.getUser();
    }

    /**
     * Gets the current user and updates state.
     */
    async getUser() {
        const userInfo = await SteamUser.info();
        const signedIn = (userInfo != null);
        this.setState({ signedIn, userInfo });
    }

    render() {
        if (this.state.signedIn == null) {
            return <Loader />
        }
        if (this.state.signedIn) {
            return <div style={{ fontSize: "1.2rem", textAlign: "right" }}>
                Hey, <b>{ this.state.userInfo.username }</b><br />
                <a href="/steamauth/logout" style={{ color: "blue", textDecoration: "none" }}>
                    Sign out
                </a>
            </div>;
        } else {
            return <div>
                <a href="/steamauth/authenticate">
                    <img src="/img/signin.png" alt="Sign in"/>
                </a>
            </div>;
        }
    }
}