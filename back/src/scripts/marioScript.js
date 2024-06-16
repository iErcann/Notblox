new MapWorld('https://myaudio.nyc3.cdn.digitaloceanspaces.com/aqsworld.glb')

setTimeout(() => {
  const size = 10
  for (let i = 1; i < size; i++) {
    for (let k = 0; k < size; k++) {
      const cube = new Cube(k * 5, 50, k*i*5, 1, 1, 1)
      // Gradient color
      cube.entity.addComponent(new ZombieComponent(cube.entity.id))
      // cube.entity.addComponent(new RandomizeComponent(cube.entity.id));
    }
  }
}, 1000)
