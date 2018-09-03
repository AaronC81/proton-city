import * as React from "react"
import { Account, WhiteLink } from "./account"
import styled from "styled-components";

const OuterDiv = styled.div`
    width: "100%";
    background-image: url(/img/bg.png);
    background-size: cover;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const HeaderPanel = styled.div`
    padding: 20px;
`

const WhiteSpan = styled.span`
    color: white;
`

const LogoText = styled(WhiteSpan)`
    font-weight: bold;
    padding-right: 20px;
`

type HeaderProps = {}
type HeaderState = {}

/**
 * The entire app's header and navigation.
 */
export class Header extends React.Component<HeaderProps, HeaderState> {
    render() {
        return <OuterDiv>
            <HeaderPanel>
                <LogoText>Proton City</LogoText>
                <WhiteSpan>
                    <WhiteLink href="/">Home</WhiteLink>
                    &nbsp;| <WhiteLink href="/user_games.html"><b>NEW!</b> My Games</WhiteLink> 
                    &nbsp;| <WhiteLink href="https://addons.mozilla.org/en-GB/firefox/addon/proton-city/"><b>NEW!</b> Firefox Extension</WhiteLink>
                    &nbsp;| <WhiteLink href="https://github.com/OrangeFlash81/proton-city">GitHub</WhiteLink>
                </WhiteSpan>
            </HeaderPanel>
            <HeaderPanel>
                <Account />
            </HeaderPanel>
        </OuterDiv>;
    }
}