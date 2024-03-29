import {
  Vector3,
  MathUtils
} from 'three'
import { KEYS } from './constant'

let mc, kc

class KeyboardController {
  constructor (player) {
    this.player = player
    this.keys = {
      KeyW: {
        key: KEYS.W,
        press: false
      },
      KeyS: {
        key: KEYS.S,
        press: false
      },
      KeyA: {
        key: KEYS.A,
        press: false
      },
      KeyD: {
        key: KEYS.D,
        press: false
      },
      Space: {
        key: KEYS.Space,
        press: false
      },
      ShiftLeft: {
        key: KEYS.ShiftLeft,
        press: false
      }
    }
    // 移动
    this.mKeys = 0
    this.vMax = {
      KeyW: 8,
      KeyS: 2,
      KeyA: 4,
      KeyD: 4
    }
    this.v = new Vector3() // 初始速度
    this.a = 8 // 加速度
    this.d = 0.02 // 阻尼系数
    this.yAxis = new Vector3(0, 1, 0)
    // 跳跃
    this.jv = new Vector3()
    this.jt = 0
    this.jtMin = 0
    this.jtMax = Math.PI
    this.jumping = false
    this.jumpMax = Math.PI / 180
    this.jumpHeighten = 4
  }

  keyDown (key) {
    const target = this.keys[key]
    if (this.keys[key]) {
      target.press = true
      switch (key) {
        case KEYS.W:
        case KEYS.S:
        case KEYS.A:
        case KEYS.D:
          this.mKeys += 1
          break
        case KEYS.Space:
          break
        case KEYS.ShiftLeft:
          this.a = 16
          break
      }
    }
  }

  keyUp (key) {
    const target = this.keys[key]
    if (target) {
      target.press = false
      switch (key) {
        case KEYS.W:
        case KEYS.S:
        case KEYS.A:
        case KEYS.D:
          this.mKeys -= 1
          break
        case KEYS.Space:
          this.jumping = true
          break
        case KEYS.ShiftLeft:
          this.a = 8
          break
      }
    }
  }

  acceleration (time) {
    Object.values(this.keys).forEach(({ key, press }) => {
      const vMax = this.vMax[key]
      if (press && this.v.length() < vMax) {
        const t = new Vector3()
        this.player.getWorldDirection(t)
        switch (key) {
          case KEYS.W:
            this.v.add(t.multiplyScalar(-this.a * time))
            break
          case KEYS.S:
            this.v.add(t.multiplyScalar(this.a * time))
            break
          case KEYS.A:
            this.v.add(t.cross(this.yAxis).multiplyScalar(this.a * time))
            break
          case KEYS.D:
            this.v.add(this.yAxis.clone().cross(t).multiplyScalar(this.a * time))
            break
        }
      }
    })
  }

  damping () {
    this.v.addScaledVector(this.v, -this.d)
  }

  jump () {
    if (this.jumping) {
      if (this.jt < this.jtMax) {
        this.jt += Math.PI / 45 // step
        this.jv = this.yAxis.clone().multiplyScalar(Math.cos(this.jt) * this.jumpHeighten)
      } else {
        this.jt = this.jtMin
        this.jv.set(0, 0, 0)
        this.jumping = false
      }
    }
  }
}

class MouseController {
  constructor (player, playerCamera) {
    this.player = player
    this.playerCamera = playerCamera
    this.sensitivity = 500 // 鼠标灵敏度
    this.angleMin = MathUtils.degToRad(-30)
    this.angleMax = MathUtils.degToRad(15)
  }

  xAxisRotate (y) {
    const x = this.playerCamera.rotation.x - y / this.sensitivity
    if (x > this.angleMin && x < this.angleMax) {
      this.playerCamera.rotation.x = x
    }
  }

  yAxisRotate (x) {
    if (document.pointerLockElement === document.body) {
      this.player.rotation.y -= x / this.sensitivity
    }
  }
}

function init (player) {
  const [playerCamera] = player.children
  mc = new MouseController(player, playerCamera)
  kc = new KeyboardController(player)
}

document.addEventListener('keydown', function (e) {
  const key = e.code
  kc.keyDown(key)
}, false)

document.addEventListener('keyup', function (e) {
  const key = e.code
  kc.keyUp(key)
}, false)

document.addEventListener('mousemove', function (e) {
  const { movementX, movementY } = e
  mc.yAxisRotate(movementX)
  mc.xAxisRotate(movementY)
}, false)

document.addEventListener('mousedown', (event) => {
  document.body.requestPointerLock()
}, false)

export {
  kc,
  mc,
  init
}
