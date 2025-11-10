import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import React from "react";
import { ModeToggle } from "@/components/ui/theme-toggler";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import ListItem from "./list-item";

export default function Navbar() {
  const mainLinks = [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/about" },
    { title: "How It Works", href: "/how-it-works" },
    { title: "Case Studies", href: "/case-studies" },
    { title: "Blog", href: "/blog" },
    { title: "FAQ", href: "/faq" },
    { title: "Contact Us", href: "/contact" },
  ];

  const solutionsLinks = [
    { title: "Route Optimization", href: "/route-optimization" },
    { title: "Inventory Management", href: "/solutions/inventory-management" },
    { title: "Asset Utilization", href: "/solutions/asset-utilization" },
    { title: "Process Automation", href: "/solutions/process-automation" },
    {
      title: "Data-Driven Decision Making",
      href: "/solutions/data-driven-decisions",
    },
    {
      title: "Technology Integration",
      href: "/solutions/technology-integration",
    },
  ];

  const userLinks = [
    { title: "Optimization Dashboard", href: "/dashboard" },
    { title: "Reports/Analytics", href: "/reports" },
    { title: "Admin Dashboard", href: "/admin" },
  ];
  return (
    <div className="max-w-7xl mx-auto w-full flex px-6">
      <div className="flex w-full justify-between items-center min-h-14 opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto">
        <div className="flex items-center gap-2 min-w-32">
          <div className="size-14 mt-8 rounded-full">
            <img className="rounded-full" src="./logo.png"></img>
          </div>
          <h1 className="text-lg font-black mt-8">LearnByte</h1>
        </div>
        <div className="min-w-32 flex items-center gap-2 justify-end">
          <Link
            href={"/"}
            className="flex w-fit items-center gap-1 hover:border-b border-foreground cursor-pointer"
          >
  
          </Link>
          <ModeToggle />
        </div>
      </div>
      <nav className="hidden ~flex peer fixed top-2 rounded border border-foreground p-0.5 w-fit left-1/2 -translate-x-1/2 bg-background z-50">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {solutionsLinks.map((link) => (
                    <ListItem
                      key={link.href}
                      title={link.title}
                      href={link.href}
                    />
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Help</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {mainLinks.map((link) => (
                    <ListItem
                      key={link.href}
                      title={link.title}
                      href={link.href}
                    />
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>User Area</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid  gap-2 p-4 md:grid-cols-2 w-[400px]">
                  {userLinks.map((link) => (
                    <ListItem
                      key={link.href}
                      title={link.title}
                      href={link.href}
                    />
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/login" passHref>
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup" passHref>
              <Button>Sign Up</Button>
            </Link>
          </div>
        </NavigationMenu>
      </nav>
      <div className="fixed top-0 right-0 w-full h-full  opacity-0 peer-hover:opacity-100 -z-50 peer-hover:z-10 bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 transition-all duration-500"></div>
    </div>
  );
}
