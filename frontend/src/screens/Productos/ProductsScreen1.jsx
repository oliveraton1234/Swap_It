import { StatusBar, SafeAreaView } from "react-native";
import React from "react";
import ProductList from "./ProductList";

const ProductsScreen1 = () => {

  return (
    <SafeAreaView
      className="flex-1 justify-center bg-white dark:bg-black"      
    >
      <ProductList />
      <StatusBar barStyle={"dark"} />
    </SafeAreaView>
  );
};

export default ProductsScreen1;
