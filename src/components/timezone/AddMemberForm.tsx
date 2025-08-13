"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { Session } from "next-auth";
import { useState } from "react";

interface TeamMember {
  id: number;
  name: string;
  location: string;
  timezone: string;
  flag: string;
  created_by_email?: string;
}

interface AddMemberFormProps {
  session: Session | null;
  members: TeamMember[];
  loading: boolean;
}

export function AddMemberForm({
  session,
  members,
  loading,
}: AddMemberFormProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [timezone, setTimezone] = useState("America/New_York");
  const { addMember } = useTeamMembers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !location.trim()) {
      alert("Please fill in all fields");
      return;
    }

    // Check if user has permission to add more members (unless admin)
    if (session?.user?.role !== "admin") {
      const userMembers = members.filter(
        (member) => member.created_by_email === session?.user?.email
      );
      if (userMembers.length >= 1) {
        alert(
          "You can only create 1 team member. Please delete your existing member first if you want to add a new one."
        );
        return;
      }
    }

    const success = await addMember({
      name,
      location,
      timezone,
      flag: "🌍",
    });

    if (success) {
      setName("");
      setLocation("");
      setTimezone("America/New_York");
    }
  };

  return (
    <Card className="relative overflow-hidden shadow-2xl border-2 border-neutral-200 bg-gradient-to-br from-white via-neutral-50 to-slate-50 hover:shadow-3xl transition-all duration-500">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-600 via-transparent to-neutral-600 transform -skew-y-3"></div>
      </div>

      <CardHeader className="pb-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 shadow-lg">
              <span className="text-2xl">➕</span>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-neutral-800 to-neutral-600 bg-clip-text text-transparent">
                Add New Team Member
              </CardTitle>
              <p className="text-neutral-600 text-sm mt-1 font-medium">
                Expand your global team collaboration
              </p>
            </div>
          </div>

          {/* User quota indicator */}
          {session?.user?.role !== "admin" && (
            <div className="text-right">
              <p className="text-xs text-neutral-500 font-medium">Your quota</p>
              <p className="text-lg font-bold text-neutral-700">
                {
                  members.filter(
                    (member) => member.created_by_email === session?.user?.email
                  ).length
                }
                /1
              </p>
              {members.filter(
                (member) => member.created_by_email === session?.user?.email
              ).length >= 1 && (
                <p className="text-xs text-red-500 font-medium">
                  Quota reached
                </p>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Form fields organized in responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Name field */}
            <div className="group relative">
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-neutral-700 mb-2 block group-focus-within:text-neutral-900 transition-colors"
              >
                Team Member Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                required
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg shadow-sm focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 transition-all duration-300 bg-white group-hover:border-neutral-300"
              />
            </div>

            {/* Location field */}
            <div className="group relative">
              <Label
                htmlFor="location"
                className="text-sm font-semibold text-neutral-700 mb-2 block group-focus-within:text-neutral-900 transition-colors"
              >
                Location
              </Label>
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                required
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg shadow-sm focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 transition-all duration-300 bg-white group-hover:border-neutral-300"
              />
            </div>
          </div>

          {/* Timezone field - full width */}
          <div className="group relative">
            <Label
              htmlFor="timezone"
              className="text-sm font-semibold text-neutral-700 mb-2 block group-focus-within:text-neutral-900 transition-colors"
            >
              Time Zone
            </Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger className="w-full px-4 py-3 border-2 border-neutral-200 rounded-lg shadow-sm focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 transition-all duration-300 bg-white group-hover:border-neutral-300">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {/* North America */}
                <SelectGroup>
                  <SelectLabel className="font-semibold text-neutral-800 px-2 py-1 bg-neutral-50">
                    🌎 North America
                  </SelectLabel>
                  <SelectItem value="America/New_York">
                    Eastern Time (ET)
                  </SelectItem>
                  <SelectItem value="America/Chicago">
                    Central Time (CT)
                  </SelectItem>
                  <SelectItem value="America/Denver">
                    Mountain Time (MT)
                  </SelectItem>
                  <SelectItem value="America/Los_Angeles">
                    Pacific Time (PT)
                  </SelectItem>
                  <SelectItem value="America/Anchorage">
                    Alaska Time (AKT)
                  </SelectItem>
                  <SelectItem value="Pacific/Honolulu">
                    Hawaii Time (HST)
                  </SelectItem>
                  <SelectItem value="America/Toronto">
                    Toronto, Canada
                  </SelectItem>
                  <SelectItem value="America/Vancouver">
                    Vancouver, Canada
                  </SelectItem>
                  <SelectItem value="America/Montreal">
                    Montreal, Canada
                  </SelectItem>
                </SelectGroup>

                {/* South America */}
                <SelectGroup>
                  <SelectLabel className="font-semibold text-neutral-800 px-2 py-1 bg-neutral-50">
                    🌎 South America
                  </SelectLabel>
                  <SelectItem value="America/Mexico_City">
                    Mexico City, Mexico
                  </SelectItem>
                  <SelectItem value="America/Guatemala">
                    Guatemala City, Guatemala
                  </SelectItem>
                  <SelectItem value="America/Bogota">
                    Bogotá, Colombia
                  </SelectItem>
                  <SelectItem value="America/Lima">Lima, Peru</SelectItem>
                  <SelectItem value="America/Santiago">
                    Santiago, Chile
                  </SelectItem>
                  <SelectItem value="America/Buenos_Aires">
                    Buenos Aires, Argentina
                  </SelectItem>
                  <SelectItem value="America/Sao_Paulo">
                    São Paulo, Brazil
                  </SelectItem>
                  <SelectItem value="America/Caracas">
                    Caracas, Venezuela
                  </SelectItem>
                  <SelectItem value="America/Panama">
                    Panama City, Panama
                  </SelectItem>
                </SelectGroup>

                {/* Europe */}
                <SelectGroup>
                  <SelectLabel className="font-semibold text-neutral-800 px-2 py-1 bg-neutral-50">
                    🌍 Europe
                  </SelectLabel>
                  <SelectItem value="Europe/London">London, UK</SelectItem>
                  <SelectItem value="Europe/Dublin">Dublin, Ireland</SelectItem>
                  <SelectItem value="Europe/Paris">Paris, France</SelectItem>
                  <SelectItem value="Europe/Berlin">Berlin, Germany</SelectItem>
                  <SelectItem value="Europe/Rome">Rome, Italy</SelectItem>
                  <SelectItem value="Europe/Madrid">Madrid, Spain</SelectItem>
                  <SelectItem value="Europe/Amsterdam">
                    Amsterdam, Netherlands
                  </SelectItem>
                  <SelectItem value="Europe/Brussels">
                    Brussels, Belgium
                  </SelectItem>
                  <SelectItem value="Europe/Zurich">
                    Zurich, Switzerland
                  </SelectItem>
                  <SelectItem value="Europe/Vienna">Vienna, Austria</SelectItem>
                  <SelectItem value="Europe/Prague">
                    Prague, Czech Republic
                  </SelectItem>
                  <SelectItem value="Europe/Warsaw">Warsaw, Poland</SelectItem>
                  <SelectItem value="Europe/Budapest">
                    Budapest, Hungary
                  </SelectItem>
                  <SelectItem value="Europe/Bucharest">
                    Bucharest, Romania
                  </SelectItem>
                  <SelectItem value="Europe/Athens">Athens, Greece</SelectItem>
                  <SelectItem value="Europe/Stockholm">
                    Stockholm, Sweden
                  </SelectItem>
                  <SelectItem value="Europe/Oslo">Oslo, Norway</SelectItem>
                  <SelectItem value="Europe/Copenhagen">
                    Copenhagen, Denmark
                  </SelectItem>
                  <SelectItem value="Europe/Helsinki">
                    Helsinki, Finland
                  </SelectItem>
                  <SelectItem value="Europe/Riga">Riga, Latvia</SelectItem>
                  <SelectItem value="Europe/Tallinn">
                    Tallinn, Estonia
                  </SelectItem>
                  <SelectItem value="Europe/Vilnius">
                    Vilnius, Lithuania
                  </SelectItem>
                  <SelectItem value="Europe/Kiev">Kiev, Ukraine</SelectItem>
                  <SelectItem value="Europe/Moscow">Moscow, Russia</SelectItem>
                  <SelectItem value="Europe/Istanbul">
                    Istanbul, Turkey
                  </SelectItem>
                </SelectGroup>

                {/* Africa */}
                <SelectGroup>
                  <SelectLabel className="font-semibold text-neutral-800 px-2 py-1 bg-neutral-50">
                    🌍 Africa
                  </SelectLabel>
                  <SelectItem value="Africa/Cairo">Cairo, Egypt</SelectItem>
                  <SelectItem value="Africa/Lagos">Lagos, Nigeria</SelectItem>
                  <SelectItem value="Africa/Nairobi">Nairobi, Kenya</SelectItem>
                  <SelectItem value="Africa/Johannesburg">
                    Johannesburg, South Africa
                  </SelectItem>
                  <SelectItem value="Africa/Casablanca">
                    Casablanca, Morocco
                  </SelectItem>
                  <SelectItem value="Africa/Tunis">Tunis, Tunisia</SelectItem>
                  <SelectItem value="Africa/Algiers">
                    Algiers, Algeria
                  </SelectItem>
                  <SelectItem value="Africa/Accra">Accra, Ghana</SelectItem>
                  <SelectItem value="Africa/Addis_Ababa">
                    Addis Ababa, Ethiopia
                  </SelectItem>
                </SelectGroup>

                {/* Asia */}
                <SelectGroup>
                  <SelectLabel className="font-semibold text-neutral-800 px-2 py-1 bg-neutral-50">
                    🌏 Asia
                  </SelectLabel>
                  <SelectItem value="Asia/Tokyo">Tokyo, Japan</SelectItem>
                  <SelectItem value="Asia/Seoul">Seoul, South Korea</SelectItem>
                  <SelectItem value="Asia/Shanghai">Shanghai, China</SelectItem>
                  <SelectItem value="Asia/Beijing">Beijing, China</SelectItem>
                  <SelectItem value="Asia/Hong_Kong">Hong Kong</SelectItem>
                  <SelectItem value="Asia/Taipei">Taipei, Taiwan</SelectItem>
                  <SelectItem value="Asia/Singapore">Singapore</SelectItem>
                  <SelectItem value="Asia/Bangkok">
                    Bangkok, Thailand
                  </SelectItem>
                  <SelectItem value="Asia/Ho_Chi_Minh">
                    Ho Chi Minh City, Vietnam
                  </SelectItem>
                  <SelectItem value="Asia/Jakarta">
                    Jakarta, Indonesia
                  </SelectItem>
                  <SelectItem value="Asia/Manila">
                    Manila, Philippines
                  </SelectItem>
                  <SelectItem value="Asia/Kuala_Lumpur">
                    Kuala Lumpur, Malaysia
                  </SelectItem>
                  <SelectItem value="Asia/Kolkata">Mumbai, India</SelectItem>
                  <SelectItem value="Asia/Delhi">Delhi, India</SelectItem>
                  <SelectItem value="Asia/Dhaka">Dhaka, Bangladesh</SelectItem>
                  <SelectItem value="Asia/Karachi">
                    Karachi, Pakistan
                  </SelectItem>
                  <SelectItem value="Asia/Kabul">Kabul, Afghanistan</SelectItem>
                  <SelectItem value="Asia/Tehran">Tehran, Iran</SelectItem>
                  <SelectItem value="Asia/Dubai">Dubai, UAE</SelectItem>
                  <SelectItem value="Asia/Riyadh">
                    Riyadh, Saudi Arabia
                  </SelectItem>
                  <SelectItem value="Asia/Kuwait">
                    Kuwait City, Kuwait
                  </SelectItem>
                  <SelectItem value="Asia/Baghdad">Baghdad, Iraq</SelectItem>
                  <SelectItem value="Asia/Jerusalem">
                    Jerusalem, Israel
                  </SelectItem>
                  <SelectItem value="Asia/Beirut">Beirut, Lebanon</SelectItem>
                  <SelectItem value="Asia/Damascus">Damascus, Syria</SelectItem>
                  <SelectItem value="Asia/Amman">Amman, Jordan</SelectItem>
                  <SelectItem value="Asia/Baku">Baku, Azerbaijan</SelectItem>
                  <SelectItem value="Asia/Yerevan">Yerevan, Armenia</SelectItem>
                  <SelectItem value="Asia/Tbilisi">Tbilisi, Georgia</SelectItem>
                  <SelectItem value="Asia/Almaty">
                    Almaty, Kazakhstan
                  </SelectItem>
                  <SelectItem value="Asia/Tashkent">
                    Tashkent, Uzbekistan
                  </SelectItem>
                  <SelectItem value="Asia/Novosibirsk">
                    Novosibirsk, Russia
                  </SelectItem>
                  <SelectItem value="Asia/Vladivostok">
                    Vladivostok, Russia
                  </SelectItem>
                </SelectGroup>

                {/* Australia & Oceania */}
                <SelectGroup>
                  <SelectLabel className="font-semibold text-neutral-800 px-2 py-1 bg-neutral-50">
                    🌏 Australia & Oceania
                  </SelectLabel>
                  <SelectItem value="Australia/Sydney">
                    Sydney, Australia
                  </SelectItem>
                  <SelectItem value="Australia/Melbourne">
                    Melbourne, Australia
                  </SelectItem>
                  <SelectItem value="Australia/Brisbane">
                    Brisbane, Australia
                  </SelectItem>
                  <SelectItem value="Australia/Perth">
                    Perth, Australia
                  </SelectItem>
                  <SelectItem value="Australia/Adelaide">
                    Adelaide, Australia
                  </SelectItem>
                  <SelectItem value="Australia/Darwin">
                    Darwin, Australia
                  </SelectItem>
                  <SelectItem value="Pacific/Auckland">
                    Auckland, New Zealand
                  </SelectItem>
                  <SelectItem value="Pacific/Wellington">
                    Wellington, New Zealand
                  </SelectItem>
                  <SelectItem value="Pacific/Fiji">Suva, Fiji</SelectItem>
                  <SelectItem value="Pacific/Guam">Guam</SelectItem>
                </SelectGroup>

                {/* Atlantic */}
                <SelectGroup>
                  <SelectLabel className="font-semibold text-neutral-800 px-2 py-1 bg-neutral-50">
                    🌊 Atlantic
                  </SelectLabel>
                  <SelectItem value="Atlantic/Reykjavik">
                    Reykjavik, Iceland
                  </SelectItem>
                  <SelectItem value="Atlantic/Azores">
                    Azores, Portugal
                  </SelectItem>
                  <SelectItem value="Atlantic/Cape_Verde">
                    Cape Verde
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Submit button */}
          <div className="pt-8 flex justify-center">
            <Button
              type="submit"
              disabled={
                loading ||
                (session?.user?.role !== "admin" &&
                  members.filter(
                    (member) => member.created_by_email === session?.user?.email
                  ).length >= 1)
              }
              className="group relative overflow-hidden bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-neutral-700 hover:to-neutral-600 text-white font-bold px-12 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

              <span className="relative z-10 flex items-center gap-3 text-lg">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : session?.user?.role !== "admin" &&
                  members.filter(
                    (member) => member.created_by_email === session?.user?.email
                  ).length >= 1 ? (
                  <>
                    <span className="text-xl">🚫</span>
                    Quota Reached (1/1)
                  </>
                ) : (
                  <>
                    <span className="text-xl">✅</span>
                    Add Team Member
                  </>
                )}
              </span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
