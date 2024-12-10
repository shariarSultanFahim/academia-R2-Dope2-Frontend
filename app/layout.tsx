import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/mode-toggle";
import ClientLayout from "./layout.client";
import { Toaster as Sonner } from "@/components/ui/sonner"; // Toasts

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Next.js Shadcn Starter",
	description: "A starter for Next.js with Tailwind CSS and TypeScript.",
	icons: "/favicon.svg",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn(outfit.className, "bg-background")}
				suppressHydrationWarning
			>
				<ClientLayout>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
						<Sonner /> {/* Toasts */}
						<div className="fixed bottom-5 right-5">
							<ModeToggle />
						</div>
					</ThemeProvider>
				</ClientLayout>
			</body>
		</html>
	);
}
