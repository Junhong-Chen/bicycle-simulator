function strip (num, precision = 12) {
  return +parseFloat(num.toPrecision(precision))
}

function random (min, max) {
  return min + Math.random() * (max - min)
}

export {
  strip,
  random
}
