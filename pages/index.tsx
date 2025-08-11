/**
 * TeamTimezoneLanding.tsx
 * 
 * A deployable landing page that displays team timezone board 
 * showing real-time local times for team members across different time zones.
 * 
 * Features:
 * - Pre-loaded team members with their locations and timezones
 * - Real-time clock display for each member's local time
 * - Add additional team members if needed
 * - Professional landing page design
 * - Responsive layout for all devices
 *  - 
 * Author: Jorge P
 * Created: August 2025
 * 
 * Dependencies:
 * - React (hooks: useState, useEffect)
 * - Luxon (DateTime for timezone calculations)
 * - TailwindCSS (for styling)
 */

import React, { useState, useEffect } from   b "react";
import { DateTime } from "luxon"; // Luxon library for robust date/time handling across timezones

// TypeScript interface defining the structure of a team member
interface User {
  id: number;      // Unique identifier for each user
  name: string;    // Team member's display name
  location: string; // City/Country for display
  timezone: string; // IANA timezone identifier (e.g., "America/New_York")
  flag: string;    // Emoji flag for visual appeal
}

// Pre-defined team members with their locations and timezones
const INITIAL_TEAM: User[] = [
  {
    id: 1,
    name: "Jorge",
    location: "Florida, USA",
    timezone: "America/New_York", // Florida uses Eastern Time
    flag: "🇺🇸"
  },
  {
    id: 2,
    name: "Phillip",
    location: "Hanoi, Vietnam", 
    timezone: "Asia/Ho_Chi_Minh", // Vietnam timezone
    flag: "🇻🇳"
  },
  {
    id: 3,
    name: "Kevin",
    location: "Riga, Latvia",
    timezone: "Europe/Riga", // Latvia timezone
    flag: "🇱🇻"
  },
  {
    id: 4,
    name: "Caleb",
    location: "Nigeria, Abuja",
    timezone: "Australia/Sydney",
    flag: "NG"
  },
  {
    id: 6,
    name: "Lewis Bright",
    location: "London, UK",
    timezone: "Europe/London",
    flag: "🇬🇧"
  }
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

  // Real-time clock updates every second
  useEffect(() => {
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
      flag: "🌍" // Default flag for new members
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
            🌐 Jorge's Team Timezone Board
          </h1>
          <p className="text-gray-600 text-lg">
            Real-time collaboration across continents
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Updated every second • {currentTime.toFormat("MMMM dd, yyyy 'at' HH:mm:ss")} UTC
          </div>
        </div>

        {/*
         * =============================
         * TEAM MEMBERS DASHBOARD BLOCKS
         * =============================
         * Display all team members as blocks in a responsive grid.
         * Each block shows name, location, local time, and work status.
         * Blocks are placed next to each other for a comprehensive overview.
         */}
        <div
          className="grid gap-4 mb-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {users.map((user) => {
            // Calculate the current local time for this user's timezone using Luxon
            const localTime = currentTime.setZone(user.timezone);
            const isWorkingHours = localTime.hour >= 9 && localTime.hour <= 17;

            return (
              <div
                key={user.id} // React key for efficient rendering
                className={`flex flex-col justify-between h-full p-4 border-2 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${
                  isWorkingHours
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
                style={{ minWidth: 0 }}
              >
                {/*
                 * --- USER INFO BLOCK ---
                 */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{user.flag}</span>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-800">{user.name}</h2>
                    <p className="text-gray-600 text-sm">{user.location}</p>
                  </div>
                </div>

                {/*
                 * --- TIME & STATUS BLOCK ---
                 */}
                <div className="flex-1 flex flex-col justify-center space-y-1 mb-2">
                  <p className="text-2xl md:text-3xl font-mono font-bold text-blue-600">
                    {localTime.toFormat("HH:mm:ss")}
                  </p>
                  <p className="text-xs text-gray-600">
                    {localTime.toFormat("cccc, MMMM dd")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {localTime.offsetNameShort} • {user.timezone}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-2 h-2 rounded-full ${
                      isWorkingHours ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span className={`text-xs font-medium ${
                      isWorkingHours ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {isWorkingHours ? 'Working Hours (9 AM - 5 PM)' : 'Outside Working Hours'}
                    </span>
                  </div>
                </div>

                {/*
                 * --- REMOVE BUTTON BLOCK ---
                 */}
                {users.length > 1 && (
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="self-end text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded transition-colors duration-200 text-xs mt-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Add New Team Member Form - Collapsible */}
        <details className="mb-6">
          <summary className="cursor-pointer text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors">
            ➕ Add New Team Member
          </summary>
          
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Name input field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
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
                  <option value="Asia/Ho_Chi_Minh">Ho Chi Minh City, Vietnam</option>
                  <option value="Asia/Kolkata">Mumbai, India</option>
                  <option value="Australia/Sydney">Sydney, Australia</option>
                  <option value="Pacific/Auckland">Auckland, New Zealand</option>
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

/**
 * DEPLOYMENT NOTES FOR TEAM:
 * 
 * 🚀 READY TO DEPLOY LANDING PAGE
 * 
 * This is now a fully functional landing page showing your team's real-time timezones!
 * 
 * PRE-LOADED TEAM MEMBERS:
 * - Jorge (Florida, USA) - Eastern Time
 * - Phillip (Hanoi, Vietnam) - Vietnam Time  
 * - Kevin (Riga, Latvia) - Latvia Time
 * 
 * DEPLOYMENT OPTIONS:
 * 
 * 1. VERCEL (Recommended - Free & Easy):
 *    - Push to GitHub
 *    - Connect to Vercel
 *    - Auto-deploy on push
 *    - Get: your-app.vercel.app
 * 
 * 2. NETLIFY:
 *    - Drag & drop build folder
 *    - Or connect to GitHub
 *    - Get: your-app.netlify.app
 * 
 * 3. GITHUB PAGES:
 *    - Push to GitHub
 *    - Enable Pages in settings
 *    - Get: username.github.io/repo-name
 * 
 * SETUP STEPS:
 * 
 * 1. Create package.json:
 *    {
 *      "name": "jorge-timezone-board",
 *      "version": "1.0.0",
 *      "scripts": {
 *        "dev": "next dev",
 *        "build": "next build",
 *        "start": "next start"
 *      },
 *      "dependencies": {
 *        "react": "^18.0.0",
 *        "react-dom": "^18.0.0",
 *        "luxon": "^3.4.0",
 *        "next": "^13.0.0"
 *      },
 *      "devDependencies": {
 *        "@types/react": "^18.0.0",
 *        "@types/luxon": "^3.3.0",
 *        "typescript": "^5.0.0",
 *        "tailwindcss": "^3.3.0"
 *      }
 *    }
 * 
 * 2. Install dependencies:
 *    npm install
 * 
 * 3. Setup TailwindCSS:
 *    npx tailwindcss init
 * 
 * 4. Add to tailwind.config.js:
 *    module.exports = {
 *      content: [
 *        "./pages/**/*.{js,ts,jsx,tsx}",
 *        "./components/**/*.{js,ts,jsx,tsx}",
 *      ],
 *      theme: { extend: {} },
 *      plugins: [],
 *    }
 * 
 * 5. Create globals.css:
 *    @tailwind base;
 *    @tailwind components;
 *    @tailwind utilities;
 * 
 * FEATURES INCLUDED:
 * ✅ Real-time clock updates (every second)
 * ✅ Working hours indicator (9 AM - 5 PM)
 * ✅ Professional landing page design
 * ✅ Responsive layout (mobile & desktop)
 * ✅ Pre-loaded team members
 * ✅ Add new team members functionality
 * ✅ Timezone dropdown with popular options
 * ✅ Country flags and location display
 * ✅ Gradient background and modern UI
 * ✅ Collapsible add member form
 * 
 * CUSTOMIZATION OPTIONS:
 * - Change gradient colors in className
 * - Add more team members to INITIAL_TEAM
 * - Modify working hours logic
 * - Add company logo
 * - Change fonts and spacing
 * 
 * DOMAIN SUGGESTIONS:
 * - jorge-team-time.vercel.app
 * - team-timezone-board.netlify.app
 * - jorge-global-team.vercel.app
 * 
 * --
 * Ready to ship! 🚀
 * Coded with ❤️ by Jorge Pimentel
 * August 2025
 */
