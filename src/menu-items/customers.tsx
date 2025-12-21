// ==============================|| MENU ITEMS - ORDER ||============================== //

import { FaRegUser } from "react-icons/fa";

const CustomerComponents = {
    id: 'customer',
    title: 'Customer',
    type: 'group',
    children: [
        {
            id: 'customer',
            title: 'Customer',
            type: 'item',
            icon: <FaRegUser  />,
            url: '/orders'
        }
    ]
};

export default CustomerComponents;
