import '/dist/output.css'
import * as THREE from 'three'

let darkToggle = false

const darkToggleButton = document.getElementById("dark-toggle")
const lightMode = document.getElementById("light-mode")
const darkMode = document.getElementById("dark-mode")
darkToggleButton.addEventListener("click", toggleDarkMode)

function toggleDarkMode() {
    if (darkToggle) {
        darkToggle = false
        document.body.classList.remove("dark")
        lightMode.classList.add("hidden")
        darkMode.classList.remove("hidden")
        darkToggleButton.classList.remove("fill-white")
    }
    else {
        darkToggle = true
        document.body.classList.add("dark")
        lightMode.classList.remove("hidden")
        darkMode.classList.add("hidden")
        darkToggleButton.classList.add("fill-white")
    }
}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

/**
 * Cube
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
//scene.add(cube)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()