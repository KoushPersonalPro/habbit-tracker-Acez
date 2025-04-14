import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  CheckCircle2,
  Leaf,
  Flame,
  Calendar,
  Camera,
  Medal,
} from "lucide-react";
import { createClient } from "../../supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Grow Your Habits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our habit tracking app helps you build consistent routines with
              visual growth indicators that make progress satisfying and fun.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Flame className="w-6 h-6" />,
                title: "Streak Tracking",
                description: "Watch your streak grow day by day",
              },
              {
                icon: <Leaf className="w-6 h-6" />,
                title: "Visual Growth",
                description: "See your habits grow from seed to tree",
              },
              {
                icon: <Camera className="w-6 h-6" />,
                title: "Photo Verification",
                description: "Verify habits with photo evidence",
              },
              {
                icon: <Medal className="w-6 h-6" />,
                title: "Achievement System",
                description: "Earn rewards for consistency",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-green-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Stages Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Watch Your Habits Grow
          </h2>
          <div className="grid md:grid-cols-5 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-4">🌱</div>
              <div className="font-semibold mb-1">Seed</div>
              <div className="text-green-100 text-sm">Day 1</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-4">🌿</div>
              <div className="font-semibold mb-1">Seedling</div>
              <div className="text-green-100 text-sm">Day 3</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-4">🌵</div>
              <div className="font-semibold mb-1">Plant</div>
              <div className="text-green-100 text-sm">Day 7</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-4">🌳</div>
              <div className="font-semibold mb-1">Growing Tree</div>
              <div className="text-green-100 text-sm">Day 14</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-4">🌲</div>
              <div className="font-semibold mb-1">Mature Tree</div>
              <div className="text-green-100 text-sm">Day 30+</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Experience Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">
                Mobile-First Experience
              </h2>
              <p className="text-gray-600 mb-6">
                Our app is designed for the way you live - on the go. Track your
                habits anywhere with a beautiful, responsive interface that
                works perfectly on any device.
              </p>
              <ul className="space-y-3">
                {[
                  "Touch-optimized interface",
                  "Smooth animations and transitions",
                  "Works offline when you need it",
                  "Syncs across all your devices",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 bg-gray-100 rounded-xl p-4 flex justify-center">
              <div className="w-64 h-[500px] bg-white rounded-3xl shadow-xl border-8 border-gray-800 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-10 bg-gray-800 flex items-center justify-center">
                  <div className="w-20 h-4 bg-gray-700 rounded-full"></div>
                </div>
                <div className="pt-10 px-3 pb-3 h-full bg-gradient-to-b from-green-50 to-white">
                  <div className="bg-white rounded-lg shadow-md p-3 mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Daily Meditation</span>
                      <span className="text-orange-500 font-bold">🔥 7</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: "70%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-center my-4">
                    <div className="text-6xl">🌳</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Growing Your Habits Today
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are building better habits one day at a
            time.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            Start Your Journey
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
