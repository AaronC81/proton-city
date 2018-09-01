import * as $ from "jquery";
import * as Database from "./database";

/**
 * Represents a Steam user whose games can be retrieved.
 */
export class SteamUser {
    /**
     * Returns the authenticated user's info.
     */
    static async info() {
        const userInfo = await $.getJSON("/api/user/info");

        if (userInfo.error_message) {
            return null;
        }

        return userInfo as {
            steamid: string, username: string, profile: string,
            avatar: { small: string, medium: string, large: string }
        };
    }

    /**
     * Gets the games owned by the authenticated user.
     */
    static async ownedGames(): Promise<Database.Game[]> {
        const games = await $.getJSON("/api/user/owned");
        return games.map((game: any) => new Database.Game(game));
    }
}