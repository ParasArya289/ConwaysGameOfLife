import { useCallback, useEffect, useRef, useState } from "react";
import { produce } from "immer";
import "./App.css";
import { Create2DArray, operations } from "./lib/helpers";
const NUM_ROWS = 30;
const NUM_COLUMNS = 30;

export default function App() {
  const [grid, setGrid] = useState(Create2DArray(NUM_COLUMNS, NUM_ROWS));
  const [isRunning, setIsRunning] = useState(false);
  const runningRef = useRef(false);
  const [highlightDeadToAlive, setHighlightDeadToAlive] = useState(true);
  const countNeighbors = (grid, x, y) => {
    return operations.reduce((acc, [i, j]) => {
      const row = (x + i + NUM_ROWS) % NUM_ROWS;
      const col = (y + j + NUM_COLUMNS) % NUM_COLUMNS;
      acc += grid[row][col];
      return acc;
    }, 0);
  };
  const runSimulation = useCallback(() => {
    if (runningRef.current === false) return;
    setGrid((prevGrid) => {
      return produce(prevGrid, (newGrid) => {
        for (let i = 0; i < NUM_ROWS; i++) {
          for (let j = 0; j < NUM_COLUMNS; j++) {
            let neighbors = countNeighbors(prevGrid, i, j);
            if (neighbors < 2 || neighbors > 3) {
              newGrid[i][j] = 0;
            } else if (newGrid[i][j] === 0 && neighbors === 3) {
              newGrid[i][j] = 1;
            }
          }
        }
      });
    });
    setTimeout(runSimulation, 100);
  }, []);
  const randomizeGrid = () => {
    setGrid(Create2DArray(NUM_COLUMNS, NUM_ROWS, true));
  };
  const selectBox = (e) => {
    const { target } = e;
    const x = parseInt(target.getAttribute("data-x"));
    const y = parseInt(target.getAttribute("data-y"));
    if (isNaN(x) && isNaN(y)) return;
    setGrid((prevGrid) => {
      return produce(prevGrid, (newGrid) => {
        newGrid[x][y] ? (newGrid[x][y] = 0) : (newGrid[x][y] = 1);
      });
    });
  };
  const resetGrid = () => {
    setGrid(Create2DArray(NUM_COLUMNS, NUM_ROWS));
    setIsRunning(false);
    runningRef.current = false;
  };
  useEffect(() => {
    if (isRunning) {
      runSimulation();
    }
  }, [isRunning]);

  return (
    <main>
      <button
        onClick={() => {
          setIsRunning((prev) => {
            runningRef.current = !prev;
            return !prev;
          });
        }}
      >
        {isRunning ? "Stop" : "Start"}
      </button>
      <button onClick={randomizeGrid}>Randomize</button>
      <button onClick={resetGrid}>Reset</button>
      <button
        onClick={() => setHighlightDeadToAlive((prev) => !prev)}
        style={{ backgroundColor: highlightDeadToAlive && "yellow" }}
      >
        Highlight Dead To Alive Cell
      </button>
      <div className="game-grid" onClick={selectBox}>
        {grid.map((rows, i) => {
          return rows.map((item, j) => {
            return (
              <div
                key={`${i}-${j}`}
                data-x={i}
                data-y={j}
                data-animate={highlightDeadToAlive}
                className={`box ${item ? "alive" : "dead"}`}
              />
            );
          });
        })}
      </div>
    </main>
  );
}
