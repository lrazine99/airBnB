import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./containers/HomeScreen";
import RoomScreen from "./containers/RoomScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import ProfileScreen from "./containers/ProfileScreen";
import SplashScreen from "./containers/SplashScreen";
import AroundMe from "./containers/AroundMe";

import HeaderLogo from "./components/HeaderLogo";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const setToken = async (token, id) => {
    if (token && id) {
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userId", id);
    } else {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userId");
    }

    setUserToken(token);
    setUserId(id);
  };

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      // We should also handle error for production apps
      const userToken = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setUserToken(userToken);
      setUserId(userId);

      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading === true) {
    // We haven't finished checking for the token yet
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken === null ? (
          // No token found, user isn't signed in
          <>
            <Stack.Screen
              name="SignIn"
              options={{
                headerShown: false,
              }}
            >
              {() => <SignInScreen setToken={setToken} />}
            </Stack.Screen>
            <Stack.Screen
              name="SignUp"
              options={{
                headerShown: false,
              }}
            >
              {(props) => <SignUpScreen {...props} setToken={setToken} />}
            </Stack.Screen>
          </>
        ) : (
          // User is signed in ! 🎉
          <Stack.Screen name="Tab" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator
                screenOptions={{
                  headerShown: false,
                  tabBarActiveTintColor: "tomato",
                  tabBarInactiveTintColor: "gray",
                }}
              >
                <Tab.Screen
                  name="TabHome"
                  options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name={"ios-home"} size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        // Personnalisation du header pour tous les écrans de ce Navigator ------------------
                        headerTitle: () => <HeaderLogo />,
                        headerTitleAlign: "center",
                      }}
                    >
                      <Stack.Screen name="Home">
                        {() => <HomeScreen />}
                      </Stack.Screen>

                      <Stack.Screen name="Room">
                        {(props) => <RoomScreen {...props} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                {/* ----------------------------------------- */}
                <Tab.Screen
                  name="TabAroundMe"
                  options={{
                    tabBarLabel: "Around Me",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name={"ios-home"} size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        // Personnalisation du header pour tous les écrans de ce Navigator ------------------
                        headerTitle: () => <HeaderLogo />,
                        headerTitleAlign: "center",
                      }}
                    >
                      <Stack.Screen name="AroundMe">
                        {(props) => <AroundMe {...props} />}
                      </Stack.Screen>
                      <Stack.Screen name="Room">
                        {(props) => <RoomScreen {...props} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                {/* ----------------------------------------- */}
                <Tab.Screen
                  name="TabProfile"
                  options={{
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons
                        name={"ios-options"}
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        headerTitle: () => <HeaderLogo />,
                        headerTitleAlign: "center",
                      }}
                    >
                      <Stack.Screen
                        name="Settings"
                        options={{
                          title: "Settings",
                        }}
                      >
                        {() => (
                          <ProfileScreen
                            setToken={setToken}
                            userId={userId}
                            userToken={userToken}
                          />
                        )}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
