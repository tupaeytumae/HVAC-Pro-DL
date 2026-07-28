export function temperatureAtPressure(points, pressure) {
  let low = 0;
  let high = points.length - 1;

  if (pressure < points[0][0] || pressure > points[high][0]) {
    return null;
  }

  while (high - low > 1) {
    const middle = (low + high) >> 1;
    if (points[middle][0] <= pressure) {
      low = middle;
    } else {
      high = middle;
    }
  }

  const [p1, t1] = points[low];
  const [p2, t2] = points[high];
  return t1 + (pressure - p1) * (t2 - t1) / (p2 - p1);
}

export function calculate(measures, database) {
  const table = database.fluids[measures.ref];
  const evaporationTemperature = temperatureAtPressure(table.dew, measures.lp);
  const condensationTemperature = temperatureAtPressure(table.bubble, measures.hp);

  if (evaporationTemperature === null || condensationTemperature === null) {
    return null;
  }

  const superheat = measures.ts - evaporationTemperature;
  const subcooling = condensationTemperature - measures.tl;
  const deltaT = measures.mode === "cool"
    ? measures.tr - measures.ti
    : measures.ti - measures.tr;
  const compressionRatio =
    (measures.hp + database.meta.atmospheric_pressure_bar) /
    (measures.lp + database.meta.atmospheric_pressure_bar);

  return {
    tev: evaporationTemperature,
    tc: condensationTemperature,
    sh: superheat,
    sc: subcooling,
    deltaT,
    cr: compressionRatio,
    approach: condensationTemperature - measures.to,
    evapDelta: measures.tr - evaporationTemperature
  };
}
