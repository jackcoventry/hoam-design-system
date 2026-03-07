import './ColorSwatch.css';

// TODO: this might be a demo-only component, consider moving to stories
function ColorSwatch({ colors = [] }: { colors?: { name: string; value: string }[] }) {
  return (
    <div className="hoam-color-swatch">
      {colors?.map((color) => (
        <div
          className="hoam-color-swatch__item"
          key={color?.name}
        >
          <div
            className="hoam-color-swatch__color"
            style={{ backgroundColor: color?.value }}
          ></div>
          <p>
            {color?.name} - {color?.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ColorSwatch;
