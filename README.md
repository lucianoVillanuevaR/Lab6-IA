# Laboratorio IA – 6 de Octubre 2025

**Universidad del Bío-Bío – Ingeniería de Ejecución en Computación e Informática**  
---

## 🧠 Enunciado

Implementar un programa en **JavaScript (Node.js)** que obtenga el camino desde el nodo origen `(0,0)` hasta el nodo meta `(n-1,m-1)` en una grilla con celdas bloqueadas, utilizando:

- **Best-First Search (Greedy)** → solo heurística `h(n)`
- **A\*** → costo acumulado `g(n)` + heurística `h(n)`

La heurística corresponde a la **distancia euclidiana** entre la celda actual y la meta.

El sistema debe bloquear aleatoriamente algunas celdas de la grilla, manteniendo libres las posiciones inicial `(0,0)` y final `(n-1,m-1)`.

---

## ⚙️ Requisitos

- Tener instalado **Node.js** (v18 o superior).  
  Verificar instalación:
  ```bash
  node -v
🚀 Ejecución
1. Guarda el archivo lab6.js en una carpeta (por ejemplo ia/).
2. Abre una terminal dentro de esa carpeta.
3. Ejecuta: node lab6.js
4. El programa mostrará:

La grilla generada (0 = libre, 1 = bloqueado)

Métricas comparativas entre Best-First y A*:

Camino encontrado

Nodos expandidos

Cantidad de pasos

Tiempo (ms)

Una visualización en consola con los símbolos:
| Símbolo | Significado       |
| ------- | ----------------- |
| `S`     | Inicio (0,0)      |
| `G`     | Meta (n-1,m-1)    |
| `#`     | Celda bloqueada   |
| `*`     | Camino encontrado |
| `.`     | Celda libre       |


📚 Referencias

Clases IA – Luis Cabrera-Crot (UBB, 2025)

Russell & Norvig, Artificial Intelligence: A Modern Approach

Notas de clase: Solución de problemas mediante búsqueda informada
