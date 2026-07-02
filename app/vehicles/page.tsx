import Link from "next/link";
import { AccessDenied } from "@/app/access-denied";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { DeleteVehicleButton } from "./delete-vehicle-button";

export default async function VehiclesPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.canViewVehicles) {
    return (
      <AccessDenied message="You don't have permission to view vehicles." />
    );
  }

  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
    include: { owner: true },
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Vehicles</h1>
        {currentUser.canCreateVehicles && (
          <Link
            href="/vehicles/new"
            className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            New vehicle
          </Link>
        )}
      </div>

      {vehicles.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No vehicles yet.
        </p>
      ) : (
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 dark:border-white/10">
              <th className="py-2 pr-4 font-medium">Plate</th>
              <th className="py-2 pr-4 font-medium">Make / Model</th>
              <th className="py-2 pr-4 font-medium">Year</th>
              <th className="py-2 pr-4 font-medium">VIN</th>
              <th className="py-2 pr-4 font-medium">Owner</th>
              <th className="py-2 pr-4 font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="border-b border-black/5 dark:border-white/5"
              >
                <td className="py-2 pr-4">{vehicle.plate}</td>
                <td className="py-2 pr-4">
                  {vehicle.make} {vehicle.model}
                </td>
                <td className="py-2 pr-4">{vehicle.year}</td>
                <td className="py-2 pr-4">{vehicle.vin}</td>
                <td className="py-2 pr-4">
                  {vehicle.owner?.name ?? vehicle.owner?.email ?? "—"}
                </td>
                <td className="py-2 pr-4">
                  <div className="flex items-center gap-3">
                    {currentUser.canEditVehicles && (
                      <Link
                        href={`/vehicles/${vehicle.id}/edit`}
                        className="underline"
                      >
                        Edit
                      </Link>
                    )}
                    {currentUser.canDeleteVehicles && (
                      <DeleteVehicleButton vehicleId={vehicle.id} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
