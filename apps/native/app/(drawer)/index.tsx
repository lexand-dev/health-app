import { Text, View } from "react-native";
import { Container } from "@/components/container";
import { Link } from "expo-router";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useQuery
} from "convex/react";
import { api } from "@health-app/backend/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { SignOutButton } from "@/components/sign-out-button";
import { Ionicons } from "@expo/vector-icons";
import { Card, Chip, useThemeColor } from "heroui-native";

export default function Home() {
  const { user } = useUser();
  const healthCheck = useQuery(api.healthCheck.get);
  const privateData = useQuery(api.privateData.get);
  const mutedColor = useThemeColor("muted");
  const successColor = useThemeColor("success");
  const dangerColor = useThemeColor("danger");

  const isConnected = healthCheck === "OK";
  const isLoading = healthCheck === undefined;

  return (
    <Container className="p-6">
      <View className="py-4 mb-6">
        <Text className="text-4xl font-bold text-foreground mb-2">
          HealthApp
        </Text>
      </View>

      <Card variant="secondary" className="p-6">
        <View className="flex-row items-center justify-between mb-4">
          <Card.Title>System Status</Card.Title>
          <Chip
            variant="secondary"
            color={isConnected ? "success" : "danger"}
            size="sm"
          >
            <Chip.Label>{isConnected ? "LIVE" : "OFFLINE"}</Chip.Label>
          </Chip>
        </View>
        <Card className="p-4">
          <View className="flex-row items-center">
            <View
              className={`w-3 h-3 rounded-full mr-3 ${
                isConnected ? "bg-success" : "bg-muted"
              }`}
            />
            <View className="flex-1">
              <Text className="text-foreground font-medium mb-1">
                Convex Backend
              </Text>
              <Card.Description>
                {isLoading
                  ? "Checking connection..."
                  : isConnected
                  ? "Connected to API"
                  : "API Disconnected"}
              </Card.Description>
            </View>
            {isLoading && (
              <Ionicons name="hourglass-outline" size={20} color={mutedColor} />
            )}
            {!isLoading && isConnected && (
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={successColor}
              />
            )}
            {!isLoading && !isConnected && (
              <Ionicons name="close-circle" size={20} color={dangerColor} />
            )}
          </View>
        </Card>
      </Card>

      <Authenticated>
        <Card variant="secondary" className="mt-6 p-4">
          <Text className="text-foreground text-base mb-2">
            Hello {user?.emailAddresses[0].emailAddress}
          </Text>
          <Text className="text-muted text-sm mb-4">
            Private Data: {privateData?.message}
          </Text>
          <SignOutButton />
        </Card>
      </Authenticated>
      <Unauthenticated>
        <View className="mt-6 gap-4">
          <Link href="/(auth)/sign-in" asChild>
            <Text className="text-primary font-semibold">Sign in</Text>
          </Link>
          <Link href="/(auth)/sign-up" asChild>
            <Text className="text-primary font-semibold">Sign up</Text>
          </Link>
        </View>
      </Unauthenticated>
      <AuthLoading>
        <Text className="text-muted">Loading...</Text>
      </AuthLoading>
    </Container>
  );
}
