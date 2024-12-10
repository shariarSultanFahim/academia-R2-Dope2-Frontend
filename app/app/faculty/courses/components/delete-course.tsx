import { useDeleteCourse } from "@/lib/actions/courses/delete-course";
import handleResponse from "@/lib/response.utils";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";

export const DeleteCourse: React.FC<{ id: number }> = ({ id }) => {
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
