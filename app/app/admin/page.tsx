"use client";
import { useValidate } from "@/lib/actions/auth/validate.get";

export default function DashboardPage() {
  const { data } = useValidate();

  const fullname =
    data?.data?.profile?.first_name + " " + data?.data?.profile?.last_name;

  return (
    <>
      <div className="flex flex-col items-center p-8">
        <p className="text-3xl font-bold text-blue-500">{fullname}</p>
        <p className="text-lg font-sans">Welcome to Admin Dashboard</p>
      </div>
    </>
  );
}
