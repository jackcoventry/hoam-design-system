import { groupBtnId, groupPanelId, NavItem } from '@/components/Navigation/Navigation.types';

type ThirdLevelItemsProps = {
  parent: NavItem;
  items: Array<NavItem>;
  open: boolean;
  layout?: 'list' | 'thumbnail';
};

function ThirdLevelItems({ parent, items, open, layout = 'list' }: Readonly<ThirdLevelItemsProps>) {
  return (
    <div
      id={groupPanelId(parent?.id)}
      className="hoam-navigation__panel-sub-level"
      aria-labelledby={groupBtnId(parent?.id)}
      hidden={!open}
      data-layout={layout}
    >
      <div className="hoam-navigation__panel-group">
        {/* The section title shouldn't wrap with the thumbnail variant  */}
        {layout === 'thumbnail' ? (
          <div className="container-fluid">
            <div className="grid">
              <div className="span-12">
                <div className="hoam-navigation__panel-group-section">
                  {parent.href && (
                    <a
                      href={parent.href}
                      data-sub-link
                      className="hoam-navigation__panel-group-header"
                    >
                      {parent.label}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="hoam-navigation__panel-group-section">
            {parent.href && (
              <a
                href={parent.href}
                data-sub-link
                className="hoam-navigation__panel-group-header"
              >
                {parent.label}
              </a>
            )}
          </div>
        )}

        {/* The thumbnail variant needs to have grid layout */}
        {layout === 'thumbnail' ? (
          <div className="container-fluid">
            <div className="grid">
              {items.map((i) => (
                <div
                  className="span-12 md:span-4"
                  key={i.id}
                >
                  <div className="hoam-navigation__panel-group-section">
                    <a
                      href={i.href}
                      data-sub-link
                      tabIndex={open ? 0 : -1}
                      className="hoam-navigation__panel-group-header"
                    >
                      {layout === 'thumbnail' && (
                        <img
                          src={i.thumbnail}
                          alt={i.label}
                        />
                      )}

                      {i.label}
                    </a>

                    {i.items?.map((child) => (
                      <a
                        href={child.href}
                        key={child.id}
                        data-sub-link
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          items.map((i) => (
            <div
              key={i.id}
              className="hoam-navigation__panel-group-section"
            >
              <a
                href={i.href}
                data-sub-link
                tabIndex={open ? 0 : -1}
                className="hoam-navigation__panel-group-header"
              >
                {i.label}
              </a>

              {i.items?.map((child) => (
                <a
                  href={child.href}
                  key={child.id}
                  data-sub-link
                >
                  {child.label}
                </a>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ThirdLevelItems;
