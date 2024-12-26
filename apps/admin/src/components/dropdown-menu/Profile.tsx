import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ExitIcon, PersonIcon, MoonIcon, ReloadIcon, SunIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UseTheme } from "../ThemeProvider";
import { useState } from "react";
import { useLogoutMutation } from "@/api/mutations/AuthMutations";
import { useAuthenticatedUserQuery } from "@/api/queries/UserQueries";
import UserDialog from "../dialog/admin/AdminDialog";

const Profile = () => {
    const { data } = useAuthenticatedUserQuery();
    const [loading, setLoading] = useState<boolean>(false);
    const { theme, setTheme } = UseTheme();
    const image = localStorage.getItem("image");
    const { mutate } = useLogoutMutation(setLoading);
    const handleLogout = () => {
        setLoading(true);
        mutate();
    };
    // const handleGenerateInvitationCode = async () => {
    //     const resp = await generateInvitationCode();
    //     copyToClipboard(resp.data[resp.data.length - 1], "Invitation code");
    // };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="hover:cursor-pointer">
                    <Avatar>
                        <AvatarImage src={image || "https://github.com/shadcn.png"} alt="profile-picture" />
                        <AvatarFallback>
                            <span className="uppercase">
                                {data?.user.firstname[0]}
                                {data?.user.lastname[0]}
                            </span>
                        </AvatarFallback>
                    </Avatar>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-2 w-56">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                        <div className="flex w-full justify-between">
                            <span>Dark Mode</span>
                            {theme === "light" ? (
                                <MoonIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            ) : (
                                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-0 dark:scale-100" />
                            )}
                        </div>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={handleGenerateInvitationCode}>
                        <div className="flex w-full justify-between">
                            <span>Generate Code</span>
                            <SymbolIcon className="h-[1.2rem] w-[1.2rem]" />
                        </div>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                        <UserDialog userId={data?.user.id} readOnly me>
                            <div className="flex w-full justify-between">
                                <span>Profile</span>
                                <PersonIcon className="h-[1.2rem] w-[1.2rem]" />
                            </div>
                        </UserDialog>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <div className="flex w-full justify-between">
                        <span>Sign Out</span>
                        {loading ? (
                            <ReloadIcon className="h-[1.2rem] w-[1.2rem] animate-spin" />
                        ) : (
                            <ExitIcon className="h-[1.2rem] w-[1.2rem]" />
                        )}
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Profile;
