"use client";
import { createClient } from "@/utils/supabase/client";
import { TopProfileDetails } from "@/components/dashboard/topnav";
import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { usePathname } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface ProgressData {
  percentage: number;
  label: string;
}

interface ChartData {
  day: string;
  quizzes: number;
  lessons: number;
}

export default function Home() {
  const supabase = createClient();
  const [username, setUsernameState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUsername = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("username")
          .eq("id", user.id)
          .single();
        if (error) {
          console.error("Error fetching username:", error);
        } else {
          setUsernameState(data?.username || null);
        }
      }
      setIsLoading(false);
    };
    fetchUsername();
  }, []);
  const [sidebarWidth, setSidebarWidth] = useState(245);

  const handleSidebarWidthChange = (width: number) => {
    setSidebarWidth(width);
  };

  const [progressData, setProgressData] = useState<ProgressData>({
    percentage: 0,
    label: "Quiz Performance",
  });

  useEffect(() => {
    const fetchProgressData = () => {
      const mockData: ProgressData = {
        percentage: 75,
        label: "Quiz Performance",
      };
      setProgressData(mockData);
    };

    fetchProgressData();
  }, []);

  const calculateStrokeDashoffset = (percentage: number): number => {
    const circumference = 2 * Math.PI * 40;
    const dashArray = 0.75 * circumference;
    return dashArray - (dashArray * percentage) / 100;
  };

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [dailyAverage, setDailyAverage] = useState<string>("");

  useEffect(() => {
    const mockData: ChartData[] = [
      { day: "S", quizzes: 200, lessons: 90 },
      { day: "M", quizzes: 75, lessons: 120 },
      { day: "T", quizzes: 90, lessons: 105 },
      { day: "W", quizzes: 120, lessons: 250 },
      { day: "T", quizzes: 105, lessons: 135 },
      { day: "F", quizzes: 135, lessons: 165 },
      { day: "Today", quizzes: 150, lessons: 180 },
    ];

    setChartData(mockData);

    const totalTime = mockData.reduce(
      (acc, day) => acc + day.quizzes + day.lessons,
      0,
    );
    const averageMinutes = Math.round(totalTime / mockData.length);
    const hours = Math.floor(averageMinutes / 60);
    const minutes = averageMinutes % 60;
    setDailyAverage(`${hours}h ${minutes}m`);
  }, []);

  const totalQuizTime = chartData.reduce((acc, day) => acc + day.quizzes, 0);
  const totalLessonTime = chartData.reduce((acc, day) => acc + day.lessons, 0);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        currentRoute={pathname}
        onWidthChange={handleSidebarWidthChange}
      />
      <main
        className="flex-1 px-8 py-10"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <div className="mx-auto ">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">
                Hey,{" "}
                <span className="text-brand-primary">
                  {username || "User"}!
                </span>
              </h1>
              <h3 className="text-sm text-gray-500">
                What's good my fellow financial freedom seeker!
              </h3>
            </div>
            <TopProfileDetails username={username} />
          </div>
          {/* Progress Section */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-semibold">My Progress</h1>
            <h3 className="mb-4 text-sm text-gray-500">
              An overview of your overall progress
            </h3>
            <div className="w-full rounded-lg bg-surface-base p-6">
              <div className="grid h-[350px] grid-cols-8 grid-rows-2 gap-6">
                <div className="col-span-2 flex flex-col justify-between rounded-lg bg-white p-6 shadow">
                  <h4 className="text-7xl font-medium text-brand-primary">3</h4>
                  <p className="text-sm font-medium text-neutral-700">
                    Lessons in Progress
                  </p>
                </div>
                <div className="col-span-2 col-start-1 row-start-2 flex flex-col justify-between rounded-lg bg-white p-6 shadow">
                  <h4 className="text-7xl font-medium text-brand-primary">4</h4>
                  <p className="text-sm font-medium text-neutral-700">
                    Lessons Completed
                  </p>
                </div>
                <div className="col-span-4 col-start-3 row-span-2 row-start-1 flex flex-col justify-between rounded-lg bg-white p-6 shadow">
                  <div>
                    <p className="text-sm font-medium text-neutral-300">
                      Daily Average
                    </p>
                    <h4 className="mb-2 text-2xl font-semibold">
                      {dailyAverage}
                    </h4>
                  </div>

                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 50, left: 50, bottom: 20 }}
                      barGap={0}
                    >
                      <XAxis dataKey="day" axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(value: number) => {
                          const hours = Math.floor(value / 60);
                          const minutes = value % 60;
                          return [
                            `${hours > 0 ? `${hours}hr ` : ""}${minutes}min`,
                            "",
                          ];
                        }}
                        labelFormatter={(label) => label.replace(/^:/, "")}
                        labelStyle={{ color: "#666" }}
                      />
                      <Legend
                        align="left"
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{ paddingTop: "20px" }}
                        formatter={(value: string, entry: any) => {
                          const total =
                            value === "quizzes"
                              ? totalQuizTime
                              : totalLessonTime;
                          return (
                            <span className="pl-2 text-black">
                              {`${value.charAt(0).toUpperCase() + value.slice(1)} `}
                              <strong>{formatTime(total)}</strong>
                            </span>
                          );
                        }}
                        iconType="square"
                      />
                      <Bar dataKey="quizzes" fill="#583AFE" radius={5} />
                      <Bar dataKey="lessons" fill="#A99AFF" radius={5} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="col-span-2 col-start-7 row-span-2 row-start-1 flex flex-col justify-between rounded-lg bg-white p-6 shadow">
                  <h4 className="mb-4 text-center text-lg font-semibold">
                    {progressData.label}
                  </h4>
                  <div className="relative mx-auto h-full w-full max-w-xs max-h-xs">
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        className="text-gray-200"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        strokeDasharray="188.5 251.3"
                        strokeLinecap="round"
                        transform="rotate(-226 50 50)"
                      />
                      {/* Progress circle */}
                      <circle
                        className="text-brand-primary"
                        strokeWidth="12"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        strokeDasharray="188.5 251.3"
                        strokeDashoffset={calculateStrokeDashoffset(
                          progressData.percentage,
                        )}
                        strokeLinecap="round"
                        transform="rotate(-225 50 50)"
                      />
                    </svg>
                    <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center text-center">
                      <span className="text-3xl font-bold text-gray-700">
                        {progressData.percentage}%
                      </span>
                      Accurate
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End of Progress Section */}
          {/* Lessons and Activity History */}
          <div className="mt-8 flex gap-x-10">
            {/* Lessons Section */}
            <div className="flex-1">
              <div className="mb-4 flex flex-row items-center gap-x-4">
                <h2 className="text-4xl font-semibold">My lessons</h2>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary">
                  <span className="text-sm font-medium text-white">3</span>
                </div>
              </div>
              <div className="">
                {/* Placeholder for Lessons content */}
                <p className="text-gray-500">
                  Under Construction ... Coming Soon!
                </p>
              </div>
            </div>

            {/* Activity History Section */}
            <div className="flex-1">
              <div className="mb-4 flex flex-row items-center justify-between">
                <h2 className=" text-4xl font-semibold">Activity History</h2>
                <a className="cursor-pointer text-sm font-medium text-brand-primary transition duration-300 hover:opacity-70">
                  View all
                </a>
              </div>
              <div className="">
                {/* Placeholder for Activity History content */}
                <p className="text-gray-500">
                  Under Construction ... Coming Soon!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
