"use client";
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
import { useGetCourses } from "@/lib/actions/courses/course.get";
import { useDeleteCourse } from "@/lib/actions/courses/delete-course";
import handleResponse from "@/lib/response.utils";
import { DotsHorizontalIcon, MixerHorizontalIcon } from "@radix-ui/react-icons";
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
import moment from "moment";
import Link from "next/link";
import * as React from "react";
import { TbUserEdit } from "react-icons/tb";
import { toast } from "sonner";
import { UpdateCourse } from "./update-course";

// import { UpdateCourse } from "./update-course";

export interface Course {
  id: number;
  course_code: string;
  course_title: string;
  course_category: string;
  course_description: string;
  course_credits: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "course_code",
    header: () => <div className="mx-4">Course Code</div>,
    cell: ({ row }) => (
      <div className="mx-4">{row.getValue("course_code")}</div>
    ),
  },
  {
    accessorKey: "course_title",
    header: () => <div className="mx-4">Course Title</div>,
    cell: ({ row }) => (
      <div className="mx-4">{row.getValue("course_title")}</div>
    ),
  },
  {
    accessorKey: "course_credits",
    header: () => <div className="mx-4">Credits</div>,
    cell: ({ row }) => (
      <div className="mx-4">{row.getValue("course_credits")}</div>
    ),
  },

  {
    accessorKey: "course_start_date",
    header: () => <div className="mx-4">Start Date</div>,
    cell: ({ row }) => {
      const startDate = moment(row.getValue("course_start_date"));
      return (
        <div className="mx-4">
          {startDate.isValid() ? startDate.format("DD-MM-YYYY") : ""}
        </div>
      );
    },
  },

  {
    accessorKey: "course_end_date",
    header: () => <div className="mx-4">End Date</div>,
    cell: ({ row }) => {
      const endDate = moment(row.getValue("course_end_date"));
      return (
        <div className="mx-4">
          {endDate.isValid() ? endDate.format("DD-MM-YYYY") : ""}
        </div>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const course = row.original;
      return (
        <>
          {/* This is a reuseable component */}
          <UpdateCourse id={course?.id}>
            <Button size={"icon"} variant={"ghost"}>
              <TbUserEdit />
            </Button>
          </UpdateCourse>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href={`/app/admin/courses/${course.id}`}>
                  View Course
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteCourse id={course.id} />
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
const DeleteCourse: React.FC<{ id: number }> = ({ id }) => {
  const { mutateAsync: Delete, isPending: isDeleting } = useDeleteCourse();

  async function onDelete(id: number) {
    // Handle the delete response
    const res = await handleResponse(() => Delete(id), 204);
    if (res.status) {
      toast("Deleted!", {
        description: `Course has been deleted successfully.`,
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
      Delete Course
    </DropdownMenuItem>
  );
};

export default function CourseTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [page, setPage] = React.useState(0);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const { data, isLoading } = useGetCourses({
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
          placeholder="Filter course name..."
          value={
            (table.getColumn("course_title")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("course_title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto flex">
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
                <TableCell colSpan={columns.length} className="text-center">
                  <TableLoading />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
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
