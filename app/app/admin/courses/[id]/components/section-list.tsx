"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollBar } from "@/components/ui/scroll-area";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableLoading,
	TableRow,
} from "@/components/ui/table";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useGetCourses } from "@/lib/actions/courses/course.get";
import { useDeleteSection } from "@/lib/actions/courses/section/delete-section";
import handleResponse from "@/lib/response.utils";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DotsHorizontalIcon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { CiEdit } from "react-icons/ci";
import { toast } from "sonner";
import { DeleteCourse } from '@/app/app/faculty/courses/components/delete-course';
import { useGetSections } from '@/lib/actions/courses/section/sections.get-id';

export interface SectionListProps {
		id: number;
		course_id: number;
		section_title: string;
		section_description: string | null;
		section_total_seats: number;
		_count: {
			course_section_student_enrollments: number;
			course_section_faculty_assignments: number;
		};
}

export const columns: ColumnDef<SectionListProps>[] = [
	{
		accessorKey: "course_id",
		header: () => <div className="mx-4">Course Code</div>,
		cell: ({ row }) => (
			<div className="mx-4">{row.getValue("course_id")}</div>
		),
	},
	{
		accessorKey: "section_title",
		header: () => <div className="mx-4">Course Title</div>,
		cell: ({ row }) => (
			<div className="mx-4">{row.getValue("section_title")}</div>
		),
	},
	{
		accessorKey: "section_total_seats",
		header: () => <div className="mx-4">Credits</div>,
		cell: ({ row }) => (
			<div className="mx-4">{row.getValue("section_total_seats")}</div>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const section = row.original;
			return (
				<>
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
							<DropdownMenuSeparator />
							<DeleteCourse id={section.id} />
							<DropdownMenuSeparator />
							{/* <UpdateCourse courseId={course.id} /> */}
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			);
		},
	},
];

export function UpdateSection({ sectionId }: { sectionId: number | string }) {
	const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
	const { data: section } = useGetSectionById(sectionId);
	// const { mutateAsync: update } = useUpdateCourse();
	// console.log("courseId", courseId);
	// console.log("course to update", course);

	// Need To Debug
	// const handleUpdate = async (updatedData: unknown) => {
	// 	console.log("updatedData", updatedData);
	// 	const res = await handleResponse(
	// 		() => update({ id: courseId, data: updatedData }),
	// 		200
	// 	);

	// 	console.log("res", res);
	// 	// const res = await update({ id: courseId, ...data });
	// 	if (res.status) {
	// 		toast("Course Updated!", {
	// 			description: "The course has been updated successfully.",
	// 		});
	// 		setIsCreateCourseOpen(false);
	// 	} else {
	// 		toast.error("Error updating course");
	// 	}
	// };

	// return (
	// 	<CreateSectionForm
	// 		initialData={course?.data.data}
	// 		open={isCreateCourseOpen}
	// 		setOpen={setIsCreateCourseOpen}
	// 		onSubmit={handleUpdate}
	// 	/>
	// );
}

const DeleteSection: React.FC<{ id: number }> = ({ id }) => {
	const { mutateAsync: Delete, isPending: isDeleting } = useDeleteSection();

	async function onDelete(id: number) {
		// Handle the delete response
		const res = await handleResponse(() => Delete(id), 204);
		if (res.status) {
			toast("Deleted!", {
				description: `Section has been deleted successfully.`,
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
		<DropdownMenuItem
			className="bg-red-500 focus:bg-red-400 text-white focus:text-white"
			onClick={() => onDelete(id)}
			disabled={isDeleting}
		>
			Delete Section
		</DropdownMenuItem>
	);
};

export default function SectionTable({ course_id }: SectionListProps) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [page, setPage] = React.useState(0);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const { data, isLoading } = useGetSections({course_id,page});

	const table = useReactTable({
		data: React.useMemo(() => data?.data.data || [], [data]),
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
	});

	console.log(table.getRowModel().rows)

	return (
		<div className="w-full max-w-[85vw] lg:max-w-[70vw] mx-auto relative">
			<div className="flex items-center flex-row gap-2 py-4">
				<Input
					placeholder="Filter section name..."
					value={
						(table.getColumn("section_title")?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table.getColumn("section_title")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>

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
									className="text-center"
								>
									<TableLoading />
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="text-center"
								>
									No data found
								</TableCell>
							</TableRow>
						) : (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
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
						)}
					</TableBody>
				</Table>
				<ScrollBar />
			</ScrollArea>

			{/* pagination */}
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="flex-1 text-sm text-muted-foreground">
					{page} of {Math.ceil((data?.data?.data?.count || 1) / 8)} page(s).
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
			{/* pagination end */}
		</div>
	);
}
