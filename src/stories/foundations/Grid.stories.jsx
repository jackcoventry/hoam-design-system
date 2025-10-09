const Template = () => {
  return (
    <div className="container">
      <div className="my-xl">
        <h2>Basic Grid</h2>
      </div>
      <div className="grid gap-lg">
        <div className="span-12 md:span-8">
          <section className="demo-block">Main content</section>
        </div>
        <aside className="span-12 md:span-4">
          <div className="demo-block">Sidebar</div>
        </aside>
      </div>
      <div className="my-xl">
        <h2>Auto Grid</h2>
      </div>
      <div className="grid-auto">
        <div className="demo-block">Item</div>
        <div className="demo-block">Item</div>
        <div className="demo-block">Item</div>
        <div className="demo-block">Item</div>
      </div>
    </div>
  );
};

export default {
  title: "Foundations/Grid",
  component: Template,
  argTypes: {},
};

export const Example = {
  args: {},
};
