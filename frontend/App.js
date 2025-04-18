import React from "react";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./screens/SplashScreen";
import Onboarding from "./screens/Onboarding";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Hyperion-Regular": require("./assets/fonts/hyperion/Hyperion-Regular.otf"),
    "Hyperion-Light": require("./assets/fonts/hyperion/Hyperion-Light.otf"),
    "Hyperion-Bold": require("./assets/fonts/hyperion/Hyperion-Bold.otf"),
    "Gilroy-Regular": require("./assets/fonts/gilroy/Gilroy-Regular.ttf"),
    "Gilroy-Light": require("./assets/fonts/gilroy/Gilroy-Light.otf"),
    "Gilroy-ExtraBold": require("./assets/fonts/gilroy/Gilroy-ExtraBold.otf"),
  });

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}