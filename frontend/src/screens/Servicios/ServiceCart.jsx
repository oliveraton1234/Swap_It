import { View, Text, Image, TouchableOpacity } from "react-native";
import * as React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

const ProductCart = ({ createdAt, _id, foto, categoria, titulo, contenido, precio }) => {
  const navigation = useNavigation();
  const fecha = new Date(createdAt);
  const dia = fecha.getDate().toString().padStart(2, "0"); // Obtener el día y convertirlo a cadena de texto con dos dígitos
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); // Obtener el mes y convertirlo a cadena de texto con dos dígitos
  const anio = fecha.getFullYear().toString(); // Obtener el año como cadena de texto

  const fechaFormateada = `${dia}/${mes}/${anio}`; // Concatenar los valores en el formato deseado

  return (
    <TouchableOpacity
      key={_id}
      onPress={() => navigation.navigate("ServiceDetails", { _id: _id })}
      className="w-full my-5"
    >
      <View>
        <View className="static w-full h-80">
          <Image
            source={{ uri: foto }}
            className={"w-full h-full"}
            style={{ resizeMode: "contain" }}
          />
          <View className="absolute top-3 left-4 bg-white px-2 py-1 rounded-full">
            <Text className="text-xs font-bold">{categoria}</Text>
          </View>
        </View>
        <View className="border border-transparent border-b-slate-500/50 pb-8">
          <View className="flex-row justify-between items-center">
            <Text className={"text-2xl font-bold dark:text-white"}>
              {titulo}
            </Text>
            <Text className="text-xs self-start font-bold text-black/60 dark:text-white/70 mt-2">
              {fechaFormateada + " "}
              <MaterialCommunityIcons name="calendar-month-outline" size={14} />
            </Text>
          </View>
          <Text
            numberOfLines={2}
            className={"text-xs text-black/60 dark:text-white/70"}
          >
            {contenido}
          </Text>
          <View className="justify-center">
            <View className="flex-row items-center">
              <Text className="dark:text-white mr-2">
                <MaterialCommunityIcons name="account-sync" size={26} />
              </Text>

              {precio.length > 3 ? (
                <>
                  {precio.slice(0, 2).map((p) => (
                    <View
                      key={p}
                      className="flex-row items-center rounded-full border border-black dark:border-slate-600 py-1.5 px-2 mx-1"
                    >
                      <Text className={"text-md font-semibold dark:text-white"}>
                        {p}
                      </Text>
                    </View>
                  ))}
                  <View className="flex-row items-center rounded-full border border-black dark:border-slate-600 py-1.5 px-2 mx-1">
                    <Text className={"text-md font-semibold dark:text-white"}>
                      ...
                    </Text>
                  </View>
                </>
              ) : (
                precio.map((p) => (
                  <View
                    key={p}
                    className="flex-row items-center rounded-full border border-black dark:border-slate-600 py-1.5 px-2 mx-1"
                  >
                    <Text className={"text-md font-semibold dark:text-white"}>
                      {p}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCart;
