import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import EmployeeForm from "@/components/EmployeeForm";
import EmployeeList from "@/components/EmployeeList";

export default async function EmployeesPage() {
  if (!(await isAdmin())) redirect("/admin/my-trips");

  const employees = await prisma.employees.findMany({
    include: { assignments: { include: { trip: true } } },
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-haiti-navy dark:text-haiti-turquoise">Employees</h1>
        <p className="sub mt-1">Guides, drivers, and anyone else helping run trips.</p>
      </div>

      <EmployeeForm />
      <EmployeeList employees={employees} />
    </div>
  );
}

export const dynamic = "force-dynamic";
