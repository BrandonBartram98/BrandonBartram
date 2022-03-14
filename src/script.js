import '/dist/output.css'
import * as THREE from 'three'
import { DoubleSide } from 'three'
import * as dat from 'lil-gui'
import galleryFragment from './shaders/galleryfragment.glsl'
import galleryVertex from './shaders/galleryvertex.glsl'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

let avatarModel
let avatarHead, avatarLeftEye, avatarRightEye, avatarSpine, avatarBreathing

let hasLoaded = false
const pointer = new THREE.Vector2();

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
const textureLoader = new THREE.TextureLoader()

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

document.addEventListener( 'mousemove', onMouseMove )

// Cursor
function onMouseMove(event)
{
    event.preventDefault()
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1
}

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
        }, 200)
    }
)

// AVATAR
const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.load(
    'models/avatar.glb', (glb) => 
    {
        avatarModel = glb
        avatarModel.scene.position.set(0.9, -2, 9)
        avatarModel.scene.traverse(function(child) {
            if (child.name === "Head") {
              avatarHead = child
            }
            if (child.name === "LeftEye") {
                avatarLeftEye = child
            }
            if (child.name === "RightEye") {
                avatarRightEye = child
            }
            if (child.name === "Spine2") {
                avatarSpine = child
            }
            if (child.name === "Spine1") {
                avatarSpine = child
            }
        })
        avatarModel.scene.rotation.y = -40 * THREE.Math.DEG2RAD
        //scene.add(avatarModel.scene)
    }
)

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.castShadow = true
directionalLight.position.set(0, 0.5, 0)
scene.add(directionalLight)

// GALLERY

let planeTexture = textureLoader.load('images/testimage.jpeg')
// Material
const shaderMat = new THREE.ShaderMaterial({
    vertexShader: galleryVertex,
    fragmentShader: galleryFragment,
    transparent: true,
    side: DoubleSide,
    uniforms:
    {
        uFrequency: { value: new THREE.Vector2(3, 0) },
        uDistance: { value: 0.1 },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('orange') },
        uTexture: { value: planeTexture }
    }
})

/**
 * Gallery
 */
let galleryGroup = new THREE.Group
galleryGroup.position.set(0, 0, 0)

// const plane1 = new THREE.Mesh(
//     new THREE.PlaneGeometry(3, 4, 12, 12),
//     shaderMat
// )
// galleryGroup.add(plane1)
// plane1.position.set(0, objectsDistanceY * 0, 3)

// planeTexture = textureLoader.load('/images/testimage2.jpeg')
// const plane2 = new THREE.Mesh(
//     new THREE.PlaneGeometry(3, 4, 12, 12),
//     shaderMat
// )
// galleryGroup.add(plane2)
// plane2.position.set(3, -(objectsDistanceY * 1), 0)
// plane2.rotation.y = 90 * THREE.Math.DEG2RAD

const plane3 = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 4, 12, 12),
    shaderMat
)
galleryGroup.add(plane3)
plane3.position.set(0, -(objectsDistanceY * 2), -3)
plane3.rotation.y = 180 * THREE.Math.DEG2RAD

const plane4 = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 4, 12, 12),
    shaderMat
)
plane4,shaderMat.uTexture = { value: planeTexture }
galleryGroup.add(plane4)
plane4.position.set(-3, -(objectsDistanceY * 3), 0)
plane4.rotation.y = 270 * THREE.Math.DEG2RAD

const plane5 = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 4, 12, 12),
    shaderMat
)
galleryGroup.add(plane5)
plane5.position.set(0, -(objectsDistanceY * 4), 3)

const plane6 = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 4, 12, 12),
    shaderMat
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

gui.add(shaderMat.uniforms.uDistance, 'value').min(0).max(1).step(0.001).name('Cube Wave Dist')
gui.add(shaderMat.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('CubeX Freq')
gui.add(shaderMat.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('CubeY Freq')

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

    if (hasLoaded) {
        avatarHead.rotation.y += ((parallaxX / 1.5) - avatarHead.rotation.y) * 2 * deltaTime
        avatarHead.rotation.x += (( parallaxY / 1.5 ) - avatarHead.rotation.x) * 2 * deltaTime

        avatarSpine.rotation.y += ((parallaxX / 4) - avatarSpine.rotation.y) * 2 * deltaTime
        avatarSpine.rotation.x += (( parallaxY / 4 ) - avatarSpine.rotation.x) * 2 * deltaTime

        avatarLeftEye.rotation.y += ((parallaxX / 1.5) - avatarLeftEye.rotation.y) * 8 * deltaTime
        avatarLeftEye.rotation.x += (( parallaxY / 1.5 ) - avatarLeftEye.rotation.x) * 8 * deltaTime

        avatarRightEye.rotation.y += ((parallaxX / 1.5) - avatarRightEye.rotation.y) * 8 * deltaTime
        avatarRightEye.rotation.x += (( parallaxY / 1.5) - avatarRightEye.rotation.x) * 8 * deltaTime
    }

    shaderMat.uniforms.uTime.value = elapsedTime
    shaderMat.uniforms.uTime.value = elapsedTime

    galleryGroup.position.y = scrollY / sizes.height * objectsDistanceY
    galleryGroup.rotation.y = - scrollY / sizes.height * 90 * THREE.Math.DEG2RAD
    canvas.style.opacity = scrollY / 1500

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()