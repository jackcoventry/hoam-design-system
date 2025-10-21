import ColorSwatch from '@/components/ColorSwatch/ColorSwatch';
import React from 'react';

function ColorItem({ title, subtitle, colors = [] }) {
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
