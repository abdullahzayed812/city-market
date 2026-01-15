import { useTranslation } from "react-i18next";
import { useOrders } from "@/hooks/useOrders";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, CheckCircle, XCircle, Truck } from "lucide-react";

const Orders = () => {
    const { t } = useTranslation();
    const { orders, isLoading, updateStatus, cancelOrder } = useOrders();

    if (isLoading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("common.orders")}</h1>
                    <p className="text-muted-foreground">
                        Manage and track your customer orders.
                    </p>
                </div>
            </div>

            <div className="border rounded-lg bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order: any) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{order.customerName || "Customer"}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        order.status === "completed" ? "default" :
                                            order.status === "cancelled" ? "destructive" :
                                                "secondary"
                                    }>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">${order.totalAmount}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="gap-2">
                                                <Eye className="h-4 w-4" /> View Details
                                            </DropdownMenuItem>
                                            {order.status === "pending" && (
                                                <>
                                                    <DropdownMenuItem
                                                        className="gap-2 text-green-600"
                                                        onClick={() => updateStatus({ id: order.id, status: "processing" })}
                                                    >
                                                        <CheckCircle className="h-4 w-4" /> Accept Order
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="gap-2 text-destructive"
                                                        onClick={() => cancelOrder(order.id)}
                                                    >
                                                        <XCircle className="h-4 w-4" /> Cancel Order
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                            {order.status === "processing" && (
                                                <DropdownMenuItem
                                                    className="gap-2 text-blue-600"
                                                    onClick={() => updateStatus({ id: order.id, status: "shipped" })}
                                                >
                                                    <Truck className="h-4 w-4" /> Mark as Shipped
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {orders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Orders;
