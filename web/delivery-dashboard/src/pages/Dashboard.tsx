import { useTranslation } from "react-i18next";
import { useDeliveries } from "@/hooks/useDeliveries";
import { useEarnings } from "@/hooks/useEarnings";
import { useCourierProfile } from "@/hooks/useCourierProfile";
import { cn } from "@/lib/utils";

const Dashboard = () => {
    const { t } = useTranslation();
    const { deliveries, isLoading: deliveriesLoading } = useDeliveries();
    const { earnings, isLoading: earningsLoading } = useEarnings("daily");
    const { profile } = useCourierProfile();

    const activeDeliveries = deliveries.filter((d: any) => d.status !== "delivered");
    const completedToday = deliveries.filter((d: any) => d.status === "delivered").length;

    if (deliveriesLoading || earningsLoading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">{t("common.dashboard")}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-card border rounded-xl shadow-sm">
                    <p className="text-sm text-muted-foreground">{t("dashboard.active_deliveries")}</p>
                    <p className="text-2xl font-bold mt-2">{activeDeliveries.length}</p>
                </div>
                <div className="p-6 bg-card border rounded-xl shadow-sm">
                    <p className="text-sm text-muted-foreground">{t("dashboard.completed_deliveries")}</p>
                    <p className="text-2xl font-bold mt-2">{completedToday}</p>
                </div>
                <div className="p-6 bg-card border rounded-xl shadow-sm">
                    <p className="text-sm text-muted-foreground">{t("dashboard.today_earnings")}</p>
                    <p className="text-2xl font-bold mt-2">${earnings?.total || 0}</p>
                </div>
                <div className="p-6 bg-card border rounded-xl shadow-sm">
                    <p className="text-sm text-muted-foreground">{t("common.status")}</p>
                    <p className={cn("text-2xl font-bold mt-2", profile?.isOnline ? "text-green-600" : "text-gray-400")}>
                        {profile?.isOnline ? t("common.online") : t("common.offline")}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
