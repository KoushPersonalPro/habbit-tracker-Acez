"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar as CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  verification_type: string;
  verification_data?: string;
  verification_image_url?: string;
  note?: string;
}

export interface HabitDetailCalendarProps {
  habit: {
    id: string;
    name: string;
    description?: string;
    current_streak: number;
    longest_streak: number;
    growth_stage: number;
    last_completed_at?: string;
  };
  logs: HabitLog[];
}

export default function HabitDetailCalendar({
  habit,
  logs = [],
}: HabitDetailCalendarProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [selectedLog, setSelectedLog] = useState<HabitLog | null>(null);

  // Create a map of dates to logs for easy lookup
  const logsByDate = logs.reduce(
    (acc, log) => {
      const date = new Date(log.completed_at).toDateString();
      acc[date] = log;
      return acc;
    },
    {} as Record<string, HabitLog>,
  );

  // Function to check if a date has a log
  const hasLogForDate = (date: Date) => {
    return logsByDate[date.toDateString()] !== undefined;
  };

  // Function to handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    setSelectedDate(date);
    const log = logsByDate[date.toDateString()];
    setSelectedLog(log || null);
  };

  // Function to format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 bg-background">
      <div className="flex items-center mb-4 sm:mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mr-2 -ml-3"
        >
          <ChevronLeft size={18} />
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold truncate">
          {habit.name} Calendar
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="w-full lg:col-span-2 shadow-sm">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <CalendarIcon size={18} className="text-primary" />
              <span>Completion Calendar</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center sm:justify-start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border max-w-full overflow-x-auto"
                modifiers={{
                  completed: (date) => hasLogForDate(date),
                }}
                modifiersClassNames={{
                  completed: "bg-green-100 text-green-800 font-bold",
                }}
                classNames={{
                  day_today: "bg-primary/10 text-primary font-medium",
                  day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  nav_button:
                    "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100",
                  caption:
                    "flex justify-center py-2 relative items-center text-sm sm:text-base",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex justify-between",
                  head_cell:
                    "text-muted-foreground rounded-md w-8 sm:w-9 font-normal text-xs sm:text-sm",
                  row: "flex w-full mt-2",
                  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-8 w-8 sm:h-9 sm:w-9 p-0 font-normal aria-selected:opacity-100 rounded-md",
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="w-full shadow-sm">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">
              Daily Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedLog ? (
              <div className="space-y-3 sm:space-y-4">
                <p className="font-medium text-sm sm:text-base">
                  {formatDate(selectedLog.completed_at)}
                </p>

                <div className="flex flex-col gap-2 sm:gap-3">
                  <p className="text-xs sm:text-sm font-medium">
                    Verification:
                  </p>
                  {selectedLog.verification_type === "photo" &&
                  selectedLog.verification_image_url ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="relative h-32 sm:h-40 w-full overflow-hidden rounded-md cursor-pointer hover:opacity-90 transition-opacity border border-muted">
                          <img
                            src={selectedLog.verification_image_url}
                            alt="Verification"
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                            Click to enlarge
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md max-w-[90vw] p-1 sm:p-6">
                        <div className="aspect-video overflow-hidden rounded-md">
                          <img
                            src={selectedLog.verification_image_url}
                            alt="Verification"
                            className="object-contain w-full h-full"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : selectedLog.verification_type === "text" &&
                    selectedLog.verification_data ? (
                    <div className="bg-muted p-2 sm:p-3 rounded-md">
                      <p className="text-xs sm:text-sm font-medium">
                        Text Verification:
                      </p>
                      <p className="text-xs sm:text-sm">
                        {selectedLog.verification_data}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-muted p-2 sm:p-3 rounded-md">
                      <p className="text-xs sm:text-sm">
                        No verification provided
                      </p>
                    </div>
                  )}
                </div>

                {selectedLog.note && (
                  <div className="bg-muted p-2 sm:p-3 rounded-md">
                    <p className="text-xs sm:text-sm font-medium">Note:</p>
                    <p className="text-xs sm:text-sm">{selectedLog.note}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 text-muted-foreground">
                <p className="text-sm">Select a date to view details</p>
                <p className="text-xs sm:text-sm mt-2">
                  Dates with completed habits are highlighted in green
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
