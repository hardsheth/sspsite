// ==============================|| MENU ITEMS - ORDER ||============================== //

import { FaLuggageCart } from "react-icons/fa";

const OrderComponents = {
    id: 'orders',
    title: 'Orders',
    type: 'group',
    children: [
        {
            id: 'order',
            title: 'Orders',
            type: 'item',
            icon: <FaLuggageCart />,
            url: '/orders'
        }
    ]
};

export default OrderComponents;
