import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { GraduationCap, Home, LogOut, Settings } from "lucide-react";
import Link from "next/link";

// Menu items.
const items = [
	{
		title: "Home",
		url: "/app/faculty",
		icon: Home,
	},
	{
		title: "Courses",
		url: "/app/faculty/courses",
		icon: GraduationCap,
	},
	{
		title: "Settings",
		url: "#",
		icon: Settings,
	},
	{
		title: "Logout",
		url: "/app/logout",
		icon: LogOut,
	},
];

export function FacultySidebar() {
	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
