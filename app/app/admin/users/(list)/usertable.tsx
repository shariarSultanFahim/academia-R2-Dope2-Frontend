"use client";

import * as React from "react";
import { DotsHorizontalIcon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	// getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableLoading,
	TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import handleResponse from "@/lib/response.utils";
import { toast } from "sonner";
import Link from "next/link";
import { useDeleteUser } from "@/lib/actions/users/delete-user";
import { useGetUsers } from "@/lib/actions/users/list.get";
import moment from "moment";
import { Separator } from "@/components/ui/separator";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { UpdateUser } from "./update-user";
import { TbUserEdit } from "react-icons/tb";

export interface User {
	id: number;
	username: string;
	email: string;
	user_role: string;
	is_active: boolean;
	profile: {
		id: number;
		first_name: string;
		last_name: string;
		bio: string | null;
		dob: string | null;
		phone: string;
		secondary_phone: string | null;
		secondary_address: string | null;
		secondary_email: string | null;
		address: string;
		created_at: string;
		updated_at: string;
	};
	created_at: string;
	updated_at: string;
}

export const columns: ColumnDef<User>[] = [
	{
		accessorKey: "username",
		header: () => <div className="mx-4">Username</div>,
		cell: ({ row }) => <div className="mx-4">{row.getValue("username")}</div>,
	},
	{
		accessorKey: "profile.first_name",
		header: () => <div className="mx-4">First Name</div>,
		cell: ({ row }) => (
			<div className="mx-4">{row.original.profile.first_name}</div>
		),
	},
	{
		accessorKey: "profile.last_name",
		header: () => <div className="mx-4">Last Name</div>,
		cell: ({ row }) => (
			<div className="mx-4">{row.original.profile.last_name}</div>
		),
	},
	{
		accessorKey: "email",
		header: () => {
			return <div className="mx-4">Email</div>;
		},
		cell: ({ row }) => (
			<>
				<div className="lowercase mx-4">{row.getValue("email")}</div>
			</>
		),
	},
	{
		accessorKey: "user_role",
		header: () => {
			return <div className="mx-4">Status</div>;
		},
		cell: ({ row }) => {
			const role = row.getValue("user_role");
			return (
				<div className="mx-4">
					<Badge
						variant={"booked"}
						title={role as string}
					>
						{role as string}
					</Badge>
				</div>
			);
		},
	},
	{
		accessorKey: "dob",
		header: () => {
			return <div className="mx-4">Date Of Birth</div>;
		},
		cell: ({ row }) => (
			<div className="mx-4 text-center">
				{row.original.profile.dob
					? moment(row.original.profile.dob).format("DD-MM-YYYY")
					: "-"}
			</div>
		),
	},
	{
		accessorKey: "created_at",
		header: () => {
			return <div className="mx-4">Created At</div>;
		},
		cell: ({ row }) => (
			<div className="mx-4">
				{moment(row.getValue("created_at")).format("DD-MM-YYYY")}
			</div>
		),
	},
	{
		accessorKey: "is_active",
		header: () => {
			return <div className="mx-4">Status</div>;
		},
		cell: ({ row }) => {
			const isActive = row.getValue("is_active");
			return (
				<div className="mx-4">
					<Badge
						variant={isActive ? "success" : "destructive"}
						title={isActive ? "User is active" : "User is inactive"}
					>
						{isActive ? "Active" : "Inactive"}
					</Badge>
				</div>
			);
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const user = row.original;
			return (
				<>
					{/* This is a reuseable component */}
					<UpdateUser id={user?.id}>
						<Button
							size={"icon"}
							variant={"ghost"}
						>
							<TbUserEdit />
						</Button>
					</UpdateUser>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="h-8 w-8 p-0"
							>
								<span className="sr-only">Open menu</span>
								<DotsHorizontalIcon className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<Link href={`/app/admin/users/${user.id}`}>
								<DropdownMenuItem>View profile</DropdownMenuItem>
							</Link>
							<DropdownMenuSeparator />
							<DeleteUser id={user.id} />
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			);
		},
	},
];

const DeleteUser: React.FC<{ id: number }> = ({ id }) => {
	const { mutateAsync: Delete, isPending: isDeleting } = useDeleteUser();

	async function onDelete(id: number) {
		const res = await handleResponse(() => Delete(id), 204);
		if (res.status) {
			toast("Deleted!", {
				description: `Employee has been deleted successfully.`,
				closeButton: true,
			});
		} else {
			toast("Error!", {
				description: res.message,
				action: {
					label: "Retry",
					onClick: () => onDelete(id),
				},
			});
		}
	}
	return (
		<>
			<DropdownMenuItem
				className="bg-red-500 focus:bg-red-400 text-white focus:text-white"
				onClick={() => onDelete(id)}
				disabled={isDeleting}
			>
				Delete Account
			</DropdownMenuItem>
		</>
	);
};

export default function UserTable() {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [page, setPage] = React.useState(0);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [userRole, setUserRole] = React.useState<string | null>(null);
	const { data, isLoading } = useGetUsers({ page, user_role: userRole });

	const table = useReactTable({
		data: React.useMemo(() => data?.data.data || [], [data]),
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		// getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
	});

	return (
		<div className="w-full max-w-[85vw] lg:max-w-[70vw] mx-auto relative">
			<div className="flex items-center flex-row gap-2 py-4">
				<Input
					placeholder="Filter email..."
					value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("email")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>

				<Select
					onValueChange={(v) => setUserRole(v)}
					value={userRole || undefined}
				>
					<SelectTrigger className="border-dashed gap-1 w-fit">
						<SelectValue placeholder="Filter User Type" />
					</SelectTrigger>
					<SelectContent>
						{["ADMIN", "STUDENT", "FACULTY"].map((role) => (
							<SelectItem
								key={role}
								value={role}
								className="text-center items-center"
							>
								{role}
							</SelectItem>
						))}
						<Separator />
						<Button
							variant="destructive"
							className="w-full mt-1 font-normal"
							onClick={() => setUserRole(null)}
						>
							Clear filters
						</Button>
					</SelectContent>
				</Select>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="ml-auto flex"
						>
							View
							<MixerHorizontalIcon className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{table
							.getAllColumns()
							.filter(
								(column) =>
									typeof column.accessorFn !== "undefined" &&
									column.getCanHide()
							)
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id.split("_").join(" ")}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<ScrollArea className="relative max-w-full whitespace-nowrap rounded-md border">
				<Table className="w-full">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									<TableLoading />
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>

			{/* PAGINATION */}

			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="flex-1 text-sm text-muted-foreground">
					{page + 1} of {Math.ceil((data?.data?.data?.count || 1) / 8)} page(s).
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setPage((p) => p - 1)}
						disabled={!data?.data?.data?.previous}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setPage((p) => p + 1)}
						disabled={!data?.data?.data?.next}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
