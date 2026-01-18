import React, { useState } from "react";
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
                  <Badge
                    variant={
                      order.status === "DELIVERED" ? "default" : order.status === "CREATED" ? "outline" : "secondary"
                    }
                  >
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
                    <Badge
                      variant={
                        selectedOrder.status === "DELIVERED"
                          ? "default"
                          : selectedOrder.status === "CREATED"
                          ? "outline"
                          : "secondary"
                      }
                    >
                      {selectedOrder.status}
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
