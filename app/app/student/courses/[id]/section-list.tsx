"use client";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableLoading,
	TableRow,
} from "@/components/ui/table";
import handleResponse from "@/lib/response.utils";
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
import * as React from "react";
import { toast } from "sonner";
import { TbUserEdit } from "react-icons/tb";
import { useEnrollToCourse } from "@/lib/actions/courses/enroll-course";
import { useValidate } from "@/lib/actions/auth/validate.get";
import { useGetSections } from "@/lib/actions/courses/section/sections.get";
import { useParams } from "next/navigation";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
// import { UpdateCourse } from "./update-course";

export interface Sections {
	id: number;
	course_id: number;
	section_title: string;
	section_total_seats: number;
    _count:{
        course_section_student_enrollments:number;
    }
}

const EnrollCourseButton: React.FC<{sectionId: number}> = ( {sectionId}) => {
    const {mutateAsync:create} = useEnrollToCourse();
    const {data: user} = useValidate();


	async function onSubmit() {
		// Handle the delete response
		const res = await handleResponse(() => create({
            section_id: sectionId,
            user_id: user?.data?.id,
            enrollment_status: "PENDING"
          }), 201);
		if (res.status) {
			toast("Success!", {
				description: `Course has been joined successfully.`,
				closeButton: true,
			});
		} else {
			toast("Error!", {
				description: res.message,
				action: {
					label: "Retry",
					onClick: () => onSubmit(),
				},
			});
		}
	}

	return (
		<Button
			size={"icon"}
			variant={"ghost"}
            onClick={onSubmit}
		>
			<TbUserEdit />
		</Button>
	);
};

export const columns: ColumnDef<Sections>[] = [
	{
		accessorKey: "id",
		header: () => <div className="mx-4">Section ID</div>,
		cell: ({ row }) => (
			<div className="mx-4">{row.getValue("id")}</div>
		),
	},
	{
		accessorKey: "course_id",
		header: () => <div className="mx-4">Course ID</div>,
		cell: ({ row }) => (
			<div className="mx-4">{row.getValue("course_id")}</div>
		),
	},
	{
		accessorKey: "section_title",
		header: () => <div className="mx-4">Section Title</div>,
		cell: ({ row }) => (
			<div className="mx-4">{row.getValue("section_title")}</div>
		),
	},

	{
		accessorKey: "section_total_seats",
		header: () => <div className="mx-4">Total Seats</div>,
		cell: ({ row }) => {
			return (
				<div className="mx-4">{row.getValue("section_total_seats")}</div>
			);
		},
	},
	{
		accessorKey: "section_seats_left",
		header: () => <div className="mx-4">Seats Left</div>,
		cell: ({ row }) => {
			return (
				<div className="mx-4">{(row.original.section_total_seats - row.original._count.course_section_student_enrollments)}</div>
			);
		},
	},

	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
            const section = row.original;
			return (
				<>
					{/* This is a reuseable component */}
						<EnrollCourseButton sectionId = {section.id}/>
							
				</>
			);
		},
	},
];



export default function CourseTable() {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [page, setPage] = React.useState(0);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
    const {id} = useParams<{id: string }>();
	const [columnVisibility, setColumnVisibility] =
	React.useState<VisibilityState>({});

	const { data, isLoading } = useGetSections({
        course_id:id,
		page,
	});

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
