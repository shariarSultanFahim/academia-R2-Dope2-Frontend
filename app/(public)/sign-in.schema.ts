import { z } from "zod";

// Form Schema
const SignInFormSchema = z.object({
	email: z.string().email().min(1, {
		message: "Email is required.",
	}),
	password: z.string().min(6, {
		message: "Password must be at least 6 characters.",
	}),
});

export type SignInFormType = z.infer<typeof SignInFormSchema>;

export default SignInFormSchema;
