import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface Order {
    _id: string;
    user: { name: string } | null;
    createdAt: string;
    totalAmount: number;
    status: string;
}

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/orders', {
                credentials: 'include'
            });
            const data = await res.json();
            if (res.ok) {
                setOrders(data);
            }
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
                credentials: 'include'
            });

            if (res.ok) {
                toast.success('Order status updated');
                fetchOrders(); // Refresh
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'processing': return 'bg-blue-500 hover:bg-blue-600';
            case 'shipped': return 'bg-purple-500 hover:bg-purple-600';
            case 'delivered': return 'bg-green-500 hover:bg-green-600';
            case 'cancelled': return 'bg-red-500 hover:bg-red-600';
            default: return 'bg-gray-500';
        }
    };

    if (loading) return <div>Loading orders...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Orders</h2>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell className="font-mono text-sm">{order._id.substring(0, 8)}...</TableCell>
                                <TableCell>{order.user?.name || 'Guest/Deleted'}</TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>${order.totalAmount}</TableCell>
                                <TableCell>
                                    <Badge className={`${getStatusColor(order.status)} text-white border-0`}>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        defaultValue={order.status}
                                        onValueChange={(val) => handleStatusChange(order._id, val)}
                                    >
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="processing">Processing</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminOrders;
