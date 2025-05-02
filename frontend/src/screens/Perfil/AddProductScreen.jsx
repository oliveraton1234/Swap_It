import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { useColorScheme } from "nativewind";
import * as ImagePicker from "expo-image-picker";
import { initializeApp } from "@firebase/app";
import { firebaseConfig } from "../../firebase.config";

const AddProductScreen = () => {
  const route = useRoute();
  const _id = route.params._id;
  const navigation = useNavigation();

  const Tipo = [
    { label: "Producto", value: "Producto" },
    { label: "Servicio", value: "Servicio" },
  ];
  const [tipo, setTipo] = useState(null);
  const [categoria, setCategoria] = useState([
    { label: "Selecione un tipo de publicacion", value: "" },
  ]);
  const [categoriaSelect, setCategoriaSelect] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [selected, setSelected] = useState([]);
  function handleCategoria(categoria) {
    setTipo(categoria);
    if (categoria === "Producto") {
      setCategoria([
        { label: "Arte", value: "Arte" },
        { label: "Cocina", value: "Cocina" },
        { label: "Construcción", value: "Construcción" },
        { label: "Deportes", value: "Deportes" },
        { label: "Entretenimento", value: "Entretenimento" },
        { label: "Equipo médico", value: "Equipo médico" },
        { label: "Hogar", value: "Hogar" },
        { label: "Jardinería", value: "Jardinería" },
        { label: "Libros", value: "Libros" },
        { label: "Medición", value: "Medición" },
        { label: "Oficina", value: "Oficina" },
        { label: "Papelería", value: "Papelería" },
        { label: "Ropa", value: "Ropa" },
        { label: "Software", value: "Software" },
        { label: "Tecnología", value: "Tecnología" },
        { label: "Otros", value: "Otros" },
      ]);
    }
    if (categoria === "Servicio") {
      setCategoria([
        {
          label: "Administración de empresas",
          value: "Administración de empresas",
        },
        { label: "Derecho", value: "Derecho" },
        { label: "Contaduría", value: "Contaduría" },
        { label: "Ingeniería", value: "Ingeniería" },
        { label: "Medicina", value: "Medicina" },
        { label: "Psicología", value: "Psicología" },
        { label: "Arquitectura", value: "Arquitectura" },
        { label: "Comunicación", value: "Comunicación" },
        { label: "Pedagogía", value: "Pedagogía" },
        { label: "Gastronomía", value: "Gastronomía" },
        { label: "Diseño", value: "Diseño" },
        { label: "Tutoría", value: "Tutoría" },
        { label: "Reparación", value: "Reparación" },
        { label: "Otros", value: "Otros" },
      ]);
    }
  }
  const data = [
    { label: "Arte", value: "Arte" },
    { label: "Dinero", value: "Dinero" },
    { label: "Cocina", value: "Cocina" },
    { label: "Construcción", value: "Construcción" },
    { label: "Deportes", value: "Deportes" },
    { label: "Entretenimento", value: "Entretenimento" },
    { label: "Equipo médico", value: "Equipo médico" },
    { label: "Hogar", value: "Hogar" },
    { label: "Jardinería", value: "Jardinería" },
    { label: "Libros", value: "Libros" },
    { label: "Medición", value: "Medición" },
    { label: "Oficina", value: "Oficina" },
    { label: "Papelería", value: "Papelería" },
    { label: "Ropa", value: "Ropa" },
    { label: "Software", value: "Software" },
    { label: "Tecnología", value: "Tecnología" },
    { label: "Otros", value: "Otros" },
  ];
  const { colorScheme } = useColorScheme();
  const textColor = colorScheme === "dark" ? "white" : "black";
  const placeholderColor = colorScheme === "dark" ? "#888" : "gray";
  const styles = StyleSheet.create({
    dropdown: {
      width: 300,
      height: 50,
      borderColor: "gray",
      borderWidth: 0.5,
      borderRadius: 10,
      marginRight: 15,
      color: textColor,
    },
    placeholderStyle: {
      fontSize: 16,
      marginLeft: 15,
      color: "gray",
    },
    selectedTextStyle: {
      fontSize: 16,
      marginLeft: 15,
      color: textColor,
    },
    selectedStyle: {
      borderRadius: 12,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
  });

  // This function is triggered when the "Select an image" button pressed
  const [image, setImage] = useState(null);

  const app = initializeApp(firebaseConfig);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3,
    });

    console.log(result);

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Explore the result
    console.log(result);

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      console.log(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView className={"flex-1 justify-center bg-white dark:bg-black"}>
      <View>
        <View className="flex-row w-12/12 pb-3 dark:bg-black">
          <Text className="text-xl w-3/12 font-semibold text-center text-gray-700 dark:text-white"></Text>
          <Text className="text-xl w-6/12 font-semibold text-center text-gray-700 dark:text-white">
            Agregar publicación
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Profile", {
                _id: _id,
              })
            }
            className="w-3/12"
          >
            <Text className="mr-1 mt-2 font-bold text-center text-gray-700 dark:text-white">
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row w-12/12 justify-center bg-white dark:bg-black">
          <View className="flex-1 w-6/12 border-4 border-transparent border-t-blue-700">
            <Text className="text-sm font-bold ml-5 mt-2 text-gray-700 dark:text-white">
              1 de 2
            </Text>
          </View>
          <View className="flex-1 w-6/12 border-4 border-transparent border-t-zinc-700" />
        </View>
      </View>
      <ScrollView
        className="flex-1 bg-white dark:bg-black"
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View className="flex self-start justify-center ml-3 mt-8">
          <Text className="text-2xl font-bold text-gray-700 dark:text-white mb-2">
            Ingresa los datos de tu publicación para que los usuarios puedan
            encontrarla
          </Text>
        </View>

        <View className="flex border m-5 border-slate-300 dark:border-zinc-700 rounded-xl	">
          <View className="flex self-start justify-center ml-3 mt-5">
            <Text className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
              Tipo de publicación
            </Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={Tipo}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Seleccionar"
              value={tipo}
              onChange={(item) => {
                const categoria = item.value;
                handleCategoria(categoria);
              }}
            />
          </View>

          <View className="flex self-start justify-center ml-3 mt-8">
            <Text className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
              Categoría
            </Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={categoria}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Seleccionar"
              value={categoriaSelect}
              onChange={(item) => {
                setCategoriaSelect(item.value);
              }}
            />
          </View>

          <View className="flex self-start justify-center ml-3 mt-8">
            <Text className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
              Título
            </Text>
            <TextInput
              required
              className="p-2 mb-2"
              style={styles.dropdown}
              placeholderTextColor={placeholderColor}
              placeholder="Ej: Regla t de dibujo técnico"
              onChangeText={(text) => setTitulo(text)}
              value={titulo}
            />
          </View>

          <View className="flex self-start justify-center ml-3 mt-5">
            <Text className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
              Imagen de tu publicación
            </Text>
            <View className="flex self-start justify-center  p-2 border border-slate-300 dark:border-zinc-700 rounded-xl">
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: 280, height: 280 }}
                />
              ) : (
                <Image
                  source={{
                    uri: "https://www.beelights.gr/assets/images/empty-image.png",
                  }}
                  style={{ width: 280, height: 280 }}
                />
              )}
              <View className="flex  justify-center">
                {image ? (
                  <TouchableOpacity
                    onPress={pickImage}
                    className="flex-row w-12/12 justify-center bg-zinc-300 dark:bg-zinc-800 mt-3 rounded-xl"
                  >
                    <Text className="text-lg font-semibold dark:text-white my-2">
                      Reemplazar
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={pickImage}
                      className="flex-row w-12/12 justify-center mt-3 border border-transparent border-b-slate-300 dark:border-b-zinc-700"
                    >
                      <Text className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
                        Seleccionar de galería
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={openCamera}
                      className="flex-row w-12/12 justify-center"
                    >
                      <Text className="text-lg font-semibold text-gray-700 dark:text-white mt-2">
                        Tomar foto
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>

          <View className="flex self-start justify-center ml-3 mt-5">
            <Text className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
              Contenido
            </Text>
            <TextInput
              required
              multiline={true}
              className="p-2 mb-2"
              maxLength={350}
              numberOfLines={4}
              style={styles.dropdown}
              placeholderTextColor={placeholderColor}
              placeholder="Ej: En perfecto estado, pretendo intercambiar por"
              onChangeText={(text) => setContenido(text)}
              value={contenido}
            />
          </View>

          <View className="flex self-start justify-center ml-3 mt-5 mb-5">
            <Text className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
              Intercambio
            </Text>
            <MultiSelect
              required
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              search
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Select item"
              searchPlaceholder="Search..."
              value={selected}
              onChange={(item) => {
                setSelected(item);
              }}
              selectedStyle={styles.selectedStyle}
            />
          </View>
        </View>
        <View className="flex self-center justify-center items-center">
          <TouchableOpacity
            onPress={() => {
              if (
                tipo == "" ||
                categoriaSelect == "" ||
                titulo == "" ||
                contenido == "" ||
                selected == ""
              ) {
                Alert.alert(
                  "Error",
                  "Debes completar todos los campos"
                );
              } else {
                if (image) {
                  navigation.navigate("AddProduct2", {
                    _id: _id,
                    tipo: tipo,
                    categoria: categoriaSelect,
                    titulo: titulo,
                    contenido: contenido,
                    image: image,
                    precio: selected,
                  });
                } else {
                  Alert.alert(
                    "Error",
                    "Debes seleccionar una imagen para tu publicación"
                  );
                }
              }
            }}
            className="flex-row w-12/12 justify-center py-2 bg-zinc-300 dark:bg-zinc-800 rounded-xl mb-5"
            style={{ width: 300 }}
          >
            <Text className="text-lg font-semibold text-gray-700 dark:text-white">
              Continuar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProductScreen;
