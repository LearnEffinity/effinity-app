"use client";
import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="mb-[44px] text-4xl font-bold text-text-primary">
        Settings
      </h1>
      <div className="flex w-full gap-8">
        {/* Sidebar */}
        <div className="mr-14">
          <div className="mb-8">
            <h2 className="mb-2 text-xl font-semibold text-text-secondary">
              Account
            </h2>
            <div className="-ml-2 flex flex-col gap-2">
              <a
                href="/settings/profile"
                className="px-3 py-2 text-lg font-medium text-icon-secondary transition-all duration-300 ease-in-out hover:rounded-lg hover:bg-[#EFEFF5]"
              >
                Profile
              </a>
              <a
                href="/settings/preferences"
                className="px-3 py-2 text-lg font-medium text-icon-secondary transition-all duration-300 ease-in-out hover:rounded-lg hover:bg-[#EFEFF5]"
              >
                Preferences
              </a>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-2 text-xl font-semibold text-text-secondary">
              Subscription
            </h2>
            <div className="-ml-2 flex flex-col gap-2">
              <a
                href="/settings/manage-plan"
                className="px-3 py-2 text-lg font-medium text-icon-secondary transition-all duration-300 ease-in-out hover:rounded-lg hover:bg-[#EFEFF5]"
              >
                Manage Plan
              </a>
            </div>
          </div>
        </div>

        <div className="-mt-2 flex-1">
          <h1 className="mb-5 text-3xl font-semibold text-text-primary">
            Profile
          </h1>
          <h2 className="text-xl font-semibold text-icon-secondary">Avatar</h2>
          <p className="mb-6">Update avatar here</p>
          <div className="flex-col items-start space-y-4">
            <div>
              <h3 className="mb-2 text-xl font-semibold text-text-secondary">
                Name
              </h3>
              <input
                type="text"
                placeholder="Name"
                className="border-border-primary w-full rounded-lg border p-3"
              />
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold text-text-secondary">
                Username
              </h3>
              <input
                type="text"
                placeholder="Username"
                className="border-border-primary w-full rounded-lg border p-3"
              />
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold text-text-secondary">
                Email
              </h3>
              <input
                type="text"
                placeholder="Name"
                className="border-border-primary w-full rounded-lg border p-3"
              />
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold text-text-secondary">
                Current Password
              </h3>
              <input
                type="text"
                placeholder="Name"
                className="border-border-primary w-full rounded-lg border p-3"
              />
            </div>
            <div>
              <h3 className="mb-2 text-xl font-semibold text-text-secondary">
                New Password
              </h3>
              <input
                type="text"
                placeholder="Name"
                className="border-border-primary w-full rounded-lg border p-3"
              />
            </div>
            <div>
              <button
                disabled
                className="rounded-lg bg-brand-primary px-4 py-2 text-white disabled:bg-brand-primary/50"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
