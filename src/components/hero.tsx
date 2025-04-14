import Link from "next/link";
import { ArrowUpRight, Check, Leaf, Flame } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-yellow-50 opacity-70" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              Grow{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Habits
              </span>{" "}
              with Visual Progress
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Track your daily habits and watch them grow from seed to tree. Our
              gamified approach makes building consistent routines fun and
              rewarding.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
              >
                Start Tracking
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="/sign-up"
                className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
              >
                Create Account
              </Link>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span>Track daily streaks</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-500" />
                <span>Watch your habits grow</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-blue-500" />
                <span>Mobile-optimized experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
