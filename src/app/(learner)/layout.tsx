"use client";
import React, { ReactNode, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BaggageClaim, CircleDollarSign, FileBadge, HomeIcon, KanbanSquare, LogOut, LucideChartBarIncreasing, MapPinCheckInside, Shield, ShieldCheck, Star, User, Users2, Webcam, WindIcon } from "lucide-react";
import SolutionsNavbar from "@/components/custom/navbar/app-navbar";
import QueryProviderWrapper from "@/components/wrappers/query-provider";
import { ThemeProvider } from "next-themes";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/sidebar/app-sidebar";

interface SidebarLinkProps {
    icon: React.ReactElement;
    title: string;
    href: string;
    id: string; // Add an ID for each sidebar link
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, title, href, id }) => {
    const path = usePathname();

    return (
        <Link href={href} id={id}>
            <Button className="flex items-center gap-4 rounded-lg px-4 py-2 my-2 text-sm font-medium" variant={path.includes(href) ? "default" : "ghost"}>
                {icon}
                {title}
            </Button>
        </Link>
    );
};

interface SidebarProps {
    links: SidebarLinkProps[];
}

const Sidebar: React.FC<SidebarProps> = ({ links }) => (
    <div className="flex flex-col h-full border-r bg-gray-100/40 md:grid md:grid-rows-[auto_1fr] md:bg-gray-100/50 lg:bg-gray-100/40">
        <div className="flex items-center justify-between p-4 bg-gray-100/50 md:flex-col md:items-start md:gap-4 md:p-6">
            <Link href="#">
                <div className="flex items-center gap- text-xl font-bold">
                    <div className="size-7">
                        <img className="rounded-full h-14" src="./logo.png"></img>
                    </div>
                    <span>LearnByte</span>
                </div>
            </Link>
        </div>
        <nav className="flex-1 overflow-auto p-4 space-y-4 md:p-2 md:space-y-2 lg:space-y-4">
            {links.map((link, index) => (
                <SidebarLink key={index} {...link} />
            ))}
        </nav>
    </div>
);

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const auth = useAuth();

    // useEffect(() => {
    //     const driverObj = driver({
    //         showProgress: true,
    //         steps: [
    //             { element: '#dashboard', popover: { title: 'Home', description: 'Navigate to the home page to view your dashboard.', side: "right", align: 'start' } },
    //         ]
    //     });

    //     driverObj.drive();
    // }, []);

    return (
        <div className="relative">
        <div className="bg-[#ffffff] absolute top-[-6rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#1fffe5]"></div>
        <div className="bg-[#0df3ff] absolute top-[-1rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#35fff2]"></div>
     <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <div className="flex flex-col min-h-screen w-full">
        <SolutionsNavbar />
        {children}
      </div>
    </SidebarProvider>
    </div>
    );
};

export default Layout;