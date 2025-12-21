// ==============================|| MENU ITEMS - UI-COMPONENTS ||============================== //

import { FaPencilRuler } from "react-icons/fa";

const uiComponents = {
  id: 'group-ui-components',
  title: 'Ui Components',
  type: 'group',
  children: [
    {
      id: 'basic',
      title: 'Basic',
      icon: <FaPencilRuler />,
      type: 'collapse',
      children: [
        {
          id: 'buttons',
          title: 'Button',
          type: 'item',
          url: '/basic/buttons'
        },
        {
          id: 'badges',
          title: 'Badges',
          type: 'item',
          url: '/basic/badges'
        },
        {
          id: 'breadcrumb',
          title: 'Breadcrumb',
          type: 'item',
          url: '/basic/breadcrumb'
        },
        {
          id: 'collapse',
          title: 'Collapse',
          type: 'item',
          url: '/basic/collapse'
        },
        {
          id: 'tabs-pills',
          title: 'Tabs-pills',
          type: 'item',
          url: '/basic/tabs-pills'
        },
        {
          id: 'typography',
          title: 'Typography',
          type: 'item',
          url: '/basic/typography'
        }
      ]
    }
  ]
};

export default uiComponents;
