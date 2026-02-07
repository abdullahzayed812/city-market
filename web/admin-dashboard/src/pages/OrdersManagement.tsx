import React, { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/services/api/admin-api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, CheckCircle, XCircle } from "lucide-react";
import { OrderStatus } from "@/types/order";

interface Order {
  id: string;
  customerId: string;
  vendorId: string;
  status: string;
  subtotal: number;
  deliveryFee: number;
  commissionAmount: number;
  totalAmount: number;
  deliveryAddress: string;
  deliveryLatitude: string;
  deliveryLongitude: string;
  customerNotes: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
}

const OrdersManagement: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleOrderUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    };

    const events = [
      "ORDER_CREATED",
      "ORDER_CONFIRMED",
      "ORDER_CANCELLED",
      "ORDER_READY",
      "ORDER_PICKED_UP",
      "ORDER_ON_THE_WAY",
      "ORDER_DELIVERED",
    ];

    events.forEach((event) => socket.on(event, handleOrderUpdate));

    return () => {
      events.forEach((event) => socket.off(event, handleOrderUpdate));
    };
  }, [socket, queryClient]);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await adminApi.getOrders();
      return response?.data?.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
      case OrderStatus.CREATED:
        return "bg-yellow-100 text-yellow-800";
      case OrderStatus.CONFIRMED:
        return "bg-blue-100 text-blue-800";
      case OrderStatus.PREPARING:
        return "bg-purple-100 text-purple-800";
      case OrderStatus.READY:
        return "bg-cyan-100 text-cyan-800";
      case OrderStatus.PICKED_UP:
        return "bg-indigo-100 text-indigo-800";
      case OrderStatus.ON_THE_WAY:
        return "bg-orange-100 text-orange-800";
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-800";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{t("common.orders")}</h2>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer ID</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order: Order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id.substring(0, 8)}</TableCell>
                <TableCell>{order.customerId.substring(0, 8)}</TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>
                    {formatStatus(order.status)}
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
                      <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                        <Eye className="me-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateStatusMutation.mutate({
                            id: order.id,
                            status: "CONFIRMED",
                          })
                        }
                      >
                        <CheckCircle className="me-2 h-4 w-4" />
                        Mark as Confirmed
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() =>
                          updateStatusMutation.mutate({
                            id: order.id,
                            status: "CANCELLED",
                          })
                        }
                      >
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

      {selectedOrder && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>Detailed information for order #{selectedOrder.id.substring(0, 8)}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer ID</p>
                  <div>{selectedOrder.customerId}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Vendor ID</p>
                  <div>{selectedOrder.vendorId}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div>
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {formatStatus(selectedOrder.status)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Amount</p>
                  <div>${selectedOrder.totalAmount.toFixed(2)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Subtotal</p>
                  <div>${selectedOrder.subtotal.toFixed(2)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Delivery Fee</p>
                  <div>${selectedOrder.deliveryFee.toFixed(2)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Commission Amount</p>
                  <div>${selectedOrder.commissionAmount.toFixed(2)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created At</p>
                  <div>{new Date(selectedOrder.createdAt).toLocaleString()}</div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Delivery Address</p>
                <div>{selectedOrder.deliveryAddress}</div>
              </div>
              {selectedOrder.customerNotes && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer Notes</p>
                  <div>{selectedOrder.customerNotes}</div>
                </div>
              )}
              {selectedOrder.cancellationReason && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Cancellation Reason</p>
                  <div>{selectedOrder.cancellationReason}</div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default OrdersManagement;
