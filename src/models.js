import {
  Object3D,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
  PointLight,
  TextureLoader,
  Color
} from 'three'
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js'
import { COLORS } from './constant'
import { random } from './utils'

class Clouds {
  constructor () {
    this.mesh = new Object3D()
    this.mesh.name = 'cloud'
    const geom = new BoxGeometry(1, 1, 1)
    const mat = new MeshBasicMaterial({
      color: COLORS.WHITE
    })

    const count = 600
    const verticalRange = [45, 55]
    const horizontalRange = [-300, 300]
    for (let i = 0; i < count; i++) {
      const m = new Mesh(geom.clone(), mat)

      m.position.y = random(...verticalRange)
      m.position.x = random(...horizontalRange)
      m.position.z = random(...horizontalRange)

      const sx = random(4, 16)
      const sy = 1
      const sz = random(4, 16)
      m.scale.set(sx, sy, sz)
      this.mesh.add(m)
      m.castShadow = true
      m.receiveShadow = true
    }
  }
}

class Sun {
  constructor (h, s, l, x, y, z) {
    const textureLoader = new TextureLoader()

    const textureFlare0 = textureLoader.load('/textures/sun.png')
    const textureFlare3 = textureLoader.load('/textures/halo.png')

    const sun = new PointLight(0xffffff, 1, 2000, 0.01)
    sun.color.setHSL(h, s, l)
    sun.position.set(x, y, z)

    const lensflare = new Lensflare()
    lensflare.addElement(new LensflareElement(textureFlare0, 200, 0, new Color(0xeeeeee)))
    lensflare.addElement(new LensflareElement(textureFlare3, 20, 0.74, new Color(0x33ff33)))
    lensflare.addElement(new LensflareElement(textureFlare3, 100, 0.8))
    lensflare.addElement(new LensflareElement(textureFlare3, 30, 1, new Color(0x48c9b0)))
    sun.add(lensflare)

    return sun
  }
}

export {
  Clouds,
  Sun
}
