import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import CategoryStack from "./CategoryStack";
import DealsScreen from "../screens/DealsScreen";
import AccountStack from "./AccountStack";


const Tab = createBottomTabNavigator();

const BLUE = "#0B63F6";

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: BLUE,
        tabBarInactiveTintColor: "#9AA0A6",
        tabBarStyle: { height: 60, paddingTop: 6, paddingBottom: 8 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarIcon: ({ color, size, focused }) => {
          const map = {
            Home: focused ? "home" : "home-outline",
            Category: focused ? "grid" : "grid-outline",
            Deals: focused ? "flame" : "flame-outline",
            Account: focused ? "person" : "person-outline",
          };
          return <Ionicons name={map[route.name]} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Trang chủ" }} />
      <Tab.Screen name="Category" component={CategoryStack} options={{ title: "Danh mục" }} />
      <Tab.Screen name="Deals" component={DealsScreen} options={{ title: "Khuyến mãi" }} />
      <Tab.Screen name="Account" component={AccountStack} options={{ title: "Tài khoản" }} />
    </Tab.Navigator>
  );
}
