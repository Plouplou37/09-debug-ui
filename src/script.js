import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'
/*
* Debug
*/
//with lil-gui we can only tweak properties of objects
const gui = new GUI({
    width: 300,
    title: 'Nice Debug UI',
    closeFolders: true
})

//gui.close()
gui.hide()

const debugObject = {}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
debugObject.color = '#1d35af'

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)

const material = new THREE.MeshBasicMaterial({ 
    color: debugObject.color,
    wireframe: true
 })
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

const cubeTweaks = gui.addFolder('Awesome cube')
//close by default
//cubeTweaks.close() // can close when instantiating the GUI up

//you can arrrage your tweaks in folder in the GUI !! Very Handy 
cubeTweaks
    .add(mesh.position,'y')
    .min(-3)
    .max(3)
    .step(0.01)
    .name('Elevation')
cubeTweaks
    .add(mesh, 'visible')
gui
    .add(material, 'wireframe')
gui
    .addColor(debugObject, 'color')
    .onChange( ()=>
    {
        material.color.set(debugObject.color)
    })

debugObject.spin = () => {
    gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2})
}

gui
    .add(debugObject, 'spin')

debugObject.subdivision = 2
gui
    .add(debugObject, 'subdivision')
    .min(1)
    .max(20)
    .step(1)
    .onFinishChange((value)=>{
        // value == debugObject.
        //delete the old geometry form the GPU for performance and avoid data leakage !!!!!
        mesh.geometry.dispose()
        console.log(value)
        mesh.geometry = new THREE.BoxGeometry(1, 1, 1, value, value, value)
    })
    .name('sudivision')
// const myObject = {
//     value: 1000
// }
// gui
//     .add(myObject, 'value')
//     .min(0)
//     .max(1000)
//     .name('test')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('keydown', (event) => {
        if(event.key == 'h')
        {
            if(gui._hidden == false)
            {
                gui.hide()
            }
            else if (gui._hidden == true)
            {
                gui.show()
            }
        } 
})

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
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()