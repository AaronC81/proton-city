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
        var userInfo;
        try {
            userInfo = await $.getJSON("/api/user/info");
        } catch {
            return null;
        }

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
        var games;
        try {
            games = await $.getJSON("/api/user/owned");
        } catch {
            return null;
        }

        if (games.error_message) {
            return null;
        }

        return games.map((game: any) => new Database.Game(game));
    }
}