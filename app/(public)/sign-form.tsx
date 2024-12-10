"use client";

import { useForm } from "react-hook-form";
import SignInFormSchema, { SignInFormType } from "./sign-in.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LucideLoader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/lib/actions/auth/login.post";
import handleResponse from "@/lib/response.utils";
import { authService } from "@/lib/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function SignForm() {
	// Router Hook
	const router = useRouter();

	// Form Hook
	const form = useForm<SignInFormType>({
		resolver: zodResolver(SignInFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	// Login Hook
	const { mutateAsync: login, isPending } = useLogin();

	async function onSubmit(data: SignInFormType) {
		const res = await handleResponse(() => login(data), 201);
		if (res.status) {
			authService.setToken(res.data.access_token);

			// Generating Toast
			toast("Logged in successfully!", {
				description: `Welcome back!!`,
			});

			// Redirect to dashboard
			router.refresh();
		} else {
			// Generating Toast
			toast(res.message);
		}
	}

	return (
		<Form {...form}>
			<Card className="mx-2">
				<CardHeader>
					<CardTitle>Welcome</CardTitle>
					<CardDescription>Sign in with your credentials.</CardDescription>
				</CardHeader>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="space-y-3">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											placeholder="example@gmail.com"
											autoComplete="email"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="********"
											autoComplete="current-password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter>
						<Button
							type="submit"
							className="w-full"
							size={"lg"}
							disabled={isPending}
						>
							{isPending ? (
								<>
									<LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
									Signing in..
								</>
							) : (
								<>Sign in</>
							)}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</Form>
	);
}

export default SignForm;
