// ==============================|| MENU ITEMS - FORM ||============================== //

import { FaFileAlt } from 'react-icons/fa';

const formComponents = {
  id: 'forms',
  title: 'Forms',
  type: 'group',
  children: [
    {
      id: 'form-elements',
      title: 'Form Elements',
      type: 'collapse',
      icon: <FaFileAlt />,
      children: [
        {
          id: 'form-basic',
          title: 'Form Basic',
          type: 'item',
          url: '/forms/form-elements/basic'
        }
      ]
    }
  ]
};

export default formComponents;
