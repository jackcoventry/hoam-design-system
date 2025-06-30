import Tokens from "@/styles/variables.json";

const Template = () => {
  const typography = ["title", "body", "label", "button"];
  const typographyTokens = Tokens?.filter(
    (token) => token?.type === "typography"
  );

  return typographyTokens?.length > 0 ? (
    <>
      <h1>Typography</h1>
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <th style={{ textAlign: "left" }}>Token</th>
            <th style={{ textAlign: "center" }}>Value</th>
            {/* <th style={{ textAlign: "center" }}>Size</th>
            <th style={{ textAlign: "center" }}>Weight</th>
            <th style={{ textAlign: "center" }}>Line Height</th> */}
          </tr>
          {typographyTokens?.map((token) => {
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
  title: "Foundations/Typography",
  component: Template,
  argTypes: {},
};

export const Example = {
  args: {},
};
