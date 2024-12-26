import { Button } from "../ui/button";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

const NotificationBell = () => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="icon" variant="ghost" className="rounded-full">
                    <Bell className="h-5 w-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="mr-2 w-96 p-1">
                <div className="px-2 py-1.5 text-sm font-semibold">Notifications</div>
                <Separator className="-mx-1 my-1 h-px bg-muted"/>
                <div className="p-2 py-4 text-xs text-center text-zinc-900">No notifications</div>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationBell;
