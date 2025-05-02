import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProductsScreen1 from "../screens/Productos/ProductsScreen1";
import ProductsScreen2 from "../screens/Productos/ProductsScreen2";
import { useColorScheme } from "nativewind";
import PublicPerfilScreen from "../screens/Productos/PublicPerfilScreen";

const ProductsScreen = () => {
  const ProductStack = createNativeStackNavigator();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <ProductStack.Navigator
      initialRouteName="  ProductsStack"
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProductStack.Screen name="Productos" component={ProductsScreen1} />
      <ProductStack.Screen name="ProductDetails" component={ProductsScreen2} options={{presentation: 'modal'}}/>
      <ProductStack.Screen name="Profile" component={PublicPerfilScreen} options={{presentation: 'containedModal'}} />
    </ProductStack.Navigator>
  );
};

export default ProductsScreen;
