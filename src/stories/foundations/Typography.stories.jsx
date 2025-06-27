import Tokens from "@/styles/variables.json";

const Template = () => {
  const typography = ["title", "body", "label", "button"];

  return Tokens?.typography ? (
    <>
      <h1>Typography</h1>
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <th style={{ textAlign: "left" }}>Token</th>
            <th style={{ textAlign: "center" }}>Size</th>
            <th style={{ textAlign: "center" }}>Weight</th>
            <th style={{ textAlign: "center" }}>Line Height</th>
          </tr>
          {typography?.map((type) => {
            const titles = Tokens?.typography[type];
            return Object.values(titles).map((title, index) => {
              const name = `--hoam-typography-${type}-${Object.keys(titles)[index]}`;

              return (
                <tr>
                  <td style={{ textAlign: "left" }}>{name}</td>
                  <td style={{ textAlign: "center" }}>{title.fontSize}</td>
                  <td style={{ textAlign: "center" }}>{title.fontWeight}</td>
                  <td style={{ textAlign: "center" }}>{title.lineHeight}</td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </>
  ) : null;
};

export default {
  title: "Foundations/Typography",
  component: Template,
  argTypes: {},
};

export const Example = {
  args: {},
};
