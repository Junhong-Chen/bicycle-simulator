import * as THREE from 'three'
const transformed = new THREE.Vector3()
const moveEvents = {
  moveKeys: 0,
  transformed,
  keys: {
    KeyW: {
      press: false,
      handle: () => {
        transformed.z = -0.1
      }
    },
    KeyS: {
      press: false,
      handle: () => {
        transformed.z = 0.1
      }
    },
    KeyA: {
      press: false,
      handle: () => {
        transformed.x = -0.1
      }
    },
    KeyD: {
      press: false,
      handle: () => {
        transformed.x = 0.1
      }
    },
  }
}

const jumpEvents = {
  keys: {
    Space: {
      press: false,
      handle: () => {
        // do something...
      }
    }
  }
}

document.addEventListener('keydown', function (e) {
  const key = e.code
  moveEvents.keys[key] && (moveEvents.keys[key].press = true, moveEvents.moveKeys += 1)
}, false)

document.addEventListener('keyup', function (e) {
  const key = e.code
  moveEvents.keys[key] && (moveEvents.keys[key].press = false, moveEvents.moveKeys -= 1)
}, false)

export {
  moveEvents
};