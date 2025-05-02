import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import ProductCart from "./Productos/ProductCart";

const HomeScreen1 = () => {
  const navigation = useNavigation();
  const [destacados, setdestacados] = useState(null);
  const [uriDelDia, setUriDelDia] = useState("https://firebasestorage.googleapis.com/v0/b/xchange-trueques.appspot.com/o/Bienvenidos.png?alt=media&token=76ac92b7-198f-42c9-87e9-4892b866851d&_gl=1*ellya5*_ga*MTMyODI5MTcxLjE2NzIwOTY5NDY.*_ga_CW55HF8NVT*MTY4NjM1NzIxOS4zMC4xLjE2ODYzNTczMTUuMC4wLjA.");
  const [productos, setProductos] = useState(null);
  const [servicios, setServicios] = useState(null);

  useEffect(() => {
    fetch(`http://${SERVER_HOST}/api/publicaciones/destacados/ver`)
      .then((res) => res.json())
      .then((data) => {
        setdestacados(data);
      });
    fetch(`http://${SERVER_HOST}/api/publicaciones/destacados/productos`)
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
      });
    fetch(`http://${SERVER_HOST}/api/publicaciones/destacados/servicios`)
      .then((res) => res.json())
      .then((data) => {
        setServicios(data);
      });
  }, []);

  function reloadData() {
    fetch(`http://${SERVER_HOST}/api/publicaciones/destacados/ver`)
      .then((res) => res.json())
      .then((data) => {
        setdestacados(data);
      });
  }

  const uriPastrocinada =
    "https://firebasestorage.googleapis.com/v0/b/sionix-digital.appspot.com/o/Mesa%20de%20trabajo%201.png?alt=media&token=d7772da0-6daf-45a7-aa32-785bd62c7e00";

  return (
    <SafeAreaView className="flex w-screen bg-white dark:bg-zinc-900">
      <View className="px-5">
        <Text className="py-3 dark:text-white font-bold text-4xl">Swapit</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Text className="mb-2 dark:text-white font-semibold text-xl">
              Foto del día
            </Text>
            <Image
              source={{ uri: uriDelDia }}
              className="w-full h-56 rounded-xl"
              style={{ resizeMode: "contain" }}
            />
          </View>
          <View>
            <Text className="mt-5 dark:text-white font-semibold text-xl">
              Destacados
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className=""
            >
              <View className="flex-row mt-3 pb-5">
                {destacados ? (
                  destacados.map((publicacion) => (
                    <View
                      key={publicacion._id}
                      className="flex-row justify-center items-center"
                    >
                      <TouchableOpacity
                        className="w-32 h-32 mr-3"
                      >
                        <View className="static w-full h-80">
                          <Image
                            source={{ uri: publicacion.foto }}
                            className="w-32 h-32 object-cover rounded-xl"
                            style={{ resizeMode: "contain" }}
                          />
                          <View className="absolute top-1 left-1 bg-white/50 px-1 py-0.5 rounded-full">
                            <Text className="text-xs font-light">
                              {publicacion.categoria}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text className="dark:text-white">Cargando...</Text>
                )}
              </View>
            </ScrollView>
          </View>
          <View>
            <Text className="dark:text-white font-semibold text-xl">
              Publicación patrocinada
            </Text>
            <Image
              source={{ uri: uriPastrocinada }}
              className="w-full h-56 rounded-xl"
              style={{ resizeMode: "contain" }}
            />
          </View>
          <View>
            <Text className="mt-5 dark:text-white font-semibold text-xl">
              Artículos populares
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row mt-3 pb-5">
                {productos ? (
                  productos.map((publicacion) => (
                    <View
                      key={publicacion._id}
                      className="flex-row justify-center items-center"
                    >
                      <TouchableOpacity
                        className="w-32 h-32 mr-3"
                      >
                        <View className="static w-full h-80">
                          <Image
                            source={{ uri: publicacion.foto }}
                            className="w-32 h-32 object-cover rounded-xl"
                            style={{ resizeMode: "contain" }}
                          />
                          <View className="absolute top-1 left-1 bg-white/50 px-1 py-0.5 rounded-full">
                            <Text className="text-xs font-light">
                              {publicacion.categoria}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text className="dark:text-white">Cargando...</Text>
                )}
              </View>
            </ScrollView>
          </View>
          <View className="flex">
            <Text className="mt-5 dark:text-white font-semibold text-xl">
              Servicios populares
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row mt-3">
                {servicios ? (
                  servicios.map((publicacion) => (
                    <View
                      key={publicacion._id}
                      className="flex-row justify-center items-center"
                    >
                      <TouchableOpacity
                        className="w-32 h-32 mr-3"
                      >
                        <View className="static w-full h-80">
                          <Image
                            source={{ uri: publicacion.foto }}
                            className="w-32 h-32 object-cover rounded-xl"
                            style={{ resizeMode: "contain" }}
                          />
                          <View className="absolute top-1 left-1 bg-white/50 px-1 py-0.5 rounded-full">
                            <Text className="text-xs font-light">
                              {publicacion.categoria}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text className="dark:text-white">Cargando...</Text>
                )}
              </View>
            </ScrollView>
          </View>
          <Text className="mt-5 dark:text-white font-semibold text-sm text-center">
            Copyright © Swapit 2023 All rights reserved.
          </Text>
          <Text className="dark:text-white text-sm text-center pb-36">
            Aplicación creada por Roberto Quintana, Oliver estrada y Josias Dominguez
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen1;
