import Lenis from "@/components/wrappers/lenis";
import dynamic from "next/dynamic";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome } from "@tabler/icons-react";
import {  FaFlag, FaLock, FaUserGroup } from "react-icons/fa6";
import Navbar from "@/components/custom/navbar";
import { WavyBackgroundDemo } from "@/components/ui/WavyBackgroundDemo";
import Bars from "@/components/ui/bars";
import Imagine from "@/components/custom/home/imagine";
import Herotwo from "@/components/ui/herotwo";



;
export default function Home() {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    
    {
      name: "Login",
      link: "/login",
      icon: <FaLock className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Register",
      link: "/signup",
      icon: <FaFlag className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: <FaFlag className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Feedback",
      link: "/feedback",
      icon: <FaFlag className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];
  return (
    <main>
      <FloatingNav navItems={navItems} />
      <Lenis>
      <Navbar/>
      <main className="flex flex-col items-center">
      <Herotwo/>
      <Bars/>
      <Imagine/>
      </main>
    </Lenis>
    </main>

  );
}
