import Link from "next/link";
import { ROUTES } from "@/constants/routes.constants";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-slate-50 font-sans p-6">
      <main className="w-full max-w-md bg-white border border-slate-200 shadow-sm rounded-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 tracking-tight">
          Unauthorized Access
        </h1>
        <p className="mt-4 text-slate-600 text-sm leading-relaxed">
          You do not have permission to view this page.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={ROUTES.LOGIN}
            className="flex items-center justify-center w-full py-2.5 px-4 rounded-md shadow-xs text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition duration-150 ease-in-out"
          >
            Back to Login
          </Link>
          <Link
            href={ROUTES.HOME}
            className="flex items-center justify-center w-full py-2.5 px-4 rounded-md shadow-xs text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition duration-150 ease-in-out"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
