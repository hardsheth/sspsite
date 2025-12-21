import { FaHome } from "react-icons/fa";


const navigation = {
  id: 'group-dashboard-loading-unique',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      icon: <FaHome />,
      url: '/'
    }
  ]
};

export default navigation;
