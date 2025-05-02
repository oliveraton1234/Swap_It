import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ServiceScreen2 from "../screens/Servicios/ServiceScreen2";
import ServiceScreen1 from "../screens/Servicios/ServiceScreen1";
import { useColorScheme } from "nativewind";

const ServicesStackScreen = () => {
  const ServiceStack = createNativeStackNavigator();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const barBackgroundColor = colorScheme === 'dark' ? 'black' : 'white';
  const textColor = colorScheme === 'dark' ? 'white' : 'black';

  return (
    <ServiceStack.Navigator
      initialRouteName="ServiciosList"
      screenOptions={{
        headerShown: false,
      }}
    >
      <ServiceStack.Screen name="ServiciosList" component={ServiceScreen1} />
      <ServiceStack.Screen name="ServiceDetails" component={ServiceScreen2} options={{presentation: 'modal'}}/>
    </ServiceStack.Navigator>
  );
};

export default ServicesStackScreen;
