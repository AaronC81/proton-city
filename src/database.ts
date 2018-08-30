import * as $ from "jquery"

/**
 * A game in the database, which contains all of its compatibility entries.
 */
export class Game {
    gameId: string;
    gameImage: string;
    gameName: string;
    storeLink: string;

    entries: GameCompatEntry[];

    /**
     * Pass a JSON object to convert it to an instance.
     */
    constructor(obj: any = {}) {
        this.gameId = obj["game_id"]
        this.gameImage = obj["game_image"]
        this.gameName = obj["game_name"]
        this.storeLink = obj["store_link"]

        this.entries = obj["entries"].map((x: any) => new GameCompatEntry(x))
    }

    /**
     * The average stateScore of all GameEntry instances in this GameGroup.
     */
    public get averageStateScore(): number {
        const scores = this.entries.map(x => x.stateScore);
        const sum = scores.reduce((a, b) => a + b, 0);
        const average = (sum / this.entries.length);

        return parseFloat(average.toFixed(1));
    }

    /**
     * Gets a color representation of averageStateScore, with red being 0 and
     * green being 5, in the form of a CSS 'rgb' call.
     * TODO: Pretty naff
     */
    public get averageStateColor() {
        // Make the score out of 255 instead
        const offsetScore = this.averageStateScore * (255 / 5);
        
        const greenAmount = Math.trunc(offsetScore)
        const redAmount = Math.trunc(255 - offsetScore)

        return `rgb(${redAmount}, ${greenAmount}, 0)`
    }
}

/**
 * A game compatibility entry.
 */
export class GameCompatEntry {
    description: string;
    distro: string;
    drivers: string;
    hardware: string;
    gameId: string;
    nativeVersion: string;
    protonVersion: string;
    gameVersion: string;
    state: string; // TODO: Convert to enum

    // New submissions will save a Unix timestamp. Old submissions (from G Sheet)
    // save a text date, e.g. "23 Aug".
    submissionDate: string | number;

    /**
     * Pass a JSON object to convert it to an instance.
     */
    constructor(obj: any = {}) {
        this.description = obj["description"]
        this.distro = obj["distro"]
        this.drivers = obj["drivers"]
        this.hardware = obj["hardware"]
        this.gameId = obj["game_id"]
        this.nativeVersion = obj["native_version"]
        this.protonVersion = obj["proton_version"]
        this.gameVersion = obj["game_version"]
        this.state = obj["state"]
    }

    /**
     * A score out of 5 representing how well this game works, calculated from
     * its state.
     */
    get stateScore(): number {
        const table = {
            "Completely Stable": 5,
            "Stable": 4,
            "Unstable": 3,
            "Unplayable": 2,
            "Crashes": 1,
            "Won't Start": 0
        }
        return (table as any)[this.state.trim()]
    }
}

/**
 * Search for a game.
 */
export async function gameSearch(term: string): Promise<Game[]> {
    const result = await $.getJSON(`/api/games/search/${encodeURI(term)}/with_entries`)

    return result.map((x: any) => new Game(x))
}

export async function gameById(id: string): Promise<Game> {
    const result = await $.getJSON(`/api/games/${id}`);

    return new Game(result);
}