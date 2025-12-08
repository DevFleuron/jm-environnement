"use client";

import Link from "next/link";
import { FaFolderOpen } from "react-icons/fa";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { Skeleton } from "@/components/ui/Skeleton";

export default function SocietesList({ societes, loading }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-4 border rounded-lg"
          >
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="w-9 h-9 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className="w-9 h-9" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {societes.map((societe) => (
        <div
          key={societe._id}
          className="flex border mt-2 items-center justify-between px-4 py-3 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <HiBuildingOffice2 className="w-9 h-9" color="#0c769e" />
            <span className="font-bold text-lg">{societe.nom}</span>
          </div>
          <Link
            href={`/societes/${societe._id}`}
            className="text-sky-500 hover:text-sky-600"
          >
            <FaFolderOpen className="w-9 h-9" color="#0c769e" />
          </Link>
        </div>
      ))}
    </div>
  );
}
