/**
 * TeamTimezoneLanding.tsx
 *
 * A deployable landing page that displays Jorge's team timezone board
 * showing real-time local times for team members across different time zones.
 *
 * Features:
 * - Pre-loaded team members with their locations and timezones
 * - Real-time clock display for each member's local time
 * - Add additional team members if needed
 * - Professional landing page design
 * - Responsive layout for all devices
 *  -
 * Author: Jorge Pimentel
 * Created: August 2025
 *
 * Dependencies:
 * - React (hooks: useState, useEffect)
 * - Luxon (DateTime for timezone calculations)
 * - TailwindCSS (for styling)
 */

"use client";

import { DateTime } from "luxon"; // Luxon library for robust date/time handling across timezones
import React, { useEffect, useState } from "react";

// TypeScript interface defining the structure of a team member
interface User {
  id: number; // Unique identifier for each user
  name: string; // Team member's display name
  location: string; // City/Country for display
  timezone: string; // IANA timezone identifier (e.g., "America/New_York")
  flag: string; // Emoji flag for visual appeal
}

// Pre-defined team members with their locations and timezones
const INITIAL_TEAM: User[] = [
  {
    id: 1,
    name: "Jorge Pimentel",
    location: "Florida, USA",
    timezone: "America/New_York", // Florida uses Eastern Time
    flag: "🇺🇸",
  },
  {
    id: 2,
    name: "Phillip",
    location: "Hanoi, Vietnam",
    timezone: "Asia/Ho_Chi_Minh", // Vietnam timezone
    flag: "🇻🇳",
  },
  {
    id: 3,
    name: "Kevin",
    location: "Riga, Latvia",
    timezone: "Europe/Riga", // Latvia timezone
    flag: "🇱🇻",
  },
];

/**
 * Main TimezoneBoard component - Now a deployable landing page
 * Manages the state and rendering of the team timezone dashboard
 */
