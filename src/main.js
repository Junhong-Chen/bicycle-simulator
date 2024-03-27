import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { moveEvents } from './controls'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 3, 3)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 窗口自适应
window.addEventListener('resize', function () {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}, false)

// 添加网格辅助
const gridHelper = new THREE.GridHelper(20, 20)
scene.add(gridHelper)

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)

// 添加一个box
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ffff })
const cube = new THREE.Mesh(geometry, material)
cube.position.y = 0.5
scene.add(cube)

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)

  // 更新物体移动位置
  if (moveEvents.moveKeys > 0) {
    Object.values(moveEvents.keys).forEach(({ press, handle }) => press && handle())
    const angle = controls.getAzimuthalAngle()
    const { transformed } = moveEvents
    transformed.applyAxisAngle(THREE.Object3D.DEFAULT_UP, angle)
    cube.position.add(transformed)
    camera.position.add(transformed)
    controls.target.add(transformed) // The camera being controlled
    transformed.set(0, 0, 0)
  }
}
animate()