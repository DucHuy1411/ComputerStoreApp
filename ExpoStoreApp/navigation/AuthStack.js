import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Đăng nhập" }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Đăng ký" }} />
        </Stack.Navigator>
    );
}
