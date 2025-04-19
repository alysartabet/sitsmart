import React from "react";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./screens/SplashScreen";
import Onboarding from "./screens/Onboarding";
import Authentication from "./screens/Authentication";
import ResetPassword from "./screens/ResetPassword";
import Verification from "./screens/Verification";
import Home from "./screens/Home";
import Search from "./screens/Search";
import Calendar from "./screens/Calendar";
import Notifications from "./screens/Notifications";

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
  
  //return <Authentication/>;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: "fade", }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Authentication" component={Authentication} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="Verification" component={Verification} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Calendar" component={Calendar} />
        <Stack.Screen name="Notifications" component={Notifications} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}