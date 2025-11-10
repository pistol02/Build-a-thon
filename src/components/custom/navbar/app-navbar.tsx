import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/theme-toggler";
import { Bell, User } from "lucide-react";
import BackButton from "./back-button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function SolutionsNavbar() {
  return (
    <section className="flex py-4 px-6 bg-background shadow-md justify-between items-center z-[1000]">
      <div className="flex gap-4">
      <SidebarTrigger
          variant="ghost"
          className="bg-primary/30 text-primary rounded-md !p-2"
        />
        <BackButton />
      </div>
      <div className="flex">
        {/* <Input className="w-[400px] rounded-md" placeholder="Type here..." /> */}
        <nav className="pl-12 flex gap-4">
          <ModeToggle />
        </nav>
      </div>
    </section>
  );
}
