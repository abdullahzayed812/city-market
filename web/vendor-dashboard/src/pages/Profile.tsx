import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/components/AuthProvider";
import { vendorService } from "@/services/api/vendor.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MapPin, Phone, Store } from "lucide-react";

const Profile = () => {
    const { t } = useTranslation();
    const { vendor } = useAuth();
    const queryClient = useQueryClient();
    const [profileData, setProfileData] = useState({
        name: "",
        description: "",
        address: "",
        phone: "",
    });

    useEffect(() => {
        if (vendor) {
            setProfileData({
                name: vendor.name || "",
                description: vendor.description || "",
                address: vendor.address || "",
                phone: vendor.phone || "",
            });
        }
    }, [vendor]);

    const workingHoursQuery = useQuery({
        queryKey: ["working-hours", vendor?.id],
        queryFn: () => vendorService.getWorkingHours(vendor?.id!),
        enabled: !!vendor?.id,
    });

    const updateProfileMutation = useMutation({
        mutationFn: (data: any) => vendorService.updateProfile(vendor?.id!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });
        },
    });

    const handleUpdateProfile = () => {
        updateProfileMutation.mutate(profileData);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("common.profile")}</h1>
                <p className="text-muted-foreground">
                    Manage your store information and settings.
                </p>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general" className="gap-2">
                        <Store className="h-4 w-4" /> General
                    </TabsTrigger>
                    <TabsTrigger value="hours" className="gap-2">
                        <Clock className="h-4 w-4" /> Working Hours
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Store Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Store Name</Label>
                                    <Input
                                        id="name"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="phone"
                                            className="pl-9"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="address"
                                        className="pl-9"
                                        value={profileData.address}
                                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={profileData.description}
                                    onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                                />
                            </div>
                            <Button onClick={handleUpdateProfile} disabled={updateProfileMutation.isPending}>
                                Save Changes
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="hours">
                    <Card>
                        <CardHeader>
                            <CardTitle>Working Hours</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {workingHoursQuery.data?.map((hour: any) => (
                                    <div key={hour.dayOfWeek} className="flex items-center justify-between py-2 border-b last:border-0">
                                        <span className="font-medium">Day {hour.dayOfWeek}</span>
                                        <div className="flex items-center gap-4">
                                            <span>{hour.openTime}</span>
                                            <span>-</span>
                                            <span>{hour.closeTime}</span>
                                        </div>
                                    </div>
                                ))}
                                {!workingHoursQuery.data?.length && (
                                    <p className="text-center py-4 text-muted-foreground">
                                        No working hours set.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Profile;
