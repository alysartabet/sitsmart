import React from "react";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider } from "./ThemeContext";
import { NotificationsProvider } from "./NotificationsContext";
import SplashScreen from "./screens/SplashScreen";
import Onboarding from "./screens/Onboarding";
import ResetPassword from "./screens/ResetPassword";
import Verification from "./screens/Verification";
import Home from "./screens/Home";
import Search from "./screens/Search";
import Calendar from "./screens/Calendar";
import Notifications from "./screens/Notifications";
import Profile from "./screens/Profile";
import Preferences from "./screens/Preferences";
import AcctSettings from "./screens/AcctSettings";
import SSSettings from "./screens/SSSettings";
import FAQ from "./screens/FAQ";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import ChangePassword from "./screens/ChangePassword";
import Room from "./screens/Room";
import Book from "./screens/Book";
import FullCalendar from "./screens/FullCalendar";
import Rating from "./screens/Rating";

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
    <ThemeProvider>
      <NotificationsProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerShown: false, animation: "fade" }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="Verification" component={Verification} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="Calendar" component={Calendar} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Preferences" component={Preferences} />
            <Stack.Screen name="AcctSettings" component={AcctSettings} />
            <Stack.Screen name="SSSettings" component={SSSettings} />
            <Stack.Screen name="FAQ" component={FAQ} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="Room" component={Room} />
            <Stack.Screen name="Book" component={Book} />
            <Stack.Screen name="FullCalendar" component={FullCalendar} />
            <Stack.Screen name="Rating" component={Rating} />
          </Stack.Navigator>
        </NavigationContainer>
      </NotificationsProvider>
    </ThemeProvider>
  );
}
