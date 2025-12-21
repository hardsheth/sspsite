// ==============================|| MENU ITEMS - ORDER ||============================== //

import { FaLuggageCart, FaRegUser } from "react-icons/fa";

const ModulesComponents = {
    id: 'modules',
    title: 'Modules',
    type: 'group',
    children: [
        {
            id: 'order',
            title: 'Orders',
            type: 'item',
            icon: <FaLuggageCart  />,
            url: '/orders'
        },
        {
            id: 'customer',
            title: 'Customer',
            type: 'item',
            icon: <FaRegUser  />,
            url: '/customers'
        }
    ]
};

export default ModulesComponents;
