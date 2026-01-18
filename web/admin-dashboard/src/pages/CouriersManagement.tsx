import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/services/api/admin-api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone } from "lucide-react";

const CouriersManagement: React.FC = () => {
  const { t } = useTranslation();

  const { data: couriers, isLoading } = useQuery({
    queryKey: ["couriers"],
    queryFn: async () => {
      try {
        const response = await adminApi.getCouriers();
        return response?.data?.data;
      } catch (error) {
        // Mock data
        return [
          { id: "C-001", name: "Speedy Gonzales", phone: "555-123-4567", vehicle: "Motorcycle", status: "available" },
          { id: "C-002", name: "Flash Gordon", phone: "555-987-6543", vehicle: "Van", status: "busy" },
          { id: "C-003", name: "Road Runner", phone: "555-456-7890", vehicle: "Bicycle", status: "offline" },
        ];
      }
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{t("common.couriers")}</h2>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {couriers?.map((courier: any) => (
              <TableRow key={courier.id}>
                <TableCell className="font-medium">{courier.fullName}</TableCell>
                <TableCell>{courier.vehicleType}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Phone className="me-2 h-4 w-4 text-gray-400" />
                    {courier.phone}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={courier.isActive ? "default" : "outline"}>
                    {courier.isActive ? "Active" : "Deactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <MapPin className="me-2 h-4 w-4" />
                    Track
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CouriersManagement;
