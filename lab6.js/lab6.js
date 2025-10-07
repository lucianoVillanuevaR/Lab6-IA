// Lab IA - 06-10-2025
class Nodo {
  constructor(x, y, g = 0, h = 0, padre = null) {
    this.x = x;
    this.y = y;
    this.g = g; 
    this.h = h; 
    this.padre = padre;
  }
  get f() { return this.g + this.h; }
}
function crearGrilla(n, m, probBloqueo = 0.25) {
  const grilla = Array.from({ length: n }, () => Array(m).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (!(i === 0 && j === 0) && !(i === n - 1 && j === m - 1)) {
        if (Math.random() < probBloqueo) grilla[i][j] = 1;
      }
    }
  }
  return grilla;
}
function heuristicaEuclidiana(x, y, gx, gy) {
  return Math.sqrt((gx - x) ** 2 + (gy - y) ** 2);
}

function obtenerVecinos(nodo, grilla) {
  const movs = [[1,0],[-1,0],[0,1],[0,-1]]; 
  const res = [];
  for (const [dx, dy] of movs) {
    const nx = nodo.x + dx, ny = nodo.y + dy;
    if (nx >= 0 && ny >= 0 && nx < grilla.length && ny < grilla[0].length) {
      if (grilla[nx][ny] === 0) res.push([nx, ny]);
    }
  }
  return res;
}
function reconstruirCamino(nodo) {
  const camino = [];
  while (nodo) { camino.push([nodo.x, nodo.y]); nodo = nodo.padre; }
  return camino.reverse();
}

// metricas bestFirst y aStar

function ejecutarBusqueda(grilla, inicio, meta, tipo = "aStar") {
  const [sx, sy] = inicio;
  const [gx, gy] = meta;

  const abiertos = [new Nodo(sx, sy, 0, heuristicaEuclidiana(sx, sy, gx, gy))];
  const visitados = new Set();
  let expandidos = 0;

  while (abiertos.length > 0) {
    // Orden por criterio: Best First usa h; A* usa f=g+h
    abiertos.sort((a, b) => (tipo === "aStar" ? a.f - b.f : a.h - b.h));
    const actual = abiertos.shift();
    expandidos++;

    if (actual.x === gx && actual.y === gy) {
      const camino = reconstruirCamino(actual);
      return { camino, expandidos };
    }

    visitados.add(`${actual.x},${actual.y}`);

    for (const [nx, ny] of obtenerVecinos(actual, grilla)) {
      const clave = `${nx},${ny}`;
      if (!visitados.has(clave)) {
        const g = tipo === "aStar" ? actual.g + 1 : 0;
        const h = heuristicaEuclidiana(nx, ny, gx, gy);
        abiertos.push(new Nodo(nx, ny, g, h, actual));
      }
    }
  }
  return { camino: null, expandidos };
}


function dibujarConsola(grilla, camino, inicio, meta) {
  const n = grilla.length, m = grilla[0].length;
  const mapa = Array.from({ length: n }, () => Array(m).fill(" "));
  //bloqueos
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) mapa[i][j] = grilla[i][j] === 1 ? "#" : ".";
  }
  // Pintar camino
  if (camino) {
    for (const [x, y] of camino) {
      mapa[x][y] = "*";
    }
  }
  //meta y el inicio
  const [sx, sy] = inicio, [gx, gy] = meta;
  mapa[sx][sy] = "S";
  mapa[gx][gy] = "G";

  // Imprimir
  console.log("Mapa:");
  for (let i = 0; i < n; i++) {
    console.log(mapa[i].join(" "));
  }
}

(function main() {
  const n = 10;            //  pa filas
  const m = 15;            // pa columnas
  const bloqueo = 0.25;    // bloque en 0 o 1
  const inicio = [0, 0];
  const meta = [n - 1, m - 1];

  const grilla = crearGrilla(n, m, bloqueo);

  console.log("Grilla (0=libre, 1=bloqueado):");
  console.table(grilla);

  // Best First
  const t0b = performance.now?.() ?? Date.now();
  const resBest = ejecutarBusqueda(grilla, inicio, meta, "bestFirst");
  const t1b = performance.now?.() ?? Date.now();

  // A*
  const t0a = performance.now?.() ?? Date.now();
  const resA = ejecutarBusqueda(grilla, inicio, meta, "aStar");
  const t1a = performance.now?.() ?? Date.now();

  // Métricas
  const metBest = {
    algoritmo: "Best First",
    encontrado: !!resBest.camino,
    pasos: resBest.camino ? resBest.camino.length - 1 : null,
    expandidos: resBest.expandidos,
    ms: +(t1b - t0b).toFixed(2)
  };

  const metA = {
    algoritmo: "A*",
    encontrado: !!resA.camino,
    pasos: resA.camino ? resA.camino.length - 1 : null,
    expandidos: resA.expandidos,
    ms: +(t1a - t0a).toFixed(2)
  };

  console.log("\nMétricas:");
  console.table([metBest, metA]);

  console.log("\nVisualización Best First:");
  dibujarConsola(grilla, resBest.camino, inicio, meta);
  if (!resBest.camino) console.log("No se encontró camino con Best First.");

  console.log("\nVisualización A*:");
  dibujarConsola(grilla, resA.camino, inicio, meta);
  if (!resA.camino) console.log("No se encontró camino con A*.");

  // resumen auto para lo caminos 
  console.log("\nAnalisis rápido:");
  if (resBest.camino && resA.camino) {
    console.log(
      `A* pasos=${metA.pasos} vs Best First pasos=${metBest.pasos}. ` +
      (metA.pasos <= metBest.pasos
        ? "A* obtuvo camino igual o mas corto."
        : "En este caso, Best First salio con menos pasos.")
    );
  } else if (!resBest.camino && resA.camino) {
    console.log("Solo A* encontró camino en este mapa.");
  } else if (resBest.camino && !resA.camino) {
    console.log("Solo Best First encontro camino en este mapa.");
  } else {
    console.log("Ninguno encontró camino.");
  }
})();


