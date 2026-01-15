import { useTranslation } from "react-i18next";
import { useLanguage } from "@/components/LanguageProvider";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Languages, Bell, User, Circle } from "lucide-react";
import { useCourierProfile } from "@/hooks/useCourierProfile";

const Navbar = () => {
    const { t } = useTranslation();
    const { setLanguage } = useLanguage();
    const { profile, updateAvailability, isUpdating } = useCourierProfile();
    const isOnline = profile?.isOnline ?? false;

    return (
        <header className="h-16 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    disabled={isUpdating}
                    onClick={() => updateAvailability(!isOnline)}
                >
                    <Circle className={cn("w-3 h-3 fill-current", isOnline ? "text-green-500" : "text-gray-400")} />
                    {isOnline ? t("common.online") : t("common.offline")}
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Languages className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setLanguage("ar")}>
                            {t("common.arabic")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLanguage("en")}>
                            {t("common.english")}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="icon">
                    <Bell className="w-5 h-5" />
                </Button>

                <div className="h-8 w-px bg-border mx-2" />

                <Button variant="ghost" className="gap-2 px-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium hidden sm:inline-block">Courier Name</span>
                </Button>
            </div>
        </header>
    );
};

import { cn } from "@/lib/utils";
export default Navbar;
