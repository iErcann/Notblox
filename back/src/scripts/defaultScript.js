// Runtime script
new MapWorld("https://myaudio.nyc3.cdn.digitaloceanspaces.com/aqsworld.glb")

// Function to create a cube with a RandomizeComponent
function createRandomCube(x, y, z, width, height, depth) {
    const cube = new Cube(x, y, z, width, height, depth);
    cube.entity.addComponent(new RandomizeComponent(cube.entity.id));
    return cube;
}

// Function to create a sphere with a RandomizeComponent
function createRandomSphere(x, y, z, radius) {
    const sphere = new Sphere(x, y, z, radius);
    sphere.entity.addComponent(new RandomizeComponent(sphere.entity.id));
    return sphere;
}

// Create a random cube
createRandomCube(0, 50, 0, 1, 1, 1);

// Create a series of cubes
for (let i = 1; i < 5; i++) {
    new Cube(0, 5, 5 * i, 1, 1, 1);
}

// Create a sphere
new Sphere(0, 30, 0, 1);

// Create a series of random spheres
for (let i = 1; i < 10; i++) {
    createRandomSphere(0, i * 30, 0, 1.2);
}

// Create another sphere
new Sphere(10, 30, 0, 4);