import { Separator } from "@/components/ui/separator";
import { CreateUser } from "./create-users";
import UserTable from "./usertable";

export default function UsersListPage() {
	return (
		<div className="space-y-4 block">
      <div className="p-6 pb-1 flex flex-row items-center justify-between">
        <div className="space-y-0.5 ">
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground text-sm">
            Here&apos;s a list of your employees!
          </p>
        </div>
        <CreateUser/>
      </div>
      <Separator />

      <div className="px-9">
        <UserTable/>
      </div>
    </div>
	);
}
