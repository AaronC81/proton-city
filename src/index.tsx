import * as Database from "./database"
import * as UI from "./ui"
import * as React from "react"
import * as ReactDOM from "react-dom"
import * as $ from "jquery"

async function main() {
    // Try rendering the main app
    try {
        const el = ReactDOM.render(<UI.GameSearchPage />, $("#app")[0]) as
            UI.GameSearchPage;
    } catch (e) {
        console.error(e);
    }

    // Try rendering an individual game, using URL param
    try {
        // Credit to Stack Overflow
        function getParameterByName(name: string) {
            var match = RegExp('[?&]' + name + '=([^&]*)')
                .exec(window.location.search);
            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        }
        
        const game = await Database.gameById(getParameterByName("id"))
        const el = ReactDOM.render(<div>
                <UI.Header />
                <UI.GameRow game={game} fixed={true} />
            </div>,
            $("#game")[0]) as UI.GameRow;
    } catch (e) {
        console.error(e);
    }

    console.log("Using API");
    
    (window as any).db = Database
}

main();