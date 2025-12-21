// ==============================|| MENU ITEMS - CHARTS & MAPS ||============================== //

import { FaChartPie, FaMap } from 'react-icons/fa';

const chartsMaps = {
  id: 'charts-maps',
  title: 'Charts-maps',
  type: 'group',
  children: [
    {
      id: 'charts',
      title: 'Charts',
      type: 'collapse',
      icon: <FaChartPie />,
      children: [
        {
          id: 'apex-chart',
          title: 'Apex chart',
          type: 'item',
          url: '/charts/apex-chart'
        }
      ]
    },
  
  ]
};

export default chartsMaps;
