import type {
  NavGroupItem,
  NavLeafItem,
  NavigationLayout,
} from '@/components/Navigation/types/Navigation.types';
import { groupBtnId, groupPanelId } from '@/components/Navigation/utils/helpers';

type ThirdLevelItemsProps = {
  parent: NavGroupItem;
  items: NavLeafItem[];
  open: boolean;
  layout?: NavigationLayout;
};

function ThirdLevelItems({ parent, items, open, layout = 'list' }: Readonly<ThirdLevelItemsProps>) {
  return (
    <div
      id={groupPanelId(parent.id)}
      className="hoam-navigation__panel-sub-level"
      aria-labelledby={groupBtnId(parent.id)}
      hidden={!open}
      data-layout={layout}
    >
      <div className="hoam-navigation__panel-group">
        {layout === 'thumbnail' ? (
          <div className="container-fluid">
            <div className="grid">
              <div className="span-12">
                <div className="hoam-navigation__panel-group-section">
                  {parent.href ? (
                    <a
                      href={parent.href}
                      data-sub-link
                      className="hoam-navigation__panel-group-header"
                    >
                      {parent.label}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="hoam-navigation__panel-group-section">
            {parent.href ? (
              <a
                href={parent.href}
                data-sub-link
                className="hoam-navigation__panel-group-header"
              >
                {parent.label}
              </a>
            ) : null}
          </div>
        )}

        {layout === 'thumbnail' ? (
          <div className="container-fluid">
            <div className="grid">
              {items.map((item) => (
                <div
                  className="span-12 md:span-4"
                  key={item.id}
                >
                  <div className="hoam-navigation__panel-group-section">
                    <a
                      href={item.href}
                      data-sub-link
                      tabIndex={open ? 0 : -1}
                      className="hoam-navigation__panel-group-header"
                    >
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.label}
                        />
                      ) : null}

                      {item.label}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="hoam-navigation__panel-group-section"
            >
              <a
                href={item.href}
                data-sub-link
                tabIndex={open ? 0 : -1}
                className="hoam-navigation__panel-group-header"
              >
                {item.label}
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ThirdLevelItems;
