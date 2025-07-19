import React from "react";
import "./ColorSwatch.css";

// TODO: this might be a demo-only component, consider moving to stories
function ColorSwatch({
  colors = [],
}: {
  colors?: { name: string; value: string; textColor: string }[];
}) {
  return (
    <div className="hoam-color-swatch">
      {colors?.map((color) => (
        <div
          className="hoam-color-swatch__item"
          key={color?.name}
          style={{ backgroundColor: color?.value, color: color?.textColor }}
        >
          {color?.name} - {color?.value} - poo - {color?.textColor} - wee
        </div>
      ))}
    </div>
  );
}

export default ColorSwatch;
