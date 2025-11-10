"use client";

import * as React from "react";
import { VersionSwitcher } from "@/components/custom/sidebar/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  FaGraduationCap,
  FaBook,
  FaVideo,
  FaPaperclip,
  FaStar,
  FaMap,
  FaClock,
  FaRoad,
  FaCamera,
} from "react-icons/fa6";
import { Users2Icon } from "lucide-react";
import { driver } from "driver.js";
import { TbChartInfographic } from "react-icons/tb";
import "driver.js/dist/driver.css";

const sidebarData = {
  versions: ["1.0.1"],
  navMain: [
    {
      title: "Main Navigation",
      items: [
        {
          title: "Dashboard",
          id: "dashboard",
          url: "/dashboard",
          element: "#dashboard",
          icon: <FaGraduationCap />,
          isCollapsible: false,
          subsections: []
        },
        {
          title: "Roadmap Generator",
          id: "roadmap",
          url: "/roadmap",
          element: "#roadmap",
          icon: <FaRoad />,
          isCollapsible: false,
          subsections: []
        },
        {
          title: "Video Learn",
          id: "video",
          url: "/video",
          element: "#video",
          icon: <FaBook />,
          isCollapsible: false,
          subsections: []
        },
        {
          title: "Video Quiz",
          id: "split",
          url: "/split",
          element: "#split",
          icon: <FaVideo />,
          isCollapsible: false,
          subsections: []
        },
        {
          title: "AI Quiz",
          id: "ai-quiz",
          url: "/ai-quiz",
          element: "#ai-quiz",
          icon: <FaCamera />,
          isCollapsible: false,
          subsections: []
        },
        {
          title: "AI Notes",
          id: "notes",
          url: "/notes",
          element: "#notes",
          icon: <FaPaperclip />,
          isCollapsible: false,
          subsections: []
        },
        {
          title: "Skill Management",
          id: "skill-management",
          url: "/skill-management",
          element: "#skill-management",
          icon: <FaStar />,
          isCollapsible: false,
          subsections: []
        },
        // Corrected order: Ensure consistent item sequence
        {
          title: "Task and deadline",
          id: "task-and-deadline",
          url: "/task-and-deadline",
          element: "#task-and-deadline",
          icon: <FaClock />,
          isCollapsible: false,
          subsections: []
        },
        {
          title: "AR VR Classroom",
          id: "arvr-classroom",
          url: "/VRClassroom",
          element: "#arvr-classroom",
          icon: <FaMap />,
          isCollapsible: false,
          subsections: []
        },
        {
          title: "Community",
          id: "community",
          url: "/community",
          element: "#community",
          icon: <Users2Icon />,
          isCollapsible: false,
          subsections: []
        },
        {
          title: "Analytics",
          id: "analytics",
          url: "/analytics",
          element: "#analytics",
          icon: <TbChartInfographic />,
          isCollapsible: false,
          subsections: []
        },
      ]
    }
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  React.useEffect(() => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        // Ensure tour steps match corrected order
        { element: "#dashboard", popover: { title: "Dashboard", description: "Overview" } },
        { element: "#video", popover: { title: "Video Learn", description: "Educational videos" } },
        { element: "#split", popover: { title: "Video Quiz", description: "Interactive quizzes" } },
        { element: "#notes", popover: { title: "AI Notes", description: "AI-powered summaries" } },
        { element: "#skill-management", popover: { title: "Skill Management", description: "Track progress" } },
        { element: "#task-and-deadline", popover: { title: "Task Management", description: "Deadline tracking" } },
        { element: "#arvr-classroom", popover: { title: "ARVR Classroom", description: "Immersive learning" } },
        { element: "#community", popover: { title: "Community", description: "Peer engagement" } },
      ]
    });
    driverObj.drive();
  }, []);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={sidebarData.versions}
          defaultVersion={sidebarData.versions[0]}
          id="version-control"
        />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items?.map((item) => (
                  <React.Fragment key={item.id}>
                    <SidebarMenuItem id={item.id}>
                      <SidebarMenuButton
                        asChild
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Link href={item.url}>
                          {item.icon}
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </React.Fragment>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}