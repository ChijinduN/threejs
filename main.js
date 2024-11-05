import * as THREE from "three";  
import "./style.css"
import { gsap } from "gsap";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

//Scene
const scene = new THREE.Scene()

//Create our sphere
// const geometry = new THREE.SphereGeometry(3, 64, 64)
// const material = new THREE.MeshStandardMaterial({
//   color: "#00ff83",
//   roughness: 0.5
// })
// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//light
const light = new THREE.PointLight(0xffffff, 1, 100)
light.position.set(0, 20, 30)
light.intensity = 5
scene.add(light)




//Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 0.1, 1000)
camera.position.z = 200
scene.add(camera)


// const objLoader = new OBJLoader()
// objLoader.load(
//     '/Lavender Ink.obj',
//     (object) => {
//         // (object.children[0] as THREE.Mesh).material = material
//         // object.traverse(function (child) {
//         //     if ((child as THREE.Mesh).isMesh) {
//         //         (child as THREE.Mesh).material = material
//         //     }
//         // })
//         scene.add(object)
//     },
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
//     },
//     (error) => {
//         console.log(error)
//     }
// )


const mtlLoader = new MTLLoader()
mtlLoader.load(
    '/Lavender Ink.mtl',
    (materials) => {
        materials.preload()
        console.log(materials)
         const objLoader = new OBJLoader()
         objLoader.setMaterials(materials)
         objLoader.load(
             '/Lavender Ink.obj',
             (object) => {
                 scene.add(object)
             },
             (xhr) => {
                 console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
             },
             (error) => {
                 console.log('An error happened')
             }
         )
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log('An error happened')
    }
)





//Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width , sizes.height)
renderer.setPixelRatio(2)
renderer.render(scene, camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 5

//Resize
window.addEventListener('resize', () => {
  //Update Sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  //update camera
  
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

const loop = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}
loop()


//timeline magic
const tl = gsap.timeline({defaults: { duration: 1 } })
tl.fromTo(mesh.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1})
tl. fromTo('nav', {y: "-100%"}, {y: "0%"})
tl.fromTo(".title", { opacity: 0}, { opacity: 1})

//Mousee animation Colour
let mouseDown = false
let rgb = []
window.addEventListener("mousedown", () => (mouseDown = true))
window.addEventListener("mouseup", () => (mouseDown = false))

window.addEventListener("mousemove", (e) => {
  if(mouseDown){
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      ]
//Animate
    let newColor = new THREE.Color('rgb(${rgb.join(",")})')
    gsap.to(mesh.material.color, {r:newColor.r, g:newColor.g, b:newColor.b})

  }
});
