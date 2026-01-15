import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deliveryService } from "@/services/api/delivery.service";

export const useDeliveries = () => {
    const queryClient = useQueryClient();

    const deliveriesQuery = useQuery({
        queryKey: ["assigned-deliveries"],
        queryFn: deliveryService.getAssignedDeliveries,
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status, otp }: { id: string; status: string; otp?: string }) =>
            deliveryService.updateDeliveryStatus(id, status, otp),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["assigned-deliveries"] });
        },
    });

    return {
        deliveries: deliveriesQuery.data || [],
        isLoading: deliveriesQuery.isLoading,
        isError: deliveriesQuery.isError,
        updateStatus: updateStatusMutation.mutate,
        isUpdating: updateStatusMutation.isPending,
    };
};
