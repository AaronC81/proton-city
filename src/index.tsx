import * as Database from "./database"
import * as UI from "./ui"
import * as React from "react"
import * as ReactDOM from "react-dom"
import * as $ from "jquery"

(window as any).protonCitySelectRoute = async (route: string) => {
    const target = $("#app")[0];

    if (route == "index") {
        // TODO: For consistency, should remove Header from this page
        ReactDOM.render(<UI.GameSearchPage />, target)
    } else if (route == "game") {
        // Credit to Stack Overflow
        function getParameterByName(name: string) {
            var match = RegExp('[?&]' + name + '=([^&]*)')
                .exec(window.location.search);
            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        }
        
        const game = await Database.gameById(getParameterByName("id"))
        ReactDOM.render(<div>
            <UI.Header />
            <UI.GameRow game={game} fixed={true} />
        </div>, target);
    } else if (route == "user_games") {
        ReactDOM.render(<div>
            <UI.Header />
            <UI.UserGamesPage />
        </div>, target);
    } else {
        console.error("Unknown route");
    }
}