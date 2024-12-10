"use client";

import { useParams } from "next/navigation";

export default function UserProfile() {
  const params = useParams();
  // console.log(params);
  return (
    <div>
      <h1>{params.id} Profile</h1>
    </div>
  );
};

