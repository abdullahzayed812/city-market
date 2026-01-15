import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deliveryService } from "@/services/api/delivery.service";

export const useCourierProfile = () => {
    const queryClient = useQueryClient();

    const profileQuery = useQuery({
        queryKey: ["courier-profile"],
        queryFn: deliveryService.getProfile,
    });

    const updateProfileMutation = useMutation({
        mutationFn: deliveryService.updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courier-profile"] });
        },
    });

    const updateAvailabilityMutation = useMutation({
        mutationFn: deliveryService.updateAvailability,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courier-profile"] });
        },
    });

    return {
        profile: profileQuery.data,
        isLoading: profileQuery.isLoading,
        isError: profileQuery.isError,
        updateProfile: updateProfileMutation.mutate,
        updateAvailability: updateAvailabilityMutation.mutate,
        isUpdating: updateProfileMutation.isPending || updateAvailabilityMutation.isPending,
    };
};
