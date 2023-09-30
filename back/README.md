<!-- Basic config for Rapier -->

https://github.com/isaac-mason/rapier-node-typescript-minimal-example/blob/main/package.json

# Docker

If you build your mono repository with Docker using Docker compose of two Docker images (frontend and backend), you will also need to adjust the configuration to access the volumes.

1volumes:

2 \- "./services/backend:/node/app:delegated"

3 \- "./services/shared:/node/shared:delegated"

https://patrickdesjardins.com/blog/typescript-nodejs-sibling-project
