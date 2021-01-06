import React, { useState, useEffect, useRef } from 'react';
import { CompactPicker } from 'react-color';
import './App.css';

function App() {
  const [height, setHeight] = useState(720);
  const [width, setWidth] = useState(1280);
  const [toolColor, setToolColor] = useState("#000000");
  const [currTool, setCurrTool] = useState("pencil");
  const [rows, setRows] = useState([]);
  const canvas = useRef();
  const cellRefs = useRef([]);

  const cellSize = 25;
  const tools = [{name: "pencil", icon: "✏️"}, 
                 {name: "fill", icon: "🌊"}];

  const rgbToHex = col => {
    if (col.charAt(0)==='r') {
      col=col.replace('rgb(','').replace(')','').split(',');
      var r=parseInt(col[0], 10).toString(16);
      var g=parseInt(col[1], 10).toString(16);
      var b=parseInt(col[2], 10).toString(16);
      r=r.length===1?'0'+r:r; g=g.length===1?'0'+g:g; b=b.length===1?'0'+b:b;
      var colHex='#'+r+g+b;
      return colHex;
    }
    return col;
  }

  const drawCanvas = e => {
    if (e)
      e.preventDefault();

    canvas.current.style.height = `${height}px`;
    canvas.current.style.width = `${width}px`;

    let localRows = [];

    for (let i = 0; i < (width / cellSize); i++) {
      cellRefs.current.push([]);
      localRows.push([]);
      for (let j = 0; j < (height / cellSize); j++) {
        cellRefs.current[i].push(null);
        localRows[i].push([i, j]);
      } 
    }

    setRows(localRows);
  }

  const handleChangeDimension = e => {
    e.preventDefault();

    if (e.target.name === "height")
      setHeight(Math.min(e.target.value, 720));
    else
      setWidth(Math.min(e.target.value, 1280));
  }

  const handleChangeColor = color => {
    setToolColor(color.hex);
  }

  const handleClickTool = e => {
    setCurrTool(e.target.ariaLabel);
  }

  const handleClickCell = e => {
    e.preventDefault();
    let bgHex = rgbToHex(e.target.style.backgroundColor);

    if (bgHex !== toolColor) {
      if (currTool === "pencil")
        e.target.style.backgroundColor = toolColor;
      else
        fillFrom(JSON.parse(e.target.id), bgHex, toolColor);
    }
  }

  const fillFrom = (cellCoords, cellColor, toolColor) => {
    if (cellCoords[0] < 0 || cellCoords[0] >= (width / cellSize) ||
        cellCoords[1] < 0 || cellCoords[1] >= (height / cellSize))
      return;

    let currColor = rgbToHex(
      cellRefs.current[cellCoords[0]][cellCoords[1]].style.backgroundColor
    );

    if (currColor === toolColor || currColor !== cellColor)
      return;

    cellRefs.current[cellCoords[0]][cellCoords[1]].style.backgroundColor
      = toolColor;

    fillFrom([cellCoords[0], cellCoords[1] - 1], cellColor, toolColor);
    fillFrom([cellCoords[0] + 1, cellCoords[1]], cellColor, toolColor);
    fillFrom([cellCoords[0], cellCoords[1] + 1], cellColor, toolColor);
    fillFrom([cellCoords[0] - 1, cellCoords[1]], cellColor, toolColor);
  }

  const grid = rows.map(row => {
    return <div> {
      row.map(coords => {
          return <div 
                    className="Cell"
                    style={{backgroundColor:"#ffffff"}}
                    id={JSON.stringify(coords)}
                    ref={cellRef => 
                          cellRefs.current[coords[0]][coords[1]] = cellRef}
                    onClick={handleClickCell}
          ></div>
      })
    } </div>
  });

  useEffect(() => {
    drawCanvas();
  }, []);

  return (
    <div className="App">

      <h1>
        <span role="img" aria-label="can">🍁 </span>
        CANPaint
        <span role="img" aria-label="paint"> 🎨🖌️</span>
      </h1>
      
      <div className="CanvasContainer">
        <CompactPicker
            color={toolColor}
            onChangeComplete={handleChangeColor}
        />

        <form 
            id="Dimensions" 
            className="Option" 
            onSubmit={drawCanvas}>
          <label>
            Height (px)
            <input 
                type="number" name="height" value={height}
                onChange={handleChangeDimension} 
            />
          </label>
          <label>
            Width (px)
            <input 
                type="number" name="width" value={width}
                onChange={handleChangeDimension}
            />
          </label>
          <input type="submit" value="Set Canvas" />
        </form>

        <div id="Tools" className="Option">
          {
            tools.map(tool => {
              return (
                <span 
                    role="img"
                    className={
                      `${currTool === tool.name ? "Selected" : "Deselected"}`
                    }
                    onClick={handleClickTool}
                    aria-label={tool.name}
                >{tool.icon}</span>
              );
            })
          }
        </div>

        <div className="Canvas" ref={canvas}>
          {grid}
        </div>

      </div>

    </div>
  );
}

export default App;
