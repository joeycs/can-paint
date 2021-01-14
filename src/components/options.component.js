import React, { Component } from "react";
import { CompactPicker } from "react-color";
import "../App.css";

export default class Options extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tools: [
        { name: "pencil", icon: "✏️" },
        { name: "fill", icon: "🌊" },
      ],
    };
  }

  render() {
    return (
      <div className="Options">
        <CompactPicker
          color={this.props.toolColor}
          onChangeComplete={this.props.onChangeColor}
        />

        {/* <form onSubmit={this.props.onSetCanvas}>
          <label>
            Height (px)
            <input
              type="number"
              name="height"
              value={this.props.height}
              onChange={this.props.onChangeDimension}
            />
          </label>
          <label>
            Width (px)
            <input
              type="number"
              name="width"
              value={this.props.width}
              onChange={this.props.onChangeDimension}
            />
          </label>
          <input type="submit" value="Set Canvas" />
        </form> */}

        <div style={{ cursor: "pointer", top: "330px", fontSize: "50px" }}>
          {this.state.tools.map((tool) => {
            return (
              <span
                role="img"
                key={tool.name}
                className={`${
                  this.props.currTool === tool.name ? "Selected" : "Deselected"
                }`}
                onClick={this.props.onChangeTool}
                aria-label={tool.name}
              >
                {tool.icon}
              </span>
            );
          })}
        </div>
      </div>
    );
  }
}
