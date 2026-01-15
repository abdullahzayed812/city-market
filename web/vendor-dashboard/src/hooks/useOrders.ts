import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/api/order.service";
import { useAuth } from "@/components/AuthProvider";

export const useOrders = () => {
    const { vendor } = useAuth();
    const vendorId = vendor?.id;
    const queryClient = useQueryClient();

    const ordersQuery = useQuery({
        queryKey: ["vendor-orders", vendorId],
        queryFn: () => orderService.getVendorOrders(vendorId!),
        enabled: !!vendorId,
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            orderService.updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vendor-orders", vendorId] });
        },
    });

    const cancelOrderMutation = useMutation({
        mutationFn: (id: string) => orderService.cancelOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vendor-orders", vendorId] });
        },
    });

    return {
        orders: ordersQuery.data || [],
        isLoading: ordersQuery.isLoading,
        isError: ordersQuery.isError,
        updateStatus: updateStatusMutation.mutate,
        cancelOrder: cancelOrderMutation.mutate,
        isUpdating: updateStatusMutation.isPending || cancelOrderMutation.isPending,
    };
};
