import 'react-native-reanimated';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import InsightsScreen from "./src/screens/InsightsScreen";

export type RootStackParamList = {
  Home: undefined;
  Insights: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Expense Peek",
            headerStyle: { backgroundColor: "#125005ff" },
            headerTitleStyle: { color: "#fff", fontWeight: "800" },
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="Insights"
          component={InsightsScreen}
          options={{
            title: "Insights",
            headerStyle: { backgroundColor: "#3d2478" }, // cool blue tint
            headerTitleStyle: { color: "#fff", fontWeight: "800" },
            headerTintColor: "#fff",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
