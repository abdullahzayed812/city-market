import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deliveryService } from "@/services/api/delivery.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Package, Clock, User } from "lucide-react";

const Deliveries = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedCourier, setSelectedCourier] = useState<string>("");
  const [assigningDeliveryId, setAssigningDeliveryId] = useState<string | null>(null);

  const { data: deliveries = [], isLoading } = useQuery({
    queryKey: ["deliveries"],
    queryFn: deliveryService.getAllDeliveries,
  });

  const { data: availableCouriers = [] } = useQuery({
    queryKey: ["available-couriers"],
    queryFn: deliveryService.getAvailableCouriers,
  });

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
    };

    const events = [
      "ORDER_READY",
      "DELIVERY_CREATED",
      "COURIER_ASSIGNED",
      "ORDER_PICKED_UP",
      "ORDER_ON_THE_WAY",
      "ORDER_DELIVERED",
    ];

    events.forEach(event => socket.on(event, handleUpdate));

    return () => {
      events.forEach(event => socket.off(event, handleUpdate));
    };
  }, [socket, queryClient]);

  const assignMutation = useMutation({
    mutationFn: ({ deliveryId, courierId }: { deliveryId: string; courierId: string }) =>
      deliveryService.assignCourier(deliveryId, courierId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      queryClient.invalidateQueries({ queryKey: ["available-couriers"] });
      setAssigningDeliveryId(null);
      setSelectedCourier("");
    },
  });

  // const updateStatusMutation = useMutation({
  //   mutationFn: ({ id, status }: { id: string; status: string }) =>
  //     deliveryService.updateDeliveryStatus(id, status),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["deliveries"] });
  //   },
  // });

  const handleAssign = () => {
    if (assigningDeliveryId && selectedCourier) {
      assignMutation.mutate({ deliveryId: assigningDeliveryId, courierId: selectedCourier });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "picked_up":
        return "bg-purple-100 text-purple-800";
      case "on_the_way":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("common.deliveries")}</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {deliveries.length === 0 ? (
          <div className="text-center py-12 bg-card border rounded-xl border-dashed">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No deliveries found.</p>
          </div>
        ) : (
          deliveries.map((delivery: any) => (
            <Card key={delivery.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between bg-muted/30 py-4">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Order #{delivery.orderId}</CardTitle>
                </div>
                <Badge className={getStatusColor(delivery.status)}>
                  {t(`orders.${delivery.status.toLowerCase()}`) || delivery.status}
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
                        <p className="text-sm text-muted-foreground">{delivery.pickupAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t("orders.customer_address")}</p>
                        <p className="text-sm text-muted-foreground">{delivery.deliveryAddress}</p>
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
                      <p className="text-sm">Created at: {new Date(delivery.createdAt).toLocaleString()}</p>
                    </div>
                    {delivery.courierId && (
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm">Courier: {delivery.courier?.name || "Assigned"}</p>
                      </div>
                    )}

                    {delivery.status.toLowerCase() === "pending" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full mt-4" onClick={() => setAssigningDeliveryId(delivery.id)}>
                            Assign Courier
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Courier</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <Select onValueChange={setSelectedCourier} value={selectedCourier}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a courier" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableCouriers.map((courier: any) => (
                                  <SelectItem key={courier.id} value={courier.id}>
                                    {courier.fullName} ({courier.vehicleType})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              className="w-full"
                              onClick={handleAssign}
                              disabled={!selectedCourier || assignMutation.isPending}
                            >
                              {assignMutation.isPending ? "Assigning..." : "Confirm Assignment"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    {/* {delivery.status.toLowerCase() === "assigned" && (
                      <Button
                        className="w-full mt-4"
                        variant="outline"
                        onClick={() => updateStatusMutation.mutate({ id: delivery.id, status: "PICKED_UP" })}
                        disabled={updateStatusMutation.isPending}
                      >
                        Mark as Picked Up
                      </Button>
                    )}

                    {delivery.status.toLowerCase() === "picked_up" && (
                      <Button
                        className="w-full mt-4"
                        variant="outline"
                        onClick={() => updateStatusMutation.mutate({ id: delivery.id, status: "ON_THE_WAY" })}
                        disabled={updateStatusMutation.isPending}
                      >
                        Mark as On The Way
                      </Button>
                    )}

                    {delivery.status.toLowerCase() === "on_the_way" && (
                      <Button
                        className="w-full mt-4"
                        variant="default"
                        onClick={() => updateStatusMutation.mutate({ id: delivery.id, status: "DELIVERED" })}
                        disabled={updateStatusMutation.isPending}
                      >
                        Mark as Delivered
                      </Button>
                    )} */}
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
