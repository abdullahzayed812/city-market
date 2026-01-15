import { useTranslation } from "react-i18next";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, DollarSign, Package, Activity } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
    const { t } = useTranslation();
    const { summary, recentOrders, isLoading } = useDashboardData();

    if (isLoading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    const stats = [
        {
            title: t("dashboard.today_orders"),
            value: summary.todayOrdersCount,
            icon: ShoppingBag,
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            title: t("dashboard.revenue"),
            value: `$${summary.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "text-green-600",
            bg: "bg-green-100",
        },
        {
            title: t("dashboard.active_products"),
            value: summary.activeProductsCount,
            icon: Package,
            color: "text-purple-600",
            bg: "bg-purple-100",
        },
        {
            title: t("dashboard.order_summary"),
            value: summary.statusSummary.pending || 0,
            icon: Activity,
            color: "text-orange-600",
            bg: "bg-orange-100",
            description: "Pending orders",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("common.dashboard")}</h1>
                <p className="text-muted-foreground">
                    Welcome back to your store dashboard.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <div className={`${stat.bg} p-2 rounded-full`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            {stat.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.description}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t("common.orders")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentOrders.map((order: any) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
                                    <TableCell>{order.customerName || "Customer"}</TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">${order.totalAmount}</TableCell>
                                </TableRow>
                            ))}
                            {recentOrders.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                        No recent orders found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
