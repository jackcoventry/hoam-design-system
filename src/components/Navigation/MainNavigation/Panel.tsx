type PanelProps = {
  id: string;
  labelledBy: string;
  hidden: boolean;
  onEnter: () => void;
  left: React.ReactNode;
  right: React.ReactNode;
};

function Panel({ id, labelledBy, hidden, onEnter, left, right }: Readonly<PanelProps>) {
  return (
    <div
      id={id}
      className="hoam-navigation__panel"
      aria-labelledby={labelledBy}
      hidden={hidden}
      onPointerEnter={onEnter}
    >
      <div className="container">
        <div className="grid">
          <div className="span-12 lg:span-8">{left}</div>
          <div className="span-12 lg:span-4">{right}</div>
        </div>
      </div>
    </div>
  );
}

export default Panel;
