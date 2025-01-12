new MapWorld('https://notbloxo.fra1.cdn.digitaloceanspaces.com/Notblox-Assets/world/Obby.glb')

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

for (let i = 1; i <= 4; i++) {
  const fallingSpherePosition = {
    x: 263,
    y: 426 + i * 5,
    z: -986 - randomInt(0, -40),
  }

  const sphereParams = {
    position: fallingSpherePosition,
    radius: 4,
    physicsProperties: {
      enableCcd: true,
    },
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
