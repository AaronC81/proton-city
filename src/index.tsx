import * as Database from "./database"
import * as UI from "./ui"
import * as React from "react"
import * as ReactDOM from "react-dom"
import * as $ from "jquery"

async function main() {
    const el = ReactDOM.render(<UI.App />, $("#app")[0]) as UI.App;

    console.log("Using API");
    
    (window as any).db = Database
}

main();