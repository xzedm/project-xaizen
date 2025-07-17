"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackToProfileButton() {
  const router = useRouter();

  const goBackToProfile = () => {
    router.push("/profile");
  };

  return (
    <div
      onClick={goBackToProfile}
      className="px-4 py-2 cursor-pointer h-11"
    >
      <ArrowLeft />
    </div>
  );
}