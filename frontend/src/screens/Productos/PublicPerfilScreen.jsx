import {
  View,
  Text,
  ScrollView,
  Image,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
  Linking
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { useColorScheme } from "nativewind";
import { useRoute, useNavigation } from "@react-navigation/native";
import Calificacion from "../Resourses/Calificacion";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { REACT_APP_SERVER_HOST } from "@env";
import SERVER_HOST from '../../ServerHost'

const PublicPerfilScreen = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const route = useRoute();
  const _id = route.params._id;
  const navigation = useNavigation();

  const [User, setUser] = React.useState([]);

  const [publicaciones, setPublicaciones] = React.useState([]);

  useEffect(() => {
    console.log(SERVER_HOST);
    fetch(`http://${SERVER_HOST}/api/usuarios/${_id}/publicaciones`)
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error(error));
  }, []);

  ////////////////////Reportar Usurios/////////////////////

  const [isReportModalVisible, setReportModalVisible] = useState(false);

  const toggleReportModal = () => {
    setReportModalVisible(!isReportModalVisible);
  };

  const [reportedUsers, setReportedUsers] = useState([]);
  const [modalVisible2, setModalVisible2] = useState(false);

  const handleReportUser = async (userId) => {
    if (reportedUsers.includes(userId)) {
      Alert.alert("Reporte no enviado", "Ya has reportado a este usuario");
      return;
    }

    try {
      const response = await fetch(
        `http://${SERVER_HOST}/api/usuarios/reportes/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();

      setReportedUsers([...reportedUsers, userId]);
      Alert.alert("Reporte enviado");
    } catch (error) {
      console.error(error);
    }

    toggleReportModal();
  };
  const handleWhatsAppOpen = () => {
    const phoneNumber = User.usuario.telefono;
    const url = `https://wa.me/+52${phoneNumber}`;

    Linking.openURL(url)
      .then(() => {
        console.log("WhatsApp opened successfully");
      })
      .catch((error) => {
        console.log("An error occurred while opening WhatsApp: ", error);
      });
  };

  const handleAddressPress = () => {
    const address = User.usuario.direccion;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;

    Linking.openURL(url);
  };
  const handleOpenModal = () => {
    toggleReportModal();
  };
  return (
    <>
      <View className="flex-row bg-white dark:bg-zinc-900 justify-between pb-1">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mx-5 mt-2"
        >
          <Text className="dark:text-white self-center">
            <MaterialCommunityIcons name="chevron-left" size={35} />
          </Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={handleOpenModal}
          className="mx-5 pt-1 my-2"
        >
          <Text className="dark:text-white self-center">
            <MaterialCommunityIcons name="menu" size={25} />
          </Text>
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isReportModalVisible}
          onRequestClose={toggleReportModal}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            activeOpacity={1}
            onPress={toggleReportModal}
          >
            <View
              style={{
                margin: 20,
                backgroundColor: "white",
                borderRadius: 20,
                padding: 35,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => handleReportUser(_id)}
              >
                <MaterialCommunityIcons
                  name="alert-octagon"
                  size={24}
                  color="red"
                />
                <Text style={{ marginLeft: 8 }}>Reportar usuario</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ alignSelf: "flex-end", marginTop: 10 }}
                onPress={toggleReportModal}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="account-star"
                    size={24}
                    color="green"
                  />
                  <Text style={{ marginLeft: 8 }}>Calificar usuario</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ alignSelf: "center", marginTop: 10 }}
                  onPress={toggleReportModal}
                >
                  <Text className="mt-2 bg-gray-500 rounded-xl  flex w-[150px] justify-center text-center p-2 "
                    style={{ color: "white" }}
                  >
                    Cerrar
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

      </View>



      <ScrollView className={"w-full bbg-gray-200 dark:bg-black"}>
        {!User.usuario ? (
          <View className="flex justify-center items-center w-screen h-screen dark:bg-zinc-900 ">
            <ActivityIndicator size="large" className="mb-60" />
          </View>
        ) : (
          <>
            <View className="p-5 items-center">
            <View>
  <TouchableOpacity
    className="w-4/12 "
    onPress={() => setModalVisible2(true)}
  >
    <Image
      source={{ uri: User.usuario.foto }}
      className="w-24 h-24 rounded-full mb-3 self-center"
    />
  </TouchableOpacity>
</View>
<Modal
  visible={modalVisible2}
  onRequestClose={() => setModalVisible2(false)}
>
  <TouchableOpacity
    style={{
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",

      justifyContent: "center",
      alignItems: "center",
    }}
    activeOpacity={1}
    onPress={() => setModalVisible2(false)}
  >
    <Image
      source={{ uri: User.usuario.foto }}
      className="w-full h-full"
      resizeMode="contain"
    />
  </TouchableOpacity>
</Modal>







              <View className="self-center">


                <Text className="text-xl items-center text-center font-bold dark:text-white justify-center">
                  {" " +
                    User.usuario.nombre +
                    " " +
                    User.usuario.apellido +
                    " "}
                  <MaterialCommunityIcons
                    name="check-decagram"
                    className="text-black/60 dark:text-white/70"
                    size={20}
                  />
                </Text>

                <View className="items-left w-[300px] bg-gray-500/10 rounded-xl p-3  space-y-2">
                  <View className="flex-row justify-center items-center">

                    <Text className="text-sm font-bold dark:text-white">
                      {"Puntuación:"}
                    </Text>

                    <Calificacion
                      calificacion={User.usuario.calificacion}
                      size={18}
                      cl="ml-1"
                    /></View>


                  <Text className="dark:text-white  mt-2" onPress={handleAddressPress}>
                    <MaterialCommunityIcons
                      name="map-marker-outline"
                      className="text-black/60 dark:text-white/70"
                      size={15}
                    />{" "}
                    <Text style={{}}> {User.usuario.direccion}</Text>  </Text>


                  <TouchableOpacity onPress={handleWhatsAppOpen}>
                    <Text className="text-sm font-bold dark:text-white ">
                      <MaterialCommunityIcons
                        name="whatsapp"
                        className="text-black/60 dark:text-white/70"
                        size={15}
                      />
                      {"  "}
                      <Text style={{ color: 'green' }}> {User.usuario.telefono}</Text>
                    </Text>


                  </TouchableOpacity>


                  <Text className="text-sm font-bold dark:text-white ">
                    <MaterialCommunityIcons
                      name="email"
                      className="text-black/60 dark:text-white/70 	"
                      size={15}
                    />{"  "}
                    {User.usuario.contacto}
                  </Text>
                </View>
              </View>






              <Text className="text-3xl font-bold dark:text-white self-center mt-10">
                Publicaciones y Servicios
              </Text>
              <View className="self-center mt-5">
                {User.publicaciones.map((publicacion) => (
                  <View className="mt-5">
                    <TouchableOpacity
                      key={publicacion._id}
                      className="flex flex-col justify-center items-center bg-white dark:bg-white/10 rounded-xl px-5 pt-3 pb-5"
                      onPress={() =>
                        navigation.navigate("ProductDetails", {
                          _id: publicacion._id,
                        })
                      }
                    >
                      <View className="flex justify-between items-center w-full">
                        <View className="flex w-full mb-3 items-center border-2 border-transparent border-b-zinc-700">
                          <Text className="text-sm font-bold mb-1 dark:text-white">
                            {publicacion.tipo}
                          </Text>
                        </View>

                        <View className="flex-row w-full">
                          <View className="flex w-10/12">
                            <Text
                              numberOfLines={1}
                              className="text-xl self-start font-bold dark:text-white"
                            >
                              {publicacion.titulo}
                            </Text>
                            <Text className="text-sm self-start mb-2 font-bold dark:text-white">
                              {publicacion.categoria}
                            </Text>
                          </View>
                        </View>

                        <View className="flex-row w12/12">
                          <View className="w-5/12">
                            <Image
                              source={{ uri: publicacion.foto }}
                              className="w-16 h-16 rounded-full mr-1 self-center mb-2"
                            />
                          </View>
                          <View className="w-7/12">
                            <Text className="text-sm font-semibold dark:text-white mb-2">
                              Intercambio por:{" "}
                            </Text>
                            <Text className="text-sm font-bold dark:text-white">
                              {publicacion.precio.length > 3 ? (
                                <>
                                  {publicacion.precio.slice(0, 2).map((p) => (
                                    <View
                                      key={p}
                                      className="flex-row items-center rounded-full bg-stone-200 dark:bg-stone-600 px-1 py-0.5"
                                      style={{ alignItems: "center" }}
                                    >
                                      <Text
                                        className={
                                          "text-sm font-semibold dark:text-zinc-300"
                                        }
                                      >
                                        {p}
                                      </Text>
                                    </View>
                                  ))}
                                  <View className="flex-row items-center rounded-full bg-stone-200 dark:bg-stone-600 px-1 py-0.5">
                                    <Text
                                      className={
                                        "text-sm font-semibold dark:text-zinc-300"
                                      }
                                    >
                                      ...
                                    </Text>
                                  </View>
                                </>
                              ) : (
                                publicacion.precio.map((p) => (
                                  <View
                                    key={p}
                                    className="flex-row items-center rounded-full bg-stone-200 dark:bg-stone-600 px-1 py-0.5"
                                  >
                                    <Text
                                      className={
                                        "text-sm font-semibold dark:text-zinc-300 mt-2"
                                      }
                                    >
                                      {p}
                                    </Text>
                                  </View>
                                ))
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View className="flex flex-row justify-center items-center w-full pb-5">
                        <Text
                          numberOfLines={5}
                          className="text-sm mt-1 dark:text-white"
                        >
                          {publicacion.contenido}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
};

export default PublicPerfilScreen;
