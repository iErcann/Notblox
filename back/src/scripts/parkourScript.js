new MapWorld('https://myaudio.nyc3.cdn.digitaloceanspaces.com/OBBY23.glb')

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

for (let i = 1; i <= 7; i++) {
  const fallingSpherePosition = {
    x: 225,
    y: 111 + i * 5,
    z: randomInt(-990, -1020),
  }

  const sphereParams = {
    position: fallingSpherePosition,
    radius: 4,
  }
  const sphere = new Sphere(sphereParams)
  sphere.entity.addComponent(
    new SpawnPositionComponent(
      sphere.entity.id,
      fallingSpherePosition.x,
      fallingSpherePosition.y,
      fallingSpherePosition.z
    )
  )
  sphere.entity.addComponent(new ZombieComponent(sphere.entity.id))
}
