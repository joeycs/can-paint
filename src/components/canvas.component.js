import React, { Component, createRef } from "react";
import "../App.css";

export default class Canvas extends Component {
  constructor(props) {
    super(props);

    this.drawCanvas = this.drawCanvas.bind(this);
    this.rgbToHex = this.rgbToHex.bind(this);
    this.onClickCell = this.onClickCell.bind(this);
    this.fillFrom = this.fillFrom.bind(this);

    this.cellRefs = createRef();
    this.state = { rows: [] };
  }

  componentDidMount() {
    this.drawCanvas();
  }

  drawCanvas() {
    this.cellRefs.current = [];
    let localRows = [];

    for (let i = 0; i < this.props.width / this.props.cellSize; i++) {
      this.cellRefs.current.push([]);
      localRows.push([]);
      for (let j = 0; j < this.props.height / this.props.cellSize; j++) {
        this.cellRefs.current[i].push(null);
        localRows[i].push([i, j]);
      }
    }

    this.setState({ rows: localRows });
  }

  rgbToHex(col) {
    if (col.charAt(0) === "r") {
      col = col.replace("rgb(", "").replace(")", "").split(",");
      var r = parseInt(col[0], 10).toString(16);
      var g = parseInt(col[1], 10).toString(16);
      var b = parseInt(col[2], 10).toString(16);
      r = r.length === 1 ? "0" + r : r;
      g = g.length === 1 ? "0" + g : g;
      b = b.length === 1 ? "0" + b : b;
      var colHex = "#" + r + g + b;
      return colHex;
    }
    return col;
  }

  onClickCell(e) {
    e.preventDefault();
    let cellCoords = JSON.parse(e.target.id);
    let bgHex = this.rgbToHex(e.target.style.backgroundColor);

    if (bgHex !== this.props.toolColor) {
      if (this.props.currTool === "pencil")
        e.target.style.backgroundColor = this.props.toolColor;
      else this.fillFrom(cellCoords, bgHex, this.props.toolColor);
    }
  }

  fillFrom(cellCoords, cellColor, toolColor) {
    if (
      cellCoords[0] < 0 ||
      cellCoords[0] >= this.props.width / this.props.cellSize ||
      cellCoords[1] < 0 ||
      cellCoords[1] >= this.props.height / this.props.cellSize
    )
      return;

    let currColor = this.rgbToHex(
      this.cellRefs.current[cellCoords[0]][cellCoords[1]].style.backgroundColor
    );

    if (currColor === toolColor || currColor !== cellColor) return;

    this.cellRefs.current[cellCoords[0]][
      cellCoords[1]
    ].style.backgroundColor = toolColor;

    this.fillFrom([cellCoords[0], cellCoords[1] - 1], cellColor, toolColor);
    this.fillFrom([cellCoords[0] + 1, cellCoords[1]], cellColor, toolColor);
    this.fillFrom([cellCoords[0], cellCoords[1] + 1], cellColor, toolColor);
    this.fillFrom([cellCoords[0] - 1, cellCoords[1]], cellColor, toolColor);
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          height: `${this.props.height}px`,
          width: `${this.props.width}px`,
        }}
      >
        {this.state.rows.map((row) => {
          return (
            <div key={row}>
              {" "}
              {row.map((coords) => {
                return (
                  <div
                    className="Cell"
                    key={coords}
                    id={JSON.stringify(coords)}
                    onClick={this.onClickCell}
                    style={{ backgroundColor: "#ffffff" }}
                    ref={(cellRef) => {
                      this.cellRefs.current[coords[0]][coords[1]] = cellRef;
                    }}
                  ></div>
                );
              })}{" "}
            </div>
          );
        })}
      </div>
    );
  }
}
