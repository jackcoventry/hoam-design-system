import Tokens from "@/styles/variables.json";
import groupBy from "@/utils/group-by";
import Table from "@/components/Table/Table";
import ColorSwatch from "@/components/ColorSwatch/ColorSwatch";

const DocTable = ({ children }) => {
  return <Table>{children}</Table>;
};

const ColorItem = ({ title, subtitle, colors = [] }) => {
  return (
    <tr className="hoam-table__row">
      <td className="hoam-table__cell">
        {title && <h3>{title}</h3>}
        {subtitle && <p>{subtitle}</p>}
      </td>
      <td className="hoam-table__cell">
        <ColorSwatch colors={colors} />
      </td>
    </tr>
  );
};

const TokenList = ({ items = [], title }) => {
  return items?.length > 0 ? (
    <>
      {title && <h2>{title}</h2>}
      <DocTable>
        {items?.map((token) => {
          return (
            <ColorItem
              title={token?.name}
              subtitle={token?.cssVar}
              colors={[
                {
                  name: token?.value,
                  value: token?.value,
                },
              ]}
            />
          );
        })}
      </DocTable>
    </>
  ) : null;
};

const TokenSet = ({ items = [] }) => {
  return items?.length > 0 ? (
    <DocTable>
      {items?.map((token) => {
        return <ColorItem title={token?.name} colors={token?.items} />;
      })}
    </DocTable>
  ) : null;
};

const Template = () => {
  const colorTokens = Tokens?.filter((token) => token?.type === "color");

  const globalTokens = colorTokens?.filter(
    (token) => token?.group === "global"
  );
  const fillTokens = colorTokens?.filter((token) => token?.group === "fill");
  const textTokens = colorTokens?.filter((token) => token?.group === "text");

  // TODO: extract this logic elsewhere
  const colorsBySet = Array.from(
    groupBy(colorTokens, (token) => token?.set).entries()
  );

  const colorTokensBySet = colorsBySet.map((set) => {
    return {
      name: set[0],
      items: set[1],
    };
  });

  console.log(colorTokensBySet);

  return (
    <>
      <TokenSet items={colorTokensBySet} />

      <TokenList items={colorTokens} title="All tokens" />
      <TokenList items={globalTokens} title="Global tokens" />
      <TokenList items={fillTokens} title="Fill tokens" />
      <TokenList items={textTokens} title="Text tokens" />
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
