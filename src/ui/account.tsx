import * as React from "react"
import { SteamUser } from "../steam_user";
import { Loader } from "./loader";
import { Styles } from "./styles";

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
            return <div>
                Hey, <b>{ this.state.userInfo.username }</b> | <a href="/steamauth/logout" style={ Styles.navLink }>Sign out</a>
            </div>;
        } else {
            return <div>
                <a href="/steamauth/authenticate" style={ Styles.navLink }>
                    Sign in with Steam
                </a>
            </div>;
        }
    }
}