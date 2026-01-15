'use client';
import UpdateOrderFormAdmin from '@/components/order/UpdateOrderFormAdmin';
import ViewOrderFormAdmin from '@/components/order/ViewOrderFormAdmin';
import Button from '@/components/ui/button/Button';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { FaRegEdit } from 'react-icons/fa';
import { FaRegFloppyDisk } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

const page = () => {
    const [editOrder, setEditOrder] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();
    const orderId = params.orderId;

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/order/${orderId}`);
            if (!res.ok) throw new Error('Failed to fetch order details');
            const data = await res.json();
            setOrderData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (orderId) fetchOrder();
    }, [orderId]);

    const updateProduct = useCallback(async (data: any) => {
        try {
            setLoading(true);
            const restructureData = JSON.parse(JSON.stringify(data));
            restructureData.contactNumbers = restructureData.contactNumbers.filter((item: string) => (item !== null && item !== ''));
            const res = await fetch(`/api/order/${orderId}`, {
                method: 'POST',
                body: JSON.stringify(restructureData),
            });
            if (!res.ok) throw new Error('Failed to fetch order details');
            await res.json();
            fetchOrder();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        // your logic here
    }, []);

    const orderDetails = useMemo(() => {
        if (editOrder === true) {
            return <UpdateOrderFormAdmin orderData={orderData} submitData={updateProduct} cancelData={() => setEditOrder(false)} />
        } else {
            return <ViewOrderFormAdmin orderData={orderData} />
        }
    }, [editOrder, orderData])

    if (loading) return <div>Loading order details...</div>;
    if (error) return <div>Error: {error}</div>;
    return (
        <div>
            <div className='text-end'>
                {!editOrder && <Button size="md" variant="primary" startIcon={<FaRegEdit height={20} fontWeight={20} />} onClick={() => {
                    setEditOrder(true)
                }}>
                    Edit
                </Button>}
                {editOrder && <>
                    <Button size="md" variant="primary" startIcon={<FaRegFloppyDisk height={20} fontWeight={20} />} onClick={() => {
                        setEditOrder(false)
                    }}>
                        Save
                    </Button>
                    <Button size="md" variant="danger" className='ml-2' startIcon={<IoClose height={20} fontWeight={20} />} onClick={() => {
                        setEditOrder(false)
                    }}>
                        Cancel
                    </Button>
                </>}
            </div>
            {orderDetails}
        </div>
    );
}

export default page