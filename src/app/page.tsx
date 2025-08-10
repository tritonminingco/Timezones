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
 * - SHARED DATABASE: All users see the same team members
 * - Auto-sync every 30 seconds
 *
 * Author: Jorge Pimentel
 * Created: August 2025
 *
 * Dependencies:
 * - React (hooks: useState, useEffect)
 * - Luxon (DateTime for timezone calculations)
 * - TailwindCSS (for styling)
 * - Vercel Postgres (shared database)
 */

"use client";

import { DateTime } from "luxon"; // Luxon library for robust date/time handling across timezones
import React, { useEffect, useState } from "react";
import { useTeamMembers } from "../hooks/useTeamMembers"; // Custom hook for shared database

/**
 * Main TimezoneBoard component - Now with shared database
 * Manages the state and rendering of the team timezone dashboard
 * Data is shared between all users accessing the page
 */
const TimezoneBoard: React.FC = () => {
  // Shared database state using custom hook
  const { members, loading, error, addMember, removeMember, refreshMembers } =
    useTeamMembers();

  // Form state for adding new members
  const [name, setName] = useState(""); // Form input for new member's name
  const [location, setLocation] = useState(""); // Form input for location
  const [timezone, setTimezone] = useState("America/New_York"); // Default timezone

  // Time state
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
   * Handles form submission to add a new team member to shared database
   * @param e - React form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload on form submission

    // Validation: ensure name, location and timezone are provided
    if (!name || !location || !timezone) return;

    // Add member to shared database
    const success = await addMember({
      name,
      location,
      timezone,
      flag: "🌍", // Default flag for new members
    });

    if (success) {
      // Reset form fields after successful submission
      setName("");
      setLocation("");
      setTimezone("America/New_York"); // Reset to default
    }
  };

  /**
   * Removes a team member from the shared database
   * @param id - Unique identifier of the user to remove
   */
  const handleDelete = async (id: number) => {
    await removeMember(id);
  };

  // Show loading state
  if (loading && members.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team timezone board...</p>
        </div>
      </div>
    );
  }

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

          {/* Database status indicator */}
          <div className="mt-2 flex items-center justify-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                loading ? "bg-yellow-500" : "bg-green-500"
              }`}
            ></div>
            <span className="text-xs text-gray-500">
              {loading ? "Syncing..." : "Connected • Auto-sync every 30s"}
            </span>
            <button
              onClick={refreshMembers}
              className="text-xs text-blue-600 hover:text-blue-800 ml-2"
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          {/* Error display */}
          {error && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Team Members Display - Main Feature */}
        <div className="grid gap-6 md:gap-4 mb-8">
          {members.map((member) => {
            // Calculate the current local time for this user's timezone using Luxon
            const localTime = mounted
              ? currentTime.setZone(member.timezone)
              : null;
            const isWorkingHours = localTime
              ? localTime.hour >= 9 && localTime.hour <= 17
              : false;

            return (
              <div
                key={member.id} // React key for efficient rendering
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
                      <span className="text-2xl">{member.flag}</span>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                          {member.name}
                        </h2>
                        <p className="text-gray-600">{member.location}</p>
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
                        • {member.timezone}
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
                  {members.length > 1 && (
                    <button
                      onClick={() => handleDelete(member.id)} // Call delete function with user ID
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors duration-200 text-sm"
                      disabled={loading}
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
          <summary className="cursor-pointer text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors border-2 border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:bg-blue-50">
            ➕ Add New Team Member
          </summary>

          <form
            onSubmit={handleSubmit}
            className="mt-4 space-y-4 p-6 bg-white border-2 border-gray-200 rounded-lg shadow-sm"
          >
            <div className="grid md:grid-cols-3 gap-4">
              {/* Name input field */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)} // Update name state on input change
                  className="w-full text-gray-800 border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Maria"
                  required // HTML5 validation
                  disabled={loading}
                />
              </div>

              {/* Location input field */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)} // Update location state on input change
                  className="w-full text-gray-800 border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Tokyo, Japan"
                  required // HTML5 validation
                  disabled={loading}
                />
              </div>

              {/* Timezone input field */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)} // Update timezone state on input change
                  className="w-full border-2 text-gray-800 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  required // HTML5 validation
                  disabled={loading}
                >
                  {/* North America */}
                  <optgroup label="🇺🇸 United States & Canada">
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">
                      Pacific Time (PT)
                    </option>
                    <option value="America/Anchorage">Alaska Time (AKT)</option>
                    <option value="Pacific/Honolulu">Hawaii Time (HST)</option>
                    <option value="America/Toronto">Toronto, Canada</option>
                    <option value="America/Vancouver">Vancouver, Canada</option>
                    <option value="America/Montreal">Montreal, Canada</option>
                  </optgroup>

                  {/* Central & South America */}
                  <optgroup label="🌎 Central & South America">
                    <option value="America/Mexico_City">
                      Mexico City, Mexico
                    </option>
                    <option value="America/Guatemala">
                      Guatemala City, Guatemala
                    </option>
                    <option value="America/Bogota">Bogotá, Colombia</option>
                    <option value="America/Lima">Lima, Peru</option>
                    <option value="America/Santiago">Santiago, Chile</option>
                    <option value="America/Buenos_Aires">
                      Buenos Aires, Argentina
                    </option>
                    <option value="America/Sao_Paulo">São Paulo, Brazil</option>
                    <option value="America/Caracas">Caracas, Venezuela</option>
                    <option value="America/Panama">Panama City, Panama</option>
                  </optgroup>

                  {/* Europe */}
                  <optgroup label="🇪🇺 Europe">
                    <option value="Europe/London">London, UK</option>
                    <option value="Europe/Dublin">Dublin, Ireland</option>
                    <option value="Europe/Paris">Paris, France</option>
                    <option value="Europe/Berlin">Berlin, Germany</option>
                    <option value="Europe/Rome">Rome, Italy</option>
                    <option value="Europe/Madrid">Madrid, Spain</option>
                    <option value="Europe/Amsterdam">
                      Amsterdam, Netherlands
                    </option>
                    <option value="Europe/Brussels">Brussels, Belgium</option>
                    <option value="Europe/Zurich">Zurich, Switzerland</option>
                    <option value="Europe/Vienna">Vienna, Austria</option>
                    <option value="Europe/Prague">
                      Prague, Czech Republic
                    </option>
                    <option value="Europe/Warsaw">Warsaw, Poland</option>
                    <option value="Europe/Budapest">Budapest, Hungary</option>
                    <option value="Europe/Bucharest">Bucharest, Romania</option>
                    <option value="Europe/Athens">Athens, Greece</option>
                    <option value="Europe/Stockholm">Stockholm, Sweden</option>
                    <option value="Europe/Oslo">Oslo, Norway</option>
                    <option value="Europe/Copenhagen">
                      Copenhagen, Denmark
                    </option>
                    <option value="Europe/Helsinki">Helsinki, Finland</option>
                    <option value="Europe/Riga">Riga, Latvia</option>
                    <option value="Europe/Tallinn">Tallinn, Estonia</option>
                    <option value="Europe/Vilnius">Vilnius, Lithuania</option>
                    <option value="Europe/Kiev">Kiev, Ukraine</option>
                    <option value="Europe/Moscow">Moscow, Russia</option>
                    <option value="Europe/Istanbul">Istanbul, Turkey</option>
                  </optgroup>

                  {/* Africa */}
                  <optgroup label="🌍 Africa">
                    <option value="Africa/Cairo">Cairo, Egypt</option>
                    <option value="Africa/Lagos">Lagos, Nigeria</option>
                    <option value="Africa/Nairobi">Nairobi, Kenya</option>
                    <option value="Africa/Johannesburg">
                      Johannesburg, South Africa
                    </option>
                    <option value="Africa/Casablanca">
                      Casablanca, Morocco
                    </option>
                    <option value="Africa/Tunis">Tunis, Tunisia</option>
                    <option value="Africa/Algiers">Algiers, Algeria</option>
                    <option value="Africa/Accra">Accra, Ghana</option>
                    <option value="Africa/Addis_Ababa">
                      Addis Ababa, Ethiopia
                    </option>
                  </optgroup>

                  {/* Asia */}
                  <optgroup label="🌏 Asia">
                    <option value="Asia/Tokyo">Tokyo, Japan</option>
                    <option value="Asia/Seoul">Seoul, South Korea</option>
                    <option value="Asia/Shanghai">Shanghai, China</option>
                    <option value="Asia/Beijing">Beijing, China</option>
                    <option value="Asia/Hong_Kong">Hong Kong</option>
                    <option value="Asia/Taipei">Taipei, Taiwan</option>
                    <option value="Asia/Singapore">Singapore</option>
                    <option value="Asia/Bangkok">Bangkok, Thailand</option>
                    <option value="Asia/Ho_Chi_Minh">
                      Ho Chi Minh City, Vietnam
                    </option>
                    <option value="Asia/Jakarta">Jakarta, Indonesia</option>
                    <option value="Asia/Manila">Manila, Philippines</option>
                    <option value="Asia/Kuala_Lumpur">
                      Kuala Lumpur, Malaysia
                    </option>
                    <option value="Asia/Kolkata">Mumbai, India</option>
                    <option value="Asia/Delhi">Delhi, India</option>
                    <option value="Asia/Dhaka">Dhaka, Bangladesh</option>
                    <option value="Asia/Karachi">Karachi, Pakistan</option>
                    <option value="Asia/Kabul">Kabul, Afghanistan</option>
                    <option value="Asia/Tehran">Tehran, Iran</option>
                    <option value="Asia/Dubai">Dubai, UAE</option>
                    <option value="Asia/Riyadh">Riyadh, Saudi Arabia</option>
                    <option value="Asia/Kuwait">Kuwait City, Kuwait</option>
                    <option value="Asia/Baghdad">Baghdad, Iraq</option>
                    <option value="Asia/Jerusalem">Jerusalem, Israel</option>
                    <option value="Asia/Beirut">Beirut, Lebanon</option>
                    <option value="Asia/Damascus">Damascus, Syria</option>
                    <option value="Asia/Amman">Amman, Jordan</option>
                    <option value="Asia/Baku">Baku, Azerbaijan</option>
                    <option value="Asia/Yerevan">Yerevan, Armenia</option>
                    <option value="Asia/Tbilisi">Tbilisi, Georgia</option>
                    <option value="Asia/Almaty">Almaty, Kazakhstan</option>
                    <option value="Asia/Tashkent">Tashkent, Uzbekistan</option>
                    <option value="Asia/Novosibirsk">
                      Novosibirsk, Russia
                    </option>
                    <option value="Asia/Vladivostok">
                      Vladivostok, Russia
                    </option>
                  </optgroup>

                  {/* Australia & Oceania */}
                  <optgroup label="🇦🇺 Australia & Oceania">
                    <option value="Australia/Sydney">Sydney, Australia</option>
                    <option value="Australia/Melbourne">
                      Melbourne, Australia
                    </option>
                    <option value="Australia/Brisbane">
                      Brisbane, Australia
                    </option>
                    <option value="Australia/Perth">Perth, Australia</option>
                    <option value="Australia/Adelaide">
                      Adelaide, Australia
                    </option>
                    <option value="Australia/Darwin">Darwin, Australia</option>
                    <option value="Pacific/Auckland">
                      Auckland, New Zealand
                    </option>
                    <option value="Pacific/Wellington">
                      Wellington, New Zealand
                    </option>
                    <option value="Pacific/Fiji">Suva, Fiji</option>
                    <option value="Pacific/Honolulu">Honolulu, Hawaii</option>
                    <option value="Pacific/Guam">Guam</option>
                  </optgroup>

                  {/* Atlantic */}
                  <optgroup label="🌊 Atlantic">
                    <option value="Atlantic/Reykjavik">
                      Reykjavik, Iceland
                    </option>
                    <option value="Atlantic/Azores">Azores, Portugal</option>
                    <option value="Atlantic/Cape_Verde">Cape Verde</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                disabled={loading}
              >
                {loading ? "⏳ Adding..." : "✅ Add Team Member"}
              </button>
            </div>
          </form>
        </details>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Built with ❤️ by Jorge Pimentel • Updated in real-time • Shared
            across all users
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Powered by Vercel Postgres Database
          </p>
        </div>
      </div>
    </div>
  );
};

// Export the component as default for use in other files
export default TimezoneBoard;
