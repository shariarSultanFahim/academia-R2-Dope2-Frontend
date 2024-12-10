"use client";

import { useParams } from "next/navigation";

export default function Section() {
  const params = useParams();
  // console.log(params);
  return (
    <div>
      <h1>{params.id} Sectin Details Page</h1>
    </div>
  );
};

