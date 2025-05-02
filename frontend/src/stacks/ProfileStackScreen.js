import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PerfilScreen from '../screens/Perfil/PerfilScreen';
import AddProductScreen from '../screens/Perfil/AddProductScreen';
import AddProductScreen2 from '../screens/Perfil/AddProductScreen2';
import LoginScreen from '../screens/Perfil/LoginScreen';
import ChangeProfilePic from '../screens/Perfil/ChangeProfilePic';
import EditProduct from '../screens/Perfil/EditProduct';

const ProfileStackScreen = () => {
  const ProfileStack = createNativeStackNavigator();

  return (
    <ProfileStack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <ProfileStack.Screen name="Login" component={LoginScreen} />
      <ProfileStack.Screen name="Profile" component={PerfilScreen} />
      <ProfileStack.Screen name="AddProduct" component={AddProductScreen} />
      <ProfileStack.Screen name="AddProduct2" component={AddProductScreen2} />
      <ProfileStack.Screen name="Change_profile_pic" component={ChangeProfilePic} options={{presentation: 'modal'}} />
      <ProfileStack.Screen name="EditProduct" component={EditProduct} />
    </ProfileStack.Navigator>
  )
}

export default ProfileStackScreen