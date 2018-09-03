import * as React from "react";
import styled from "styled-components";

type LoaderProps = {};
type LoaderState = {};

const CentredImage = styled.img`
    display: block;
    margin: 0 auto;
`

/**
 * Displays a 'busy' animation. Use this across the project when something
 * is loading for consistency.
 */
export class Loader extends React.Component<LoaderProps, LoaderState> {
    render() {
        return <CentredImage
            src="/img/loading.gif"
            alt="Loading..." />;
    }
}