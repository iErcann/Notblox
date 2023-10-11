## Shared file import Error .js files

<https://github.com/vercel/next.js/discussions/32237>

## Network Idea

ZombieComponent on back-end equipped on each player
When it is assigned to a player, he becomes a Zombie.
It is then sent via the NetworkDataComponent to the players.
In the future, a component can "sleep" and it will not be sent over the network, some data like ZombieComponent are only relevant once (it can be the same for ColorComponent)
If it sleeps, it isnt sent
The player has to know when a component has been removed, so instead of comparing replicated entities components with incoming serialized entitiies components, we will send a boolean or something like "destroyed"
