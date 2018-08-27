import { initializeApp, database } from "firebase"
import * as $ from "jquery"

// TODO: This approach of downloading the whole database isn't ideal.
// Currently, we fetch the ENTIRE Firebase, which will hammer bandwidth and
// eventually probably cost me a lot of money.
// Need to look into ElasticSearch/Algolia on a FB Function.

// TODO: Also, the search only searches games which actually have an entry.

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
     * The average stateScore of all GameEntry instances in this GameGroup.
     */
    get averageStateScore(): number {
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
    get averageStateColor() {
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
 * Handles fetching and caching the entire Firebase database.
 */
export class DatabaseCache {
    /**
     * Gets the database, or a cached version of it.
     */
    static async getDatabase(): Promise<Game[]> {
        const idDb = await this.getIndexedDatabase();
        return Object.keys(idDb).map(k => idDb[k]);
    }

    /**
     * Gets the indexed database, or a cached version of it.
     */
    static async getIndexedDatabase(): Promise<{ [key: string]: Game }> {
        const w = window as any;

        if (!this.databaseCached) {
            let dbSnap = await database()
                .ref("/")
                .once("value");

            w.protonCityCachedIndexedDatabase = dbSnap.val();
        }
        
        return w.protonCityCachedIndexedDatabase;
    }

    /**
     * A boolean indicating whether the database has been cached yet.
     */
    static get databaseCached(): boolean {
        return (window as any).protonCityCachedIndexedDatabase != undefined;
    }
}

/**
 * Readies the database for use.
 */
export function prepareDatabase() {
    var config = {
        apiKey: "AIzaSyCoCwMR3oaM_5HPKjiSisg2U-IXK3Of42A",
        authDomain: "proton-city.firebaseapp.com",
        databaseURL: "https://proton-city.firebaseio.com/",
        storageBucket: "bucket.appspot.com"
    };
    initializeApp(config);
}

/**
 * Given a game's Steam ID, gets the data for that game.
 */
export async function getGameById(id: string): Promise<Game> {
    const idDb = await DatabaseCache.getIndexedDatabase();
    return idDb[id];
}

/**
 * Search for a game on Steam, returning an array of titles and app IDs.
 */
export async function gameSearch(term: string, max: number = 10): Promise<Game[]> {
    const allGames = await DatabaseCache.getDatabase();

    return allGames.filter(game =>
        game.gameName.toLowerCase().includes(term.toLowerCase())).slice(0, max);
}