import Link from "next/link";
import { AccessDenied } from "@/app/access-denied";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { createVehicle } from "../actions";
import { VehicleForm } from "../vehicle-form";

export default async function NewVehiclePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.canCreateVehicles) {
    return (
      <AccessDenied message="You don't have permission to create vehicles." />
    );
  }

  const users = await prisma.user.findMany({
    orderBy: { email: "asc" },
    select: { id: true, name: true, email: true },
  });

  return (
    <div className="mx-auto w-full max-w-xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New vehicle</h1>
        <Link href="/vehicles" className="text-sm underline">
          Back to vehicles
        </Link>
      </div>
      <VehicleForm
        action={createVehicle}
        submitLabel="Create vehicle"
        owners={users.map((user) => ({
          id: user.id,
          label: user.name ?? user.email,
        }))}
      />
    </div>
  );
}
