import React, { useState } from "react";
import Canvas from "./components/canvas.component";
import Options from "./components/options.component";
import "./App.css";

function App() {
  const [height, setHeight] = useState(720);
  const [width, setWidth] = useState(1280);
  const [toolColor, setToolColor] = useState("#000000");
  const [currTool, setCurrTool] = useState("pencil");

  const onChangeDimension = (e) => {
    e.preventDefault();

    if (e.target.name === "height")
      setHeight(Math.min(e.target.value, 720));
    else setWidth(Math.min(e.target.value, 1280));
  };

  const onChangeColor = (color) => {
    setToolColor(color.hex);
  };

  const onChangeTool = (e) => {
    e.preventDefault();
    setCurrTool(e.target.ariaLabel);
  };

  return (
    <div className="App">
      <h1>
        <span role="img" aria-label="can">
          🍁{" "}
        </span>
        CANPaint
        <span role="img" aria-label="paint">
          {" "}
          🎨🖌️
        </span>
      </h1>

      <div className="Container">
        <Options
          height={height}
          width={width}
          currTool={currTool}
          toolColor={toolColor}
          onChangeDimension={onChangeDimension}
          onChangeColor={onChangeColor}
          onChangeTool={onChangeTool}
        />
        <Canvas
          height={height}
          width={width}
          currTool={currTool}
          toolColor={toolColor}
          cellSize={25}
        />
      </div>
    </div>
  );
}

export default App;
