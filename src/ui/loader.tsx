import * as React from "react";

type LoaderProps = {};
type LoaderState = {};

/**
 * Displays a 'busy' animation. Use this across the project when something
 * is loading for consistency.
 */
export class Loader extends React.Component<LoaderProps, LoaderState> {
    render() {
        return <img
            style={{ display: "block", margin: "0 auto" }}
            src="/img/loading.gif"
            alt="Loading..." />;
    }
}