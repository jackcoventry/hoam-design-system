import ColorSwatch, { ColorProps } from '@/components/ColorSwatch/ColorSwatch';

type Props = {
  title: string;
  subtitle?: string;
  colors: ColorProps[];
};

function ColorItem({ title, subtitle, colors = [] }: Readonly<Props>) {
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
}

export default ColorItem;
