import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CategoryScreen from "../screens/CategoryScreen";
import CategoryDetailScreen from "../screens/CategoryDetailScreen";

const Stack = createNativeStackNavigator();

export default function CategoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CategoryHome" component={CategoryScreen} />
      <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
    </Stack.Navigator>
  );
}
