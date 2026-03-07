import './Table.css';

function Table({ children }: { children: React.ReactNode }) {
  return (
    <table className="hoam-table">
      <tbody>{children}</tbody>
    </table>
  );
}
export default Table;
