import { View, Text, Platform } from "react-native";
import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HomeStackScreen from "./stacks/HomeStackScreen";
import { NavigationContainer } from "@react-navigation/native";
import ProductsStackScreen from "./stacks/ProductsStackScreen";
import ServicesStackScreen from "./stacks/ServicesStackScreen";
import ProfileStackScreen from "./stacks/ProfileStackScreen";
import { useColorScheme } from "nativewind";

const Tabs = () => {
  const Tab = ChooseTab();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  function ChooseTab() {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      return createMaterialBottomTabNavigator();
    } else {
      return createMaterialTopTabNavigator();
    }
  }

  const barBackgroundColor = colorScheme === 'dark' ? 'black' : 'white';


  return (
    <NavigationContainer name="tabs">
      <Tab.Navigator
        initialRouteName="Feed"
        activeColor="#E2443B"
        inactiveColor="#aaa"
        barStyle={{ backgroundColor: barBackgroundColor  }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackScreen}
          options={{
            tabBarLabel: "Inicio",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Artículos"
          component={ProductsStackScreen}
          options={{
            tabBarLabel: "Artículos",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="bag-personal" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Servicios"
          component={ServicesStackScreen}
          options={{
            tabBarLabel: "Servicios",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="charity"
                color={color}
                size={26}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Perfil"
          component={ProfileStackScreen}
          options={{
            tabBarLabel: "Perfil",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account-circle" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Tabs;
