import Tokens from "@/styles/variables.json";

const DocTable = ({ children }) => {
  return <table>{children}</table>;
};

const ColorItem = ({ title = "", subtitle = "", colors = [] }) => {
  return (
    <tr>
      <td>
        {title}
        <br />
        {subtitle}
      </td>
      <td>
        {colors?.map((color) => (
          <div>{color}</div>
        ))}
      </td>
    </tr>
  );
};

const Items = ({ items = [], title }) => {
  return items?.length > 0 ? (
    <>
      {title && <h2>{title}</h2>}
      <DocTable>
        {items?.map((token) => {
          return (
            <ColorItem
              title={token?.name}
              subtitle={token?.cssVar}
              colors={[token?.value]}
            />
          );
        })}
      </DocTable>
    </>
  ) : null;
};

const Template = () => {
  const colorTokens = Tokens?.filter((token) => token?.type === "color");
  const globalTokens = colorTokens?.filter(
    (token) => token?.group === "global"
  );
  const fillTokens = colorTokens?.filter((token) => token?.group === "fill");
  const textTokens = colorTokens?.filter((token) => token?.group === "text");

  return (
    <>
      <Items items={colorTokens} title="All tokens" />
      <Items items={globalTokens} title="Global tokens" />
      <Items items={fillTokens} title="Fill tokens" />
      <Items items={textTokens} title="Text tokens" />
    </>
  );
};

export default {
  title: "Foundations/Colors",
  component: Template,
  argTypes: {},
};

export const Example = {
  args: {},
};
