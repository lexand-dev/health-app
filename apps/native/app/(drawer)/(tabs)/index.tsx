import React, { useState, useEffect } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Container } from "@/components/container";
import { Button, Pressable, Text, View } from "react-native";

// --- Types & Data ---

const ONBOARDING_DATA = [
  {
    id: "1",
    title: "Find Trusted Specialists",
    description:
      "Connect with top-rated doctors and specialists in your area instantly. Filter by specialty, ratings, and availability.",
    icon: <Ionicons name="medical" size={64} color="white" />,
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-500"
  },
  {
    id: "2",
    title: "Schedule with Ease",
    description:
      "Book appointments online without the hassle of phone calls. Manage your calendar and get automated reminders.",
    icon: <Ionicons name="calendar" size={64} color="white" />,
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-500"
  },
  {
    id: "3",
    title: "Secure Health Records",
    description:
      "Keep your medical history, prescriptions, and lab results safe and accessible in one encrypted dashboard.",
    icon: <Ionicons name="shield-checkmark" size={64} color="white" />,
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-500"
  }
];

type OnboardingItemType = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  lightColor: string;
  textColor: string;
};

// --- Main Component ---

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    setCurrentIndex(ONBOARDING_DATA.length - 1);
  };

  const completeOnboarding = () => {
    // In a real app, you would save this to AsyncStorage
    // await AsyncStorage.setItem('@viewedOnboarding', 'true');
    setCompleted(true);
  };

  const handleReset = () => {
    setCompleted(false);
    setCurrentIndex(0);
  };

  if (completed) {
    return (
      <View className="flex justify-center items-center min-h-screen bg-slate-200 font-sans px-2">
        <HomeScreen onLogout={handleReset} />
        {/* Dynamic Island Mockup */}
      </View>
    );
  }

  return (
    <Container className="pt-0">
      <View className="flex justify-center items-center min-h-screen bg-slate-200 font-sans px-4">
        {/* Header Actions */}
        <View className="absolute top-12 right-6 z-20">
          {currentIndex < ONBOARDING_DATA.length - 1 && (
            <Pressable
              onPress={handleSkip}
              className="text-slate-400 font-semibold text-sm hover:text-slate-600 transition-colors"
            >
              Skip
            </Pressable>
          )}
        </View>

        {/* Content Area (Simulating FlatList) */}
        <View className="flex-1 flex flex-col relative pb-4">
          <View className="flex-1 flex items-center justify-center">
            <OnboardingItem item={ONBOARDING_DATA[currentIndex]} />
          </View>

          {/* Paginator */}
          <View className="mb-8">
            <Paginator data={ONBOARDING_DATA} scrollX={currentIndex} />
          </View>

          {/* Main Action Button */}
          <Pressable
            onPress={handleNext}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-lg transition-all duration-300 shadow-xl shadow-blue-200 ${
              currentIndex === ONBOARDING_DATA.length - 1
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {currentIndex === ONBOARDING_DATA.length - 1 ? (
              <>Get Started</>
            ) : (
              <>Next</>
            )}
          </Pressable>
        </View>
      </View>
    </Container>
  );
}

/**
 * Paginator: The dots at the bottom indicating current page
 */
const Paginator = ({
  data,
  scrollX
}: {
  data: OnboardingItemType[];
  scrollX: number;
}) => {
  return (
    <View className="flex flex-row h-16 justify-center items-center gap-2">
      {data.map((_, i) => {
        // In React Native with Reanimated, you would interpolate these values
        const isActive = i === scrollX;
        return (
          <View
            key={i.toString()}
            className={`h-2 rounded-full transition-all duration-300 ease-in-out ${
              isActive ? "w-8 bg-slate-800" : "w-2 bg-slate-300"
            }`}
          />
        );
      })}
    </View>
  );
};

/**
 * OnboardingItem: Individual Slide Component
 */
const OnboardingItem = ({ item }: { item: OnboardingItemType }) => {
  return (
    <View className="w-full shrink-0 flex flex-col items-center justify-center px-8 text-center pb-8 pt-12">
      {/* Image Container - Using a soft circle background */}
      <View
        className={`mb-10 p-12 rounded-full ${item.lightColor} shadow-sm animate-fade-in-up`}
      >
        <View
          className={`p-6 rounded-3xl ${item.color} shadow-lg shadow-blue-500/20`}
        >
          {item.icon}
        </View>
      </View>

      {/* Text Content */}
      <View className="space-y-4 max-w-xs">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          {item.title}
        </h2>
        <p className="text-slate-500 leading-relaxed font-medium">
          {item.description}
        </p>
      </View>
    </View>
  );
};

// --- Main Screens ---

const HomeScreen = ({ onLogout }: { onLogout: () => void }) => (
  <View className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
    <View className="bg-blue-600 h-48 rounded-b-[40px] px-6 pt-12 pb-6 flex flex-col justify-between shadow-lg relative z-10">
      <View className="flex justify-between items-center text-white">
        <View>
          <p className="opacity-80 text-sm font-medium">Good Morning,</p>
          <h1 className="text-2xl font-bold">Alex Johnson</h1>
        </View>
        <View className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
          <Ionicons name="pulse" size={24} color="white" />
        </View>
      </View>
    </View>

    <View className="px-6 -mt-8 relative z-20">
      <View className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center space-y-4">
        <h3 className="font-bold text-slate-800 text-lg">
          Welcome to MedicApp
        </h3>
        <p className="text-center text-slate-500 text-sm">
          You have successfully completed the onboarding.
        </p>
        <button
          onClick={onLogout}
          className="w-full py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl mt-4 hover:bg-slate-200 transition-colors"
        >
          Reset Demo
        </button>
      </View>
    </View>
  </View>
);
