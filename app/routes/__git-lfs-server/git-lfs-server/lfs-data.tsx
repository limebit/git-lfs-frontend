import React from "react";

export default function Page() {
  return (
    <div className="px-4 tablet:px-6 laptop:px-8">
      <div className="tablet:flex tablet:items-center">
        <div className="tablet:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">LFS Data</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title,
            email and role.
          </p>
        </div>
      </div>
    </div>
  );
}
