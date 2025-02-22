# Three.js Performance Guide

### Performance Monitoring

To monitor CPU usage while running your Three.js application, you can utilize Chrome DevTools : 
 ![PerformanceThreeJS](https://github.com/user-attachments/assets/762cbeaa-b438-4702-b89a-49e4feca154c)


#### Monitoring Draw Calls
You can easily check the number of draw calls made by the renderer using the following code:
```typescript
// Monitor draw calls
console.log(renderer.info.render.calls)
````

#### Using `stats.js` for Performance Metrics
For a more detailed performance analysis, you can integrate stats.js into your application. This library provides real-time performance statistics, including frame rates and rendering times. Here’s how to set it up:

```typescript
import Stats from 'three/examples/jsm/libs/stats.module';

// Create a new Stats instance
const stats = new Stats();
document.body.appendChild(stats.dom);

// Animation loop to update stats
function animate() {
  stats.begin(); // Start measuring
  // Render your scene here
  stats.end(); // Stop measuring
  requestAnimationFrame(animate); // Continue the animation loop
}

// Start the animation
animate();
```


## Lighting & Shadows Performance

Understanding the performance impact of lights and shadows is crucial for optimizing Three.js applications.

### Shadow Performance Hierarchy

From best to worst performance:

1. **No Shadows** (Fastest)
   - Use for non-essential objects
   - Best for mobile/low-end devices

2. **DirectionalLight with shadows**
   - One additional scene render
   - Good for sun/moon effects
   - Best choice for general shadow casting

3. **SpotLight with shadows**
   - One additional scene render
   - Good for focused areas like flashlights
   - More expensive than DirectionalLight

4. **PointLight with shadows** (Most Expensive)
   - Six additional scene renders!
   - Extremely costly for performance
   - Use very sparingly, if at all

### Understanding Draw Calls

Each shadow-casting light adds significant draw calls:
```typescript
// DirectionalLight/SpotLight
drawCalls = numberOfMeshes * 1

// PointLight (6x more expensive!)
drawCalls = numberOfMeshes * 6

// Example with 5 meshes and 2 point lights:
totalDrawCalls = baseCalls + (meshes * 6 * pointLights)
// 5 base + (5 * 6 * 2) = 65 draw calls
```

Good draw calls for web-games : <200

### Optimization Strategies

#### 1. Light Management

```typescript
// GOOD - Main shadow casting light
const mainLight = new THREE.DirectionalLight()
mainLight.castShadow = true
mainLight.position.set(50, 30, 50)
mainLight.intensity = 1.5

// GOOD - Ambient fill light for overall scene brightness
const ambientLight = new THREE.AmbientLight('#ffffff', 0.4)

// GOOD - Hemisphere light for sky/ground color variation
const hemiLight = new THREE.HemisphereLight(
  '#skyColor',   // Sky color
  '#groundColor', // Ground color
  0.5            // Intensity
)

// ACCEPTABLE - Non-shadow point light for local highlights
const accentLight = new THREE.PointLight('#ffffff', 1.0)
accentLight.castShadow = false  // Important!

// BAD - Point light with shadows (extremely expensive!)
const badLight = new THREE.PointLight('#ffffff', 1.0)
badLight.castShadow = true  // Will cause 6 additional renders!
```

##### Light Type Performance Guide

From best to worst performance:

1. **AmbientLight**
   - No shadows possible
   - Extremely cheap
   - Good for base illumination
   - Use to reduce shadow darkness

2. **HemisphereLight**
   - No shadows possible
   - Very performant
   - Great for outdoor scenes
   - Provides subtle color variation

3. **DirectionalLight (without shadows)**
   - Good for sun/moon simulation
   - Relatively cheap
   - Consistent shadows across scene

4. **DirectionalLight (with shadows)**
   - One additional render pass
   - Best choice for main shadow caster
   - Good balance of quality/performance

5. **SpotLight (without shadows)**
   - Good for focused lighting
   - Moderate performance impact
   - Use for highlights/accents

6. **SpotLight (with shadows)**
   - One additional render pass
   - More expensive than DirectionalLight
   - Use sparingly

7. **PointLight (without shadows)**
   - Expensive but manageable
   - Good for local lighting
   - Keep radius small when possible

8. **PointLight (with shadows)** ⚠️
   - EXTREMELY expensive (6 render passes!)
   - Should almost never be used
   - Consider alternatives:
     - SpotLight with shadows
     - Multiple non-shadow PointLights
     - Baked shadows/lighting

##### Recommended Light Setups

```typescript
// Basic Outdoor Scene
const lights = {
  main: new THREE.DirectionalLight('#ffffff', 1.5),  // Sun
  hemi: new THREE.HemisphereLight('#skyblue', '#groundcolor', 0.5),
  ambient: new THREE.AmbientLight('#ffffff', 0.2)
}
lights.main.castShadow = true

// Indoor Scene
const lights = {
  main: new THREE.DirectionalLight('#ffffff', 0.5),  // Window light
  spots: [
    new THREE.SpotLight('#ffffff', 0.7),  // Key light
    new THREE.SpotLight('#ffffff', 0.3)   // Fill light
  ],
  ambient: new THREE.AmbientLight('#ffffff', 0.3)
}
lights.main.castShadow = true

// Not needed since it's by default at false, but just to show usage
lights.spots.forEach(light => light.castShadow = false)

// Night Scene
const lights = {
  moon: new THREE.DirectionalLight('#blue', 0.5),
  points: Array(5).fill(0).map(() => new THREE.PointLight('#orange', 0.4)),
  ambient: new THREE.AmbientLight('#000033', 0.2)
}
lights.moon.castShadow = true

// Not needed since it's by default at false, but just to show usage
lights.points.forEach(light => light.castShadow = false)  // Important!
```

##### Tips for Light Performance
- Use ONE main shadow-casting light (usually DirectionalLight)
- Combine AmbientLight and HemisphereLight for base illumination
- Use non-shadow PointLights for accent lighting
- Avoid shadow-casting SpotLights when possible
- NEVER use shadow-casting PointLights in production
- Consider light radius/distance for PointLights and SpotLights
- Use light helpers during development to visualize coverage

#### 2. Shadow Map Optimization
```typescript
const directionalLight = new THREE.DirectionalLight()

// Reduce shadow map size for better performance
// Set the resolution of the shadow map texture (higher = sharper shadows but more expensive)
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.mapSize.width = 1024
```

#### 3. Selective Shadow Casting
```typescript
// Only enable shadows on important objects
mainObject.traverse((child) => {
  if (child.isMesh) {
    child.castShadow = false       // Disable casting
    child.receiveShadow = true     // Still receive shadows
  }
})
```

 

### Best Practices

#### Lighting Setup
- Use ONE DirectionalLight for main shadows
- Add non-shadow PointLights for ambient lighting
- Avoid shadow-casting PointLights
- Consider baking shadows for static scenes

#### Shadow Quality
- Use smaller shadow maps (512x512) by default
- Increase only for close-up shadows
- Disable `autoUpdate` for static scenes
- Consider shadow bias adjustment for quality/performance balance

#### Mesh Optimization
- Combine small meshes where possible
- Use instancing for repeated objects
- Target < 200 draw calls for web
- Group static objects

#### Materials
```typescript
// Shadows require appropriate materials
const material = new THREE.MeshStandardMaterial({
  receiveShadow: true,
  castShadow: true
})

// BasicMaterial doesn't support shadows
const basicMaterial = new THREE.MeshBasicMaterial()  // No shadows
```
 
#### Manual Updates of Shadows maps

- `autoUpdate`: Enables automatic updates to the shadows in the scene
  - Default is `true`
 - When `autoUpdate` is `false`, you need to manually update the shadows maps with `needsUpdate`

- `needsUpdate`: Forces shadow maps to update on next render
  - Default is `false` 
  - Required when `autoUpdate = false` to manually trigger shadow updates
  - Must be set to `true` followed by a render call to update shadows

##### Example : Only when a specific object moves
```typescript
renderer.shadowMap.autoUpdate = false

// Update shadows only when necessary
function onObjectMove() {
  renderer.shadowMap.needsUpdate = true
}
```

##### Example : Only 1 time per second
```typescript
renderer.shadowMap.autoUpdate = false

// Update shadows only once per second
function updateShadows() {
  renderer.shadowMap.needsUpdate = true
}

setInterval(updateShadows, 1000) 
// Of course, you can use requestAnimationFrame instead of setInterval with proper delta time logic
```



### Common Pitfalls

1. **Too Many Shadow Casters**
   - Every shadow-casting light multiplies render calls
   - Each mesh with `castShadow = true` adds to the cost

2. **Unnecessary Shadow Updates**
   - Static scenes don't need `autoUpdate`
   - Update shadows only when the scene changes

3. **Oversized Shadow Maps**
   - Large shadow maps impact memory and performance
   - Start small and increase only if needed

4. **Point Light Shadows**
   - Extremely expensive (6x normal shadow cost)
   - Consider alternatives like SpotLights

### Testing & Profiling

Always test on target devices:
- Mobile performance differs significantly
- Monitor FPS and draw calls
- Use Chrome DevTools Performance tab
- Test with varying numbers of objects and lights

### Additional Resources

- [Three.js Performance Tips](https://threejs.org/docs/#manual/en/introduction/How-to-update-things)
- [Shadow Map Types](https://threejs.org/docs/#api/en/constants/Shadows)
- [WebGL Performance Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices) 

### Advanced: Cascaded Shadow Maps (THREE-CSM)

[THREE-CSM](https://github.com/vtHawk/three-csm) is a solution for rendering high-quality directional light shadows over large distances. It works by splitting the view frustum into several segments, each with its own shadow map.

#### Benefits
- Better shadow quality over large distances
- More efficient than increasing shadow map resolution
- Good for open world scenes

#### Basic Setup
```typescript
import { CSM } from 'three-csm'

// Create CSM instance
const csm = new CSM({
  maxFar: 1000,           // How far shadows are rendered
  cascades: 4,            // Number of shadow cascades
  shadowMapSize: 1024,    // Resolution of each cascade
  lightDirection: new THREE.Vector3(-1, -1, -1),
  camera: camera,         // Your THREE.Camera instance
  parent: scene           // Your THREE.Scene instance
})

// Update in animation loop
function animate() {
  csm.update(camera.matrix)
  renderer.render(scene, camera)
}
```

#### Performance Considerations
- Each cascade adds one render pass
- Balance cascade count with performance needs
- Typically 3-4 cascades is sufficient
- Adjust `maxFar` and `shadowMapSize` based on scene scale

#### When to Use CSM
- Large outdoor environments
- When shadow quality at distance is important
- Games with terrain or large landscapes
- When standard shadows show obvious cutoff points

#### Example Configuration for Different Scenarios
```typescript
// High-end desktop setup
const csmHigh = new CSM({
  cascades: 4,
  shadowMapSize: 2048,
  maxFar: 2000,
  mode: 'practical'
})

// Mobile-friendly setup
const csmLow = new CSM({
  cascades: 2,
  shadowMapSize: 512,
  maxFar: 500,
  mode: 'uniform'
})
```

Note: THREE-CSM might need updates for newer Three.js versions. Check compatibility before implementation. 


------

### Example Project: Enari Engine

A previous project demonstrating good performance practices:

- Live demo: https://enari-engine.vercel.app/
- Source code: https://github.com/iErcann/enari-engine

Also, the default scene uses baked shadows (found it on Sketchfab)
You can make your own worlds with static baked shadows (Blender)
