/**
 * User Profile Component
 *
 * Shows user information from SSO providers and allows account management
 */

"use client";

import { useAuth } from "@/lib/query/hooks/useAuth";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

interface ProfileFieldProps {
  label: string;
  value: string | null | undefined;
  editable?: boolean;
  onSave?: (value: string) => void;
}

function ProfileField({
  label,
  value,
  editable = false,
  onSave,
}: ProfileFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || "");

  const handleSave = () => {
    if (onSave) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-200">
      <span className="font-medium text-gray-700">{label}:</span>
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          />
          <button
            onClick={handleSave}
            className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-2 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-gray-900">{value || "Not set"}</span>
          {editable && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function UserProfile() {
  const { data: session, status } = useSession();
  const { updateProfile, isUpdatingProfile } = useAuth();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Please sign in to view your profile.</p>
      </div>
    );
  }

  const handleUpdateProfile = async (field: string, value: string) => {
    try {
      await updateProfile({ [field]: value });
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };

  // Get provider information
  const provider = session.user?.email?.includes("gmail.com")
    ? "Google"
    : session.user?.email?.includes("github")
    ? "GitHub"
    : "Unknown";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
          <div className="flex items-center gap-4">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-white"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {session.user?.name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">
                {session.user?.name || "User"}
              </h1>
              <p className="text-blue-100">Signed in via {provider}</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

          <ProfileField
            label="Name"
            value={session.user?.name}
            editable={true}
            onSave={(value) => handleUpdateProfile("name", value)}
          />

          <ProfileField
            label="Email"
            value={session.user?.email}
            editable={false}
          />

          <ProfileField label="Provider" value={provider} editable={false} />

          <ProfileField
            label="Account Created"
            value={session.user?.email ? "Connected via SSO" : "Unknown"}
            editable={false}
          />
        </div>

        {/* Account Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <h3 className="text-md font-semibold mb-3">Account Actions</h3>
          <div className="flex gap-3">
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>

            <button
              onClick={() => (window.location.href = "/auth/signin")}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Switch Account
            </button>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="px-6 py-4 border-t border-gray-200">
          <h3 className="text-md font-semibold mb-3">Connected Accounts</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
              <div className="flex items-center gap-3">
                <span className="text-green-600">✓</span>
                <div>
                  <p className="font-medium text-green-800">{provider}</p>
                  <p className="text-sm text-green-600">
                    {session.user?.email}
                  </p>
                </div>
              </div>
              <span className="text-sm text-green-600 font-medium">
                Connected
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-3">
            Your account is securely connected via {provider} SSO. This provides
            enhanced security and easy access.
          </p>
        </div>
      </div>
    </div>
  );
}
