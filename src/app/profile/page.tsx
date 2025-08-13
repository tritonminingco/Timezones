/**
 * Profile Page
 *
 * User profile management page
 */

import UserProfile from "@/components/auth/UserProfile";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <UserProfile />
      </div>
    </div>
  );
}
