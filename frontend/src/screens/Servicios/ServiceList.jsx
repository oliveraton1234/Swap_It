import React, { useState, useEffect } from "react";
import SERVER_HOST from "../../ServerHost";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import {
  RefreshControl,
  FlatList,
  ActivityIndicator,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,

} from "react-native";
import ServiceCard from "./ServiceCart";

const ServiceList = () => {
  const [publicaciones, setPublicaciones] = useState(null);
  useEffect(() => {
    fetch(`http://${SERVER_HOST}/api/publicaciones/tipo/Servicio`)
      .then((res) => res.json())
      .then((data) => {
        setPublicaciones(data);
      }); 
  }, []);

  const Categorias = [
    "Todo",
    "Arte",
    "Cocina",
    "Construcción",
    "Deportes",
    "Entretenimiento",
    "Equipo médico",
    "Hogar",
    "Jardinería",
    "Libros",
    "Medición",
    "Oficina",
    "Papelería",
    "Ropa",
    "Software",
    "Tecnología",
    "Otros",
  ];
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(0);

  function reloadData() {
    const categoria = Categorias[categoriaSeleccionada];
    fetch(
      `http://${SERVER_HOST}/api/publicaciones/categoria/servicio/${categoria}`
    )
      .then((res) => res.json())
      .then((data) => {
        setPublicaciones(data);
      });
  }

  const handleCategoriaSeleccionada = (index) => {
    setCategoriaSeleccionada(index);
    reloadData();
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    reloadData
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const [search, setSearch] = useState("");

useEffect(() => {
  searchPublicaciones();
}, [search]);

const searchPublicaciones = () => {
  const endpoint = search === ''
    ? `http://${SERVER_HOST}/api/publicaciones/tipo/Servicio`
    : `http://${SERVER_HOST}/api/publicaciones/buscar/servicio/${search}`;

  fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      setPublicaciones(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };
  return (
    <>
      {publicaciones ? (
        <SafeAreaView className="flex w-screen dark:bg-zinc-900">
          <View className="px-5 mt-2">
            <Text className="dark:text-white font-bold text-4xl">
              Servicios
            </Text>
            <View className="flex-row w-10/12  pb-3 mt-3">
              <View className="flex-row bg-white rounded-full h-8 border border-black dark:border-slate-500 overflow-hidden">
                <TextInput
                  type="text"
                  placeholder="Buscar"
                  className="w-10/12 h-8 rounded-full px-4 bg-white"
                  onChangeText={(text) => setSearch(text)}
                />
                <TouchableOpacity onPress={searchPublicaciones} className="border border-transparent border-l-black flex dark:text-white">
                  <Text className="pl-1.5">
                    <MaterialIcon name="search" size={28} />
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity className="dark:text-white w-1/12 ml-5">
                <Text className="dark:text-white">
                  <MaterialIcon className="ml-2 " name="tune" size={32} />
                </Text>
              </TouchableOpacity>
            </View>
            <Text className="mt-1 mb-1 dark:text-white font-semibold text-lg">
              Categorías
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className=""
            >
              <View className="flex-row">
                {Categorias.map((categoria, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`border-2 border-black dark:border-slate-500 rounded-full mr-2 ${index === categoriaSeleccionada
                        ? "bg-green-400 dark:bg-green-500"
                        : ""
                      }`}
                    onPress={() => handleCategoriaSeleccionada(index)}
                  >
                    <Text className="dark:text-white px-2.5 pt-1">
                      {categoria}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <Text className="mt-5 dark:text-white font-bold text-2xl">
              Publicaciones
            </Text>
            <FlatList
              className="h-4/6"
              data={publicaciones}
              renderItem={({ item }) => <ServiceCard {...item} />}
              keyExtractor={(publicaciones) => publicaciones._id}
              removeClippedSubviews={true}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
          </View>
        </SafeAreaView>
      ) : (
        <ScrollView
          className="flex w-screen h-screen dark:bg-zinc-900"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <ActivityIndicator size="large" className="mb-60" />
        </ScrollView>
      )}
    </>
  );
};

export default ServiceList;
