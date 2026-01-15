import { useTranslation } from "react-i18next";
import { useDeliveries } from "@/hooks/useDeliveries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Package, Clock } from "lucide-react";

const Deliveries = () => {
    const { t } = useTranslation();
    const { deliveries, isLoading, updateStatus, isUpdating } = useDeliveries();

    if (isLoading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-800";
            case "picked_up": return "bg-blue-100 text-blue-800";
            case "on_the_way": return "bg-purple-100 text-purple-800";
            case "delivered": return "bg-green-100 text-green-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const handleStatusUpdate = (id: string, currentStatus: string) => {
        let nextStatus = "";
        if (currentStatus === "pending") nextStatus = "picked_up";
        else if (currentStatus === "picked_up") nextStatus = "on_the_way";
        else if (currentStatus === "on_the_way") nextStatus = "delivered";

        if (nextStatus) {
            updateStatus({ id, status: nextStatus });
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">{t("common.deliveries")}</h1>

            <div className="grid gap-6">
                {deliveries.length === 0 ? (
                    <div className="text-center py-12 bg-card border rounded-xl border-dashed">
                        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No assigned deliveries at the moment.</p>
                    </div>
                ) : (
                    deliveries.map((delivery: any) => (
                        <Card key={delivery.id} className="overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between bg-muted/30 py-4">
                                <div className="flex items-center gap-2">
                                    <Package className="w-5 h-5 text-primary" />
                                    <CardTitle className="text-lg">Order #{delivery.orderNumber}</CardTitle>
                                </div>
                                <Badge className={getStatusColor(delivery.status)}>
                                    {t(`orders.${delivery.status}`)}
                                </Badge>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <MapPin className="w-4 h-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">{t("orders.pickup_details")}</p>
                                                <p className="text-sm text-muted-foreground">{delivery.vendorAddress}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <MapPin className="w-4 h-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">{t("orders.customer_address")}</p>
                                                <p className="text-sm text-muted-foreground">{delivery.customerAddress}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            <p className="text-sm">{delivery.customerPhone}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                            <p className="text-sm">Assigned at: {new Date(delivery.assignedAt).toLocaleTimeString()}</p>
                                        </div>

                                        {delivery.status !== "delivered" && (
                                            <Button
                                                className="w-full mt-4"
                                                disabled={isUpdating}
                                                onClick={() => handleStatusUpdate(delivery.id, delivery.status)}
                                            >
                                                {delivery.status === "pending" && t("orders.picked_up")}
                                                {delivery.status === "picked_up" && t("orders.on_the_way")}
                                                {delivery.status === "on_the_way" && t("orders.delivered")}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default Deliveries;
