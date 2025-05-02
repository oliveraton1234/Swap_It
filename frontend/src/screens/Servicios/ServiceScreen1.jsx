import {
  View,
  Text,
  Button,
  Switch,
  StatusBar,
  SafeAreaView,
} from "react-native";
import React from "react";
import ServiceList from "./ServiceList"

const ServiceScreen1 = () => {

  return (
    <SafeAreaView
      className="flex-1 justify-center bg-white dark:bg-black"      
    >
      <ServiceList />
      <StatusBar barStyle={"dark"} />
    </SafeAreaView>
  )
}

export default ServiceScreen1