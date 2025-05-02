import { View, Text, Image, TouchableOpacity, TextInput, Button, Modal, Animated, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import SERVER_HOST from '../../ServerHost';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ChangeProfilePic = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const _id = route.params._id;

  ///
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [contacto, setContacto] = useState('');
  const [foto, setFoto] = useState('');
  const [userData, setUserData] = useState('');
  ///


  useEffect(() => {
    fetch(`http://${SERVER_HOST}/api/usuarios/${_id}`)
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        setNombre(data.nombre);
        setApellido(data.apellido);
        setTelefono(data.telefono.toString());
        setEmail(data.email.toString());
        setDireccion(data.direccion);
        setContacto(data.contacto);
      });
  }, []);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [cachedImage, setCachedImage] = useState(null);


  const selectProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      // Permiso denegado
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1], // Proporción de aspecto 
      quality: 1, // Calidad de la imagen 
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setSelectedImage(selectedAsset.uri);
      setCachedImage(selectedAsset.uri);
    }
  };

  const takeProfilePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      // Permiso denegado
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1], // Proporción de aspecto 
      quality: 1, // Calidad de la imagen 
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setSelectedImage(selectedAsset.uri);
      setCachedImage(selectedAsset.uri);
    }
  };

  const deleteProfileImage = () => {

    setSelectedImage("https://i.pinimg.com/736x/58/51/2e/58512eb4e598b5ea4e2414e3c115bef9.jpg");
    setCachedImage("https://i.pinimg.com/736x/58/51/2e/58512eb4e598b5ea4e2414e3c115bef9.jpg");
  };

  const toggleOptionsVisible = () => {
    setIsOptionsVisible(!isOptionsVisible);
  };
  
  
  const handleConfirmar = async () => {
    if (!nombre || !apellido || !telefono || !direccion || !contacto) {
      // Si algún campo obligatorio está vacío, muestra una alerta o realiza alguna acción de manejo de error
      console.log('Por favor, completa todos los campos obligatorios');
      return;
    }
    const updatedData = {
      nombre: nombre,
      apellido: apellido,
      telefono: telefono,
      email: userData.email,
      direccion: direccion,
      contacto: contacto,
    };

    if (selectedImage) {
      // Convertir la imagen en un objeto Blob
      const response = await fetch(selectedImage);
      const blob = await response.blob();

      // Referencia a la carpeta en Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, `Perfiles/${_id}/${Date.now()}`);

      try {
        // Subir la imagen a Firebase Storage
        await uploadBytes(storageRef, blob);

        // Obtener el enlace de descarga de la imagen
        const downloadURL = await getDownloadURL(storageRef);

        // Agregar el enlace de descarga al objeto actualizado
        updatedData.foto = downloadURL;

        // Actualizar los datos en MongoDB
        const response = await fetch(`http://${SERVER_HOST}/api/usuarios/updateProfile/${_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    } else {
      // No hay imagen seleccionada, solo envía los datos actualizados
      try {
        const response = await fetch(`http://${SERVER_HOST}/api/usuarios/updateProfile/${_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
   
    navigation.navigate("Profile", {
      _id: _id,
    });
  };
  


  return (
    <SafeAreaView className={" flex-1 bg-white dark:bg-black"}>

      <View>
        <View className=" flex-row w-full p-5 dark:bg-black justify-between">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Profile", {
                _id: _id,
              })
            }

          >
            <Text className=" font-bold text-left text-gray-700 dark:text-white">
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleConfirmar}>

            <Text className="font-bold text-right text-gray-700 dark:text-white">
              Confirmar
            </Text>
          </TouchableOpacity>
        </View>


        <View className="mx-4">
          <Text className=" text-lg text-center dark:text-white font-bold">
            {userData.nombre} {userData.apellido}{" "}
          </Text>
          <Text className="text-center dark:text-white text-emerald-700 font-light">
            Cambia tu presencia en Swapit y tus preferencias
          </Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="mt-6 items-center ">
            <View className="relative  ">
              <TouchableOpacity onPress={toggleOptionsVisible}>
                <Image

                  className="w-[120px] h-[120px] rounded-full "
                  source={{
                    uri: selectedImage ? selectedImage : userData.foto,
                  }}
                />
                <View className="absolute right-0 bottom-0 mr-1 mb-1">
                  <MaterialCommunityIcons
                    name="camera"
                    style={{ color: '#2ecc71' }} // Establecer el color del ícono como blanco
                    className="bg-blue-500 rounded-full p-1"
                    size={23}
                  />
                </View>
              </TouchableOpacity >

              {isOptionsVisible && (

                <Animated.View className="absolute  bg-gray-200 black:bg-white black-text-white rounded-lg mt-2 p-4 top-12 mb-20 ">
                  <TouchableOpacity className="mb-2" onPress={selectProfileImage}>
                    <Text className="text-gray-800 font-bold">
                      Subir imagen</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="mb-2" onPress={takeProfilePhoto}>
                    <Text className="text-gray-800 font-bold">Tomar foto</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="mb-2" onPress={deleteProfileImage}>
                    <Text className="text-red-500 font-bold">Eliminar foto</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          </View>


          <View className="flex flex-1 justify-center items-center">
            <View className="w-[350px] mt-10 space-y-1 ">
              <View className="flex flex-row">
                <View className="w-1/2 pr-2">
                  <View className="bg-gray-300/5 p-2  dark:bg-black rounded-lg">
                    <Text className="text-gray-600 dark:text-emerald-400 font-bold">Nombre(s)</Text>
                    <TextInput
                      className="border border-gray-800/30 text-gray-500 dark:text-white dark:border-gray-800 rounded-lg px-3 py-2"
                      placeholder="Nombre"
                      value={nombre}
                      onChangeText={setNombre}
                    />
                  </View>
                </View>
                <View className="w-1/2 pl-2">
                  <View className="bg-gray-300/5 p-2 dark:bg-black rounded-lg">
                    <Text className="text-gray-600 dark:text-emerald-400 font-bold">Apellidos</Text>
                    <TextInput
                      className="border border-gray-800/30 text-gray-500 dark:text-white dark:border-gray-800 rounded-lg px-3 py-2"
                      placeholder="Apellido"
                      value={apellido}
                      onChangeText={setApellido}
                    />
                  </View>
                </View>
              </View>



              <View className="bg-gray-300/5 p-2  dark:bg-black rounded-lg ">
                <Text className="text-gray-600 dark:text-emerald-400 font-bold ">Telefono</Text>
                <TextInput
                  className="border border-gray-800/30  text-gray-500 dark:text-white dark:border-gray-800  rounded-lg px-3 py-2"
                  placeholder="Teléfono"
                  value={telefono}
                  onChangeText={setTelefono}
                  keyboardType="numeric"

                /></View>

              <View className="bg-gray-300/5 p-2  dark:bg-black rounded-lg ">
                <Text className="text-gray-600 dark:text-red-400 font-bold ">Correo Electronico</Text>
                <TextInput
                  className="border border-gray-800/30 dark:bg-gray-800/80 text-gray-500 dark:text-gray-100 dark:border-gray-800  rounded-lg px-3 py-2"
                  placeholder="Email"
                  value={email}
                  onChangeText={userData.email}
                  editable={false}

                /></View>

              <View className="bg-gray-300/5 p-2  dark:bg-black rounded-lg ">
                <Text className="text-gray-600 dark:text-emerald-400 font-bold ">Universidad</Text>
                <TextInput
                  className="border border-gray-800/30  text-gray-500 dark:text-white dark:border-gray-800  rounded-lg px-3 py-2"
                  placeholder="Universidad"
                  value={direccion}
                  onChangeText={setDireccion}
                /></View>

              <View className="bg-gray-300/5 p-2  dark:bg-black rounded-lg ">
                <Text className="text-gray-600 dark:text-emerald-400 font-bold ">Contacto</Text>
                <TextInput
                  className="border border-gray-800/30  text-gray-500 dark:text-white dark:border-gray-800  rounded-lg px-3 py-2"
                  placeholder="Contacto"
                  value={contacto}
                  onChangeText={setContacto}
                /></View>

            </View></View>
        </ScrollView>

      </View>
    </SafeAreaView>

  );
};

export default ChangeProfilePic;
