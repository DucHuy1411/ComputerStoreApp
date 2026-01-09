import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AccountScreen from "../screens/AccountScreen";
import AddressScreen from "../screens/AddressScreen";
import OrderScreen from "../screens/OrderScreen";
import OrderDetailScreen from "../screens/OrderDetailScreen";
import RecentlyViewedScreen from "../screens/RecentlyViewedScreen";
import WishlistScreen from "../screens/WishlistScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import PaymentMethodsScreen from "../screens/PaymentMethodsScreen";

const Stack = createNativeStackNavigator();

export default function AccountStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AccountHome" component={AccountScreen} />
      <Stack.Screen name="Address" component={AddressScreen} />
      <Stack.Screen name="Orders" component={OrderScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="RecentlyViewed" component={RecentlyViewedScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
    </Stack.Navigator>
  );
}
