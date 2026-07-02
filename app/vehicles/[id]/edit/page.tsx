import Link from "next/link";
import { notFound } from "next/navigation";
import { AccessDenied } from "@/app/access-denied";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { updateVehicle } from "../../actions";
import { VehicleForm } from "../../vehicle-form";

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser?.canEditVehicles) {
    return (
      <AccessDenied message="You don't have permission to edit vehicles." />
    );
  }

  const { id } = await params;
  const [vehicle, users] = await Promise.all([
    prisma.vehicle.findUnique({ where: { id } }),
    prisma.user.findMany({
      orderBy: { email: "asc" },
      select: { id: true, name: true, email: true },
    }),
  ]);

  if (!vehicle) {
    notFound();
  }

  const updateVehicleWithId = updateVehicle.bind(null, vehicle.id);

  return (
    <div className="mx-auto w-full max-w-xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit vehicle</h1>
        <Link href="/vehicles" className="text-sm underline">
          Back to vehicles
        </Link>
      </div>
      <VehicleForm
        action={updateVehicleWithId}
        defaultValues={{
          plate: vehicle.plate,
          vin: vehicle.vin,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          ownerId: vehicle.ownerId ?? "",
        }}
        submitLabel="Save changes"
        owners={users.map((user) => ({
          id: user.id,
          label: user.name ?? user.email,
        }))}
      />
    </div>
  );
}