const TimezoneBoard: React.FC = () => {
  // State management for the component
  const [users, setUsers] = useState<User[]>(INITIAL_TEAM); // Start with pre-loaded team
  const [name, setName] = useState(""); // Form input for new member's name
  const [location, setLocation] = useState(""); // Form input for location
  const [timezone, setTimezone] = useState("America/New_York"); // Default timezone
  const [currentTime, setCurrentTime] = useState(DateTime.now()); // Current time for real-time updates
  const [mounted, setMounted] = useState(false); // Track if component has mounted to prevent hydration issues

  // Handle mounting and real-time clock updates
  useEffect(() => {
    setMounted(true); // Component has mounted on client
    setCurrentTime(DateTime.now()); // Set initial time after mount

    const interval = setInterval(() => {
      setCurrentTime(DateTime.now());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  /**
   * Handles form submission to add a new team member
   * @param e - React form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload on form submission

    // Validation: ensure name, location and timezone are provided
    if (!name || !location || !timezone) return;

    // Create new user object
    const newUser: User = {
      id: Date.now(), // Use timestamp as unique ID (simple but effective for demo)
      name,
      location,
      timezone,
      flag: "🌍", // Default flag for new members
    };

    // Add new user to the users array using spread operator to maintain immutability
    setUsers([...users, newUser]);

    // Reset form fields after successful submission
    setName("");
    setLocation("");
    setTimezone("America/New_York"); // Reset to default
  };

  /**
   * Removes a team member from the board
   * @param id - Unique identifier of the user to remove
   */
  const handleDelete = (id: number) => {
    // Filter out the user with the matching ID
    setUsers(users.filter((user) => user.id !== id));
  };

  // JSX return - The landing page UI structure
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      {/* Main container with centered layout and styling */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            🌐 Jorge&apos;s Team Timezone Board
          </h1>
          <p className="text-gray-600 text-lg">
            Real-time collaboration across continents
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Updated every second •{" "}
            {mounted
              ? currentTime.toFormat("MMMM dd, yyyy 'at' HH:mm:ss")
              : "Loading..."}{" "}
            UTC
          </div>
        </div>

        {/* Team Members Display - Main Feature */}
        <div className="grid gap-6 md:gap-4 mb-8">
          {users.map((user) => {
            // Calculate the current local time for this user's timezone using Luxon
            const localTime = mounted
              ? currentTime.setZone(user.timezone)
              : null;
            const isWorkingHours = localTime
              ? localTime.hour >= 9 && localTime.hour <= 17
              : false;

            return (
              <div
                key={user.id} // React key for efficient rendering
                className={`p-6 border-2 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md ${
                  isWorkingHours
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  {/* User information display */}
                  <div className="flex-1">
                    {/* User's name and location */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{user.flag}</span>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                          {user.name}
                        </h2>
                        <p className="text-gray-600">{user.location}</p>
                      </div>
                    </div>

                    {/* Time information */}
                    <div className="space-y-1">
                      {/* Current local time with larger, prominent display */}
                      <p className="text-2xl md:text-3xl font-mono font-bold text-blue-600">
                        {mounted && localTime
                          ? localTime.toFormat("HH:mm:ss")
                          : "--:--:--"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {mounted && localTime
                          ? localTime.toFormat("cccc, MMMM dd")
                          : "Loading..."}
                      </p>

                      {/* Timezone information */}
                      <p className="text-xs text-gray-500">
                        {mounted && localTime
                          ? localTime.offsetNameShort
                          : "--"}{" "}
                        • {user.timezone}
                      </p>

                      {/* Working hours indicator */}
                      <div className="flex items-center gap-2 mt-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isWorkingHours ? "bg-green-500" : "bg-gray-400"
                          }`}
                        ></div>
                        <span
                          className={`text-xs font-medium ${
                            isWorkingHours ? "text-green-700" : "text-gray-500"
                          }`}
                        >
                          {mounted
                            ? isWorkingHours
                              ? "Working Hours (9 AM - 5 PM)"
                              : "Outside Working Hours"
                            : "Loading..."}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Remove button for deleting this team member */}
                  {users.length > 1 && (
                    <button
                      onClick={() => handleDelete(user.id)} // Call delete function with user ID
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors duration-200 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Team Member Form - Collapsible */}
        <details className="mb-6">
          <summary className="cursor-pointer text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors">
            ➕ Add New Team Member
          </summary>

          <form
            onSubmit={handleSubmit}
            className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="grid md:grid-cols-3 gap-4">
              {/* Name input field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)} // Update name state on input change
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Maria"
                  required // HTML5 validation
                />
              </div>

              {/* Location input field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)} // Update location state on input change
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Tokyo, Japan"
                  required // HTML5 validation
                />
              </div>

              {/* Timezone input field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)} // Update timezone state on input change
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required // HTML5 validation
                >
                  <option value="America/New_York">Eastern Time (US)</option>
                  <option value="America/Chicago">Central Time (US)</option>
                  <option value="America/Denver">Mountain Time (US)</option>
                  <option value="America/Los_Angeles">Pacific Time (US)</option>
                  <option value="Europe/London">London, UK</option>
                  <option value="Europe/Paris">Paris, France</option>
                  <option value="Europe/Berlin">Berlin, Germany</option>
                  <option value="Europe/Riga">Riga, Latvia</option>
                  <option value="Asia/Tokyo">Tokyo, Japan</option>
                  <option value="Asia/Shanghai">Shanghai, China</option>
                  <option value="Asia/Seoul">Seoul, South Korea</option>
                  <option value="Asia/Ho_Chi_Minh">
                    Ho Chi Minh City, Vietnam
                  </option>
                  <option value="Asia/Kolkata">Mumbai, India</option>
                  <option value="Australia/Sydney">Sydney, Australia</option>
                  <option value="Pacific/Auckland">
                    Auckland, New Zealand
                  </option>
                </select>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Add Team Member
            </button>
          </form>
        </details>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Built with ❤️ by Jorge Pimentel • Updated in real-time
          </p>
        </div>
      </div>
    </div>
  );
};

// Export the component as default for use in other files
export default TimezoneBoard;
