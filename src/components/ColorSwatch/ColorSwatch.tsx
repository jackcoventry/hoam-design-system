import './ColorSwatch.css';

export type ColorProps = {
  name: string;
  value: string;
  cssVar?: string;
  colors: ColorProps[];
};

function ColorSwatch({ colors = [] }: Readonly<{ colors?: ColorProps[] }>) {
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
