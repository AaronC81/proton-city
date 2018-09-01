import * as Database from "./database"
import * as UI from "./ui"
import * as React from "react"
import * as ReactDOM from "react-dom"
import * as $ from "jquery"

async function getComponentByRoute(route: string) {
    if (route == "index") {
        return <UI.GameSearchPage />;
    } else if (route == "game") {
        // Credit to Stack Overflow
        function getParameterByName(name: string) {
            var match = RegExp('[?&]' + name + '=([^&]*)')
                .exec(window.location.search);
            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        }
        
        const game = await Database.gameById(getParameterByName("id"));
            
        return <UI.GameRow game={game} fixed={true} />;
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
        { component }
    </div>, target);
}