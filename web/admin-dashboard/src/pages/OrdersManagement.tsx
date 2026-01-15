import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/services/api/admin-api';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, CheckCircle, XCircle } from 'lucide-react';

const OrdersManagement: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            try {
                const response = await adminApi.getOrders();
                return response.data;
            } catch (error) {
                // Mock data
                return [
                    { id: 'ORD-001', customerName: 'John Doe', total: 150.50, status: 'pending', createdAt: '2026-01-14T10:00:00Z' },
                    { id: 'ORD-002', customerName: 'Jane Smith', total: 85.00, status: 'shipped', createdAt: '2026-01-14T11:30:00Z' },
                    { id: 'ORD-003', customerName: 'Bob Wilson', total: 210.00, status: 'delivered', createdAt: '2026-01-13T15:45:00Z' },
                ];
            }
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => adminApi.updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">{t('common.orders')}</h2>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders?.map((order: any) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>{order.customerName}</TableCell>
                                <TableCell>${order.total.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        order.status === 'delivered' ? 'default' :
                                            order.status === 'pending' ? 'outline' : 'secondary'
                                    }>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Eye className="me-2 h-4 w-4" />
                                                View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'shipped' })}>
                                                <CheckCircle className="me-2 h-4 w-4" />
                                                Mark as Shipped
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive" onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'cancelled' })}>
                                                <XCircle className="me-2 h-4 w-4" />
                                                Cancel Order
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default OrdersManagement;
