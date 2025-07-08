import Tokens from "@/styles/variables.json";

const Template = () => {
  const colorTokens = Tokens?.filter((token) => token?.type === "color");

  return colorTokens?.length > 0 ? (
    <>
      <h1>Colors</h1>
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <th style={{ textAlign: "left" }}>Token</th>
            <th style={{ textAlign: "center" }}>Value</th>
          </tr>
          {colorTokens?.map((token) => {
            return (
              <tr>
                <td
                  style={{
                    textAlign: "left",
                    font: `var(${token?.cssVar}`,
                  }}
                >
                  {token?.cssVar}
                </td>
                <td style={{ textAlign: "center" }}>{token?.value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  ) : null;
};

export default {
  title: "Foundations/Colors",
  component: Template,
  argTypes: {},
};

export const Example = {
  args: {},
};
