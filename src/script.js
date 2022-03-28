import '/dist/output.css'
import * as THREE from 'three'
import { DoubleSide } from 'three'
import * as dat from 'lil-gui'
import galleryFragment from './shaders/galleryfragment.glsl'
import galleryVertex from './shaders/galleryvertex.glsl'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'

let currentSection = 0
let newSection

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseMove(event) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
  
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  }

let hasLoaded = false
const pointer = new THREE.Vector2();

// Wrap every letter in a span
var textWrapper = document.querySelector('.ml10 .letters');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

pointer.x = 0
pointer.y = 0

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

// Debug
const gui = new dat.GUI()
gui.hide()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const objectsDistanceY = 3
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
camera.position.x = 0
camera.position.y = 0
camera.position.z = 10
scene.add(camera)

const loadingElement = document.querySelector('.loading-screen')
const loadingManager = new THREE.LoadingManager(
    // Loaded
    () =>
    {
        hasLoaded = true
        // Wait a little
        window.setTimeout(() =>
        {
            loadingElement.style.opacity = 0

            anime.timeline({loop: false })
            .add({
                targets: '.ml10 .letter',
                rotateY: [-90, 0],
                duration: 1300,
                delay: (el, i) => 80 * i
            });

        }, 800)
    }
)

const textureLoader = new THREE.TextureLoader(loadingManager)

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.castShadow = true
directionalLight.position.set(0, 0.5, 0)
scene.add(directionalLight)

// GALLERY

let planeTexture = textureLoader.load('images/testimage.jpeg')
let hiveTexture = textureLoader.load('images/hive.png')
let shaderTexture = textureLoader.load('images/shaderPlayground.png')
let rosTexture = textureLoader.load('images/ros.png')
let giddyTexture = textureLoader.load('images/giddy.png')

// Material
const shaderMat = new THREE.MeshStandardMaterial({
    transparent: true,
    side: DoubleSide,
    map: planeTexture
})

const shaderMatHive = new THREE.MeshStandardMaterial({
    transparent: true,
    side: DoubleSide,
    map: hiveTexture
})

const shaderMatPlayground = new THREE.MeshStandardMaterial({
    transparent: true,
    side: DoubleSide,
    map: shaderTexture
})

const rosMat = new THREE.MeshStandardMaterial({
    transparent: true,
    side: DoubleSide,
    map: rosTexture
})

const giddyMat = new THREE.MeshStandardMaterial({
    transparent: true,
    side: DoubleSide,
    map: giddyTexture
})

/**
 * Gallery
 */
let galleryGroup = new THREE.Group
galleryGroup.position.set(0, 0, 0)

const plane3 = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 4, 12, 12),
    shaderMatHive
)
galleryGroup.add(plane3)
plane3.position.set(0, -(objectsDistanceY * 2), -3)
plane3.rotation.y = 180 * THREE.Math.DEG2RAD

const plane4 = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 4, 12, 12),
    shaderMatPlayground
)
plane4,shaderMat.uTexture = { value: planeTexture }
galleryGroup.add(plane4)
plane4.position.set(-3, -(objectsDistanceY * 3), 0)
plane4.rotation.y = 270 * THREE.Math.DEG2RAD

const plane5 = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 4, 12, 12),
    rosMat
)
galleryGroup.add(plane5)
plane5.position.set(0, -(objectsDistanceY * 4), 3)

const plane6 = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 4, 12, 12),
    giddyMat
)
galleryGroup.add(plane6)
plane6.position.set(3, -(objectsDistanceY * 5), 0)
plane6.rotation.y = 90 * THREE.Math.DEG2RAD;

const plane7 = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 4, 12, 12),
    shaderMat
)
galleryGroup.add(plane7)
plane7.position.set(0, -(objectsDistanceY * 6), -3)

const plane8 = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 4, 12, 12),
    shaderMat
)
galleryGroup.add(plane8)
plane8.position.set(-3, -(objectsDistanceY * 7), 0)
plane8.rotation.y = 270 * THREE.Math.DEG2RAD;

scene.add(galleryGroup)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    transparent: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
 let scrollY = window.scrollY

 window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY
    newSection = Math.round(scrollY / sizes.height)
    console.log(newSection)

    switch(newSection) {
        case 0:
            canvas.style.opacity = 0
            break;
        case 1: case 2: case 3: case 4: case 5: case 6: case 7:
            canvas.style.opacity = 100
            break
        case 8:
            canvas.style.opacity = 0
            break
    }

    if(newSection != currentSection)
    {
        currentSection = newSection
    }
})

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

    const parallaxX = pointer.x * 0.5
    const parallaxY = - pointer.y * 0.5

    galleryGroup.position.y = scrollY / sizes.height * objectsDistanceY
    galleryGroup.rotation.y = - scrollY / sizes.height * 90 * THREE.Math.DEG2RAD

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()