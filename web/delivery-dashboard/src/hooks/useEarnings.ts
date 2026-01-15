import { useQuery } from "@tanstack/react-query";
import { deliveryService } from "@/services/api/delivery.service";

export const useEarnings = (period: "daily" | "weekly" | "monthly" = "daily") => {
    const earningsQuery = useQuery({
        queryKey: ["earnings", period],
        queryFn: () => deliveryService.getEarnings(period),
    });

    const historyQuery = useQuery({
        queryKey: ["earnings-history"],
        queryFn: deliveryService.getEarningsHistory,
    });

    return {
        earnings: earningsQuery.data,
        history: historyQuery.data || [],
        isLoading: earningsQuery.isLoading || historyQuery.isLoading,
        isError: earningsQuery.isError || historyQuery.isError,
    };
};
