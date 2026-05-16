import * as React from "react";

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <span className="text-slate-500 font-medium text-sm">
        {message}
      </span>
    </div>
  );
}
