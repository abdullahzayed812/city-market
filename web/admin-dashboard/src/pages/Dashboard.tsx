import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/services/api/admin-api";
import { ShoppingBag, Users, Store, Truck, DollarSign } from "lucide-react";

const StatCard: React.FC<{ title: string; value: string | number; icon: any; color: string }> = ({
  title,
  value,
  icon: Icon,
  color,
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
    <div className={`p-3 rounded-full ${color} text-white me-4`}>
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  // Mocking data for now since backend might not be running
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      try {
        const response = await adminApi.getStats();
        return response.data;
      } catch (error) {
        // Return mock data if API fails
        return {
          ordersCount: 1250,
          usersCount: 5400,
          vendorsCount: 120,
          couriersCount: 45,
          totalRevenue: 25000,
        };
      }
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{t("dashboard.overview")}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard
          title={t("dashboard.total_orders")}
          value={stats?.ordersCount}
          icon={ShoppingBag}
          color="bg-blue-500"
        />
        <StatCard title={t("dashboard.total_users")} value={stats?.usersCount} icon={Users} color="bg-green-500" />
        <StatCard title={t("dashboard.total_vendors")} value={stats?.vendorsCount} icon={Store} color="bg-purple-500" />
        <StatCard
          title={t("dashboard.total_couriers")}
          value={stats?.couriersCount}
          icon={Truck}
          color="bg-orange-500"
        />
        <StatCard
          title={t("common.revenue")}
          value={`$${stats?.totalRevenue}`}
          icon={DollarSign}
          color="bg-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-64 flex items-center justify-center">
          <p className="text-gray-400">Revenue Chart Placeholder</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-64 flex items-center justify-center">
          <p className="text-gray-400">Recent Activity Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
