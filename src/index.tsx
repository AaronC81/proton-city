import * as Database from "./database"
import * as UI from "./ui"
import * as React from "react"
import * as ReactDOM from "react-dom"
import * as ReactGA from "react-ga";
import * as $ from "jquery"

// Credit to Stack Overflow
function getParameterByName(name: string) {
    var match = RegExp('[?&]' + name + '=([^&]*)')
        .exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

async function getComponentByRoute(route: string) {
    if (route == "index") {
        return <UI.GameSearchPage search={getParameterByName("search")} />;
    } else if (route == "game") {
        const game = await Database.gameById(getParameterByName("id"));
            
        return <UI.GameRow game={game} fixed={true} />;
    } else if (route == "submit") {
        const id = getParameterByName("id");

        return <UI.SubmitPage id={id} />;
    } else if (route == "user_games") {
        return <UI.UserGamesPage />;
    } else {
        return null;
    }
}

(window as any).protonCitySelectRoute = async (route: string) => {
    const target = $("#app")[0];

    // Render a loader for routes with processing (e.g. "game")
    ReactDOM.render(<div>
        <UI.Header />
        <UI.Loader />
    </div>, target)

    const component = await getComponentByRoute(route);
    if (component == null) {
        console.error("Invalid route");
        return;
    }

    ReactDOM.render(<div>
        <UI.Header />
        <div style={{ backgroundColor: "red", color: "white", padding: "20px" }}>
            There may be sudden downtime and report submission failures over the
            next few days due to external spreadsheet changes. Thank you for
            your understanding.
        </div>
        { component }
    </div>, target);

    ReactGA.initialize("UA-125023815-1");
    ReactGA.pageview(window.location.pathname);
}