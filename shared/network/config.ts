// Check if the environment is Node.js (server)
const isServer =
  typeof process !== 'undefined' && process.versions != null && process.versions.node != null

export const config = {
  /**
   * The server's tickrate is determined by the GAME_TICKRATE environment variable, defaulting to 20 if not set.
   * The client initially uses a default tickrate of 20, but this is updated when receiving the first
   * connection message from the server to match the server's actual tickrate.
   * See the ConnectionMessage type in connection.ts for details.
   */
  SERVER_TICKRATE: isServer ? Number(process.env.GAME_TICKRATE) || 20 : 20,
  IS_SERVER: isServer,
  MAX_MESSAGE_CONTENT_LENGTH: 300,
}
