// Check if the environment is Node.js (server)
const isServer =
  typeof process !== 'undefined' && process.versions != null && process.versions.node != null

export const config = {
  SERVER_TICKRATE: 20, // SERVER
  IS_SERVER: isServer,
}
