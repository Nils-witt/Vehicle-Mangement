"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/app/generated/prisma/client";
import { hasPermission } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export type VehicleFormState = {
  error?: string;
};

type ParsedVehicleData = {
  plate: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  ownerId: string | null;
};

const CURRENT_YEAR = new Date().getFullYear();

function parseVehicleForm(
  formData: FormData,
): VehicleFormState & { data?: ParsedVehicleData } {
  const plate = String(formData.get("plate") ?? "").trim();
  const vin = String(formData.get("vin") ?? "").trim();
  const make = String(formData.get("make") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim();
  const yearRaw = String(formData.get("year") ?? "").trim();
  const ownerId = String(formData.get("ownerId") ?? "").trim();

  if (!plate) {
    return { error: "A license plate is required." };
  }
  if (!vin) {
    return { error: "A VIN is required." };
  }
  if (!make) {
    return { error: "A make is required." };
  }
  if (!model) {
    return { error: "A model is required." };
  }

  const year = Number(yearRaw);
  if (!Number.isInteger(year) || year < 1900 || year > CURRENT_YEAR + 1) {
    return { error: `Year must be between 1900 and ${CURRENT_YEAR + 1}.` };
  }

  return {
    data: {
      plate,
      vin,
      make,
      model,
      year,
      ownerId: ownerId.length > 0 ? ownerId : null,
    },
  };
}

function isUniqueConstraintError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function createVehicle(
  _prevState: VehicleFormState,
  formData: FormData,
): Promise<VehicleFormState> {
  if (!(await hasPermission("canCreateVehicles"))) {
    return { error: "You don't have permission to create vehicles." };
  }

  const parsed = parseVehicleForm(formData);
  if (!parsed.data) {
    return { error: parsed.error };
  }

  try {
    await prisma.vehicle.create({ data: parsed.data });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: "A vehicle with this plate or VIN already exists." };
    }
    throw error;
  }

  revalidatePath("/vehicles");
  redirect("/vehicles");
}

export async function updateVehicle(
  vehicleId: string,
  _prevState: VehicleFormState,
  formData: FormData,
): Promise<VehicleFormState> {
  if (!(await hasPermission("canEditVehicles"))) {
    return { error: "You don't have permission to edit vehicles." };
  }

  const parsed = parseVehicleForm(formData);
  if (!parsed.data) {
    return { error: parsed.error };
  }

  try {
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: parsed.data,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { error: "A vehicle with this plate or VIN already exists." };
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { error: "This vehicle no longer exists." };
    }
    throw error;
  }

  revalidatePath("/vehicles");
  redirect("/vehicles");
}

export async function deleteVehicle(vehicleId: string): Promise<void> {
  if (!(await hasPermission("canDeleteVehicles"))) {
    throw new Error("You don't have permission to delete vehicles.");
  }

  await prisma.vehicle.delete({ where: { id: vehicleId } });
  revalidatePath("/vehicles");
}
