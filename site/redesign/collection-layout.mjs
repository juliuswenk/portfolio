export function assetFootprint(points, [x, y, z]) {
  if (!points.length || points.length % 3 || !points.every(Number.isFinite) || ![x, y, z].every(Number.isFinite)) throw new Error('Asset footprint needs finite geometry and rotation.');
  const sx = Math.sin(x / 2), cx = Math.cos(x / 2), sy = Math.sin(y / 2), cy = Math.cos(y / 2), sz = Math.sin(z / 2), cz = Math.cos(z / 2);
  const q = { x: sx * cy * cz + cx * sy * sz, y: cx * sy * cz - sx * cy * sz, z: cx * cy * sz + sx * sy * cz, w: cx * cy * cz - sx * sy * sz };
  const min = [Infinity, Infinity], max = [-Infinity, -Infinity];
  for (let i = 0; i < points.length; i += 3) {
    const x = points[i], y = points[i + 1], z = points[i + 2];
    const tx = 2 * (q.y * z - q.z * y), ty = 2 * (q.z * x - q.x * z), tz = 2 * (q.x * y - q.y * x);
    const p = [x + q.w * tx + q.y * tz - q.z * ty, y + q.w * ty + q.z * tx - q.x * tz];
    for (let k = 0; k < 2; k++) { min[k] = Math.min(min[k], p[k]);max[k] = Math.max(max[k], p[k]); }
  }
  return { width: max[0] - min[0], height: max[1] - min[1], centerX: (min[0] + max[0]) / 2, centerY: (min[1] + max[1]) / 2 };
}

export function collectionLayout({ width, height, left, right, top, bottom }, footprints) {
  if (![width, height, left, right, top, bottom].every(Number.isFinite) || width <= 0 || height <= 0 || left < 0 || top < 0 || right > width || bottom > height || right <= left || bottom <= top || !footprints.length || footprints.some(f => ![f.width, f.height, f.centerX, f.centerY].every(Number.isFinite) || f.width <= 0 || f.height <= 0)) throw new Error('Collection needs a valid viewport, usable area and asset footprints.');
  const usableWidth = right - left, usableHeight = bottom - top;
  const columns = Math.min(width > height ? 3 : 2, footprints.length), rows = Math.ceil(footprints.length / columns);
  const cellWidth = usableWidth / columns, cellHeight = usableHeight / rows;
  const targetPixels = Math.max(110, Math.min(240, .3 * Math.min(usableWidth, usableHeight)));
  // The fit limit can override the 110px goal on short screens; retain 20% space for motion.
  const fittedPixels = Math.min(targetPixels,
    ...footprints.map(f => Math.min(cellWidth * .8 / (f.width / 2), cellHeight * .8 / (f.height / 2))));
  const unitsPerPixel = 2 * 16 * Math.tan(38 * Math.PI / 360) / height;
  const scale = fittedPixels * unitsPerPixel / 2;
  const positions = footprints.map((f, index) => {
    const row = Math.floor(index / columns), column = index % columns;
    const rowCount = Math.min(columns, footprints.length - row * columns);
    return {
      x: (column - (rowCount - 1) / 2) * cellWidth * unitsPerPixel - f.centerX * scale,
      y: (usableHeight / 2 - (row + .5) * cellHeight) * unitsPerPixel - f.centerY * scale
    };
  });
  return {
    columns, rows, targetPixels, fittedPixels, scale, positions,
    halfWidth: usableWidth * unitsPerPixel / 2, halfHeight: usableHeight * unitsPerPixel / 2,
    cameraX: (width / 2 - (left + right) / 2) * unitsPerPixel,
    cameraY: ((top + bottom) / 2 - height / 2) * unitsPerPixel,
    jitter: Math.min(6, .04 * Math.min(cellWidth, cellHeight)) * unitsPerPixel
  };
}
