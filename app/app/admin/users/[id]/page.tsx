"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetUserById } from "@/lib/actions/users/user-by-id";
import { useParams } from "next/navigation";

export default function UserProfile() {
  const params = useParams();
  const { data } = useGetUserById(params.id);

  const user = data?.data?.data;
  const profile = user?.profile;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Username:</strong> {user?.username}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Role:</strong> {user?.user_role}
          </p>
          <p>
            <strong>Account Status:</strong>{" "}
            {user?.is_active ? "Active" : "Inactive"}
          </p>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>First Name:</strong> {profile?.first_name}
          </p>
          <p>
            <strong>Last Name:</strong> {profile?.last_name}
          </p>
          <p>
            <strong>Bio:</strong> {profile?.bio || "N/A"}
          </p>
          <p>
            <strong>Date of Birth:</strong> {profile?.dob || "N/A"}
          </p>
        </CardContent>
      </Card>

      {/* Contact Details */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Phone:</strong> {profile?.phone || "N/A"}
          </p>
          <p>
            <strong>Secondary Phone:</strong>{" "}
            {profile?.secondary_phone || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {profile?.address}
          </p>
          <p>
            <strong>Secondary Address:</strong>{" "}
            {profile?.secondary_address || "N/A"}
          </p>
          <p>
            <strong>Secondary Email:</strong>{" "}
            {profile?.secondary_email || "N/A"}
          </p>
        </CardContent>
      </Card>

      {/* Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle>Timestamps</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Account Created At:</strong>{" "}
            {new Date(user?.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Account Updated At:</strong>{" "}
            {new Date(user?.updated_at).toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
