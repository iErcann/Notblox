new MapWorld("https://myaudio.nyc3.cdn.digitaloceanspaces.com/OBBY22.glb")

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

for (let i = 1; i <= 5; i++) {
    const fallingSpherePosition = {
        x: 225, y:111 + i*5, z: randomInt(-990, -1010)
        
    }

    const sphere = new Sphere(fallingSpherePosition.x, fallingSpherePosition.y, fallingSpherePosition.z, 8);
    sphere.entity.addComponent(new SpawnPositionComponent(sphere.entity.id, fallingSpherePosition.x, fallingSpherePosition.y, fallingSpherePosition.z));
}