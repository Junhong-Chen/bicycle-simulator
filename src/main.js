import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  GridHelper,
  BoxGeometry,
  MeshToonMaterial,
  Mesh,
  Group,
  Clock,
  Color
} from 'three'
import * as controller from './controller'
import {
  Clouds,
  Sun
} from './models'
import { COLORS } from './constant'
import GUI from 'lil-gui'

const gui = new GUI()
gui.domElement.addEventListener('mousedown', function (e) {
  e.stopPropagation()
}, false)

const scene = new Scene()
scene.background = new Color(COLORS.SKY)

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 2, 6)
camera.lookAt(0, 0, 0)

const renderer = new WebGLRenderer({ alpha: false })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 窗口自适应
window.addEventListener('resize', function () {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}, false)

// 添加网格辅助
const gridHelper = new GridHelper(20, 20)
scene.add(gridHelper)

// 光晕
const sun = new Sun(1, 1, 1, 0, 100, -200)
scene.add(sun)

// 添加玩家
const geometry = new BoxGeometry(1, 1, 1)
const material = new MeshToonMaterial()
const player = new Mesh(geometry, material)
player.position.y = 0.5
scene.add(player)

// 绑定 camera
const playerCamera = new Group()
playerCamera.add(camera)
player.add(playerCamera)

// 时钟
const clock = new Clock()

// 初始化控制器
controller.init(player)

function animate () {
  window.requestAnimationFrame(animate)
  renderer.render(scene, camera)
  const deltaTime = clock.getDelta()

  const { v, jv, jumping, mKeys } = controller.kc
  // 移动
  const movePos = v.clone().multiplyScalar(deltaTime)
  if (mKeys > 0) {
    controller.kc.acceleration(deltaTime)
    player.position.add(movePos)
    controller.kc.damping()
  } else if (v.length() > 0.1) {
    player.position.add(movePos)
    controller.kc.damping()
  }

  // 跳跃
  if (jumping) {
    controller.kc.jump()
    const jumpPos = jv.clone().multiplyScalar(deltaTime)
    player.position.add(jumpPos)
  }
}
animate()
