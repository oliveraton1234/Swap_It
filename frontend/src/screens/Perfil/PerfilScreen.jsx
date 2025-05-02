import {
  View,
  Text,
  ScrollView,
  Image,
  Switch,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Linking
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useColorScheme } from "nativewind";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthContext } from "../../AuthContext";
import Calificacion from "../Resourses/Calificacion";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "@firebase/app";
import { firebaseConfig } from "../../firebase.config";
import { REACT_APP_SERVER_HOST } from "@env";
import SERVER_HOST from '../../ServerHost'

const PerfilScreen = () => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const { setUser } = useContext(AuthContext);
  const { isUser } = useContext(AuthContext);
  const navigation = useNavigation();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [publicaciones, setPublicaciones] = useState([]);
  const User = isUser;
  const route = useRoute();
  const _id = route.params._id;

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        navigation.navigate("Login");
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  };

  const handleProfilePic = () => {
    navigation.navigate("ChangeProfilePic");
  };

  //Peticion asincrona get a http://192.168.0.4:4000/api/usuarios/${User._id}/publicaciones
  useEffect(() => {
    fetch(`http://${SERVER_HOST}/api/publicaciones/usuario/${_id}`)
      .then((res) => res.json())
      .then((data) => {
        setPublicaciones(data);
      });
     
      
  }, []);

  function reloadData() {
    fetch(`http://${SERVER_HOST}/api/publicaciones/usuario/${_id}`)
      .then((res) => res.json())
      .then((data) => {
        setPublicaciones(data);
      });
      fetch(`http://${SERVER_HOST}/api/usuarios/${_id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        
      });
  }

  function deletePublicacion(_id) {
    fetch(`http://${SERVER_HOST}/api/publicaciones/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        Alert.alert("Publicacion eliminada");
        reloadData();
      });
  }

  const handleWhatsAppOpen = () => {
    const phoneNumber = User.telefono;
    const url = `https://wa.me/+52${phoneNumber}`;

    Linking.openURL(url)
      .then(() => {
        console.log("WhatsApp opened successfully");
      })
      .catch((error) => {
        console.log("An error occurred while opening WhatsApp: ", error);
      });
  };

  

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    reloadData();
    setTimeout(() => {
      
      setRefreshing(false);
    }, 500);
  }, []);
  
  const handleAddressPress = () => {
    const address = User.direccion;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;

    Linking.openURL(url);
  };
  return (
    <>
      {isUser ? (
        <ScrollView
          className={"w-full bbg-gray-200 dark:bg-black p-5"}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View className="flex flex-col justify-center items-center h-full w-full">
              <View className="flex justify-center items-center w-full h-full bg-white dark:bg-black/90 rounded-xl p-5">
                <Text className="text-2xl font-bold dark:text-white">
                  Opciones
                </Text>
                <View className="flex-row w-3/4 mt-8 pb-3 mb-3 justify-between items-center border-2 border-transparent border-b-zinc-200 dark:border-b-zinc-800">
                  <View>
                    <Text className="dark:text-white font-bold self-center">
                      Modo oscuro
                    </Text>
                  </View>

                  <View>
                    <Switch
                      className="self-center"
                      value={colorScheme === "dark"}
                      onChange={toggleColorScheme}
                      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  onPress={handleSignOut}
                  className="flex-row w-3/4 pb-3 mb-3 justify-between items-center border-2 border-transparent border-b-zinc-200 dark:border-b-zinc-800"
                >
                  <View>
                    <Text className="dark:text-white font-bold self-center">
                      Cerrar sesión{" "}
                    </Text>
                  </View>

                  <View>
                    <Text className="dark:text-white font-bold self-center">
                      <MaterialCommunityIcons
                        name="logout"
                        className="text-black/60 dark:text-white"
                        size={20}
                         
                      />
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {Alert.alert("En desarrollo", "Por favor envíanos tu feedback al siguente correo: rrquintana7@gmail.com")}}
                  className="flex-row w-3/4 pb-3 mb-3 justify-between items-center border-2 border-transparent border-b-zinc-200 dark:border-b-zinc-800"
                >
                  <View>
                    <Text className="dark:text-white font-bold self-center">
                      Leave a feedback{" "}
                    </Text>
                  </View>
                  <View>
                    <Text className="dark:text-white font-bold self-center">
                      <MaterialCommunityIcons
                        name="message-alert"
                        className="text-black/60 dark:text-white"
                        size={20}
                      />
                    </Text>
                  </View>
                </TouchableOpacity>

                <View className="flex-row justify-center items-center mt-5">
                  <TouchableOpacity
                    onPress={() => setModalVisible(!modalVisible)}
                    className="flex-row justify-center rounded-xl bg-black/90 dark:bg-white p-4 py-3 mt-2 mx-2"
                  >
                    <Text className="text-white dark:text-black font-bold">
                      Aceptar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <View className="flex-row  mb-3 mt-5 justify-between">
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="flex-row mt-2 mx-2"
            >
              <Text className="text-black dark:text-white font-bold">
                <MaterialCommunityIcons
                  name="menu"
                  className="text-black/60 dark:text-white/70"
                  size={30}
                />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("EditarPerfil")}
              className="flex-row mt-2 mx-2"
            >
              <Text className="text-black dark:text-white font-bold">
                <MaterialCommunityIcons
                  name="account-edit" onPress={() => navigation.navigate("Change_profile_pic", { _id: User._id, })}
                  className="text-black/60 dark:text-white/70"
                  size={30}
                />
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex mb-2 justify-center items-center mt-3">
            <View className="flex-row mt-3 justify-center items-center">
              <TouchableOpacity
                className="w-4/12"
                onPress={() => setModalVisible2(true)}
              >
                <Image
                  source={{ uri: User.foto }}
                  className="w-24 h-24 rounded-full self-center"
                />
              </TouchableOpacity>

              <Modal
                visible={modalVisible2}
                onRequestClose={() => setModalVisible2(false)}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  activeOpacity={1}
                  onPress={() => setModalVisible2(false)}
                >
                  <Image
                    source={{ uri: User.foto }}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </Modal>
              <View className="w-8/12 ml-2">
                <Calificacion calificacion={User.calificacion} size={20} />
                <Text
                  numberOfLines={1}
                  className="text-2xl font-bold dark:text-white"
                >
                  {"" + User.nombre + " " + User.apellido + "  "}
                </Text>
                <Text numberOfLines={1} className=" dark:text-white">
                  {" " + User.email}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex mb-3 px-3 pb-5 border border-transparent border-b-zinc-300">
            <Text className="dark:text-white mt-2" onPress={handleAddressPress}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                className="text-black/60 dark:text-white/70"
                size={20}
              />{" "}
              <Text style={{}}> {User.direccion}</Text>  </Text>



            <TouchableOpacity onPress={handleWhatsAppOpen}>
              <Text className="dark:text-white mt-2">
                <MaterialCommunityIcons
                  name="whatsapp"
                  className="text-black/60 dark:text-white/70"
                  size={20}
                />
                {"  "}
                <Text style={{ color: 'green' }}>{User.telefono}</Text>
              </Text>
            </TouchableOpacity>



            <Text className="dark:text-white mt-2">
              <MaterialCommunityIcons
                name="account"
                className="text-black/60 dark:text-white/70"
                size={20}
              />
              {"  " + User.contacto}
            </Text>
          </View>

          <Text className="text-3xl font-bold dark:text-white self-center my-3">
            Mis publicaciones
          </Text>
          <View className="flex flex-col justify-center items-center mt-2 mb-3 bg-white dark:bg-white/10 rounded-xl p-1.5">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("AddProduct", {
                  _id: User._id,
                })
              }
              className="flex-row justify-between items-center w-full"
            >
              <View className="flex w-11/12 ml-2">
                <Text className="text-sm font-bold mb-1 dark:text-white">
                  Agregar publicación
                </Text>
              </View>
              <View className="flex w-1/12 mr-2">
                <Text className="text-sm font-bold mb-1 dark:text-white">
                  <MaterialCommunityIcons
                    name="plus-circle"
                    className="text-black/60 dark:text-white/70"
                    size={15}
                  />
                </Text>
              </View>
            </TouchableOpacity>
          </View>



          {publicaciones ? (
            <>
              {publicaciones.map((publicacion) => (
                <TouchableOpacity
                  key={publicacion._id}
                  className="flex flex-col justify-center items-center m-2 bg-white dark:bg-white/10 rounded-xl px-5 pb-5 pt-2 mb-10"
                >
                  <View className="flex justify-between items-center w-full">
                    <View className="flex w-full mb-3 items-center border-2 border-transparent border-b-zinc-700">
                      <Text className="text-sm font-bold mb-1 dark:text-white">
                        {publicacion.tipo}
                      </Text>
                    </View>

                    <View className="flex-row w-full">
                      <View className="flex w-8/12">
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
                      <View className="flex-row ml-8 w-4/12">
                        <TouchableOpacity
                          className="mr-2 mt-2"
                          onPress={() =>
                            navigation.navigate("EditProduct", {
                              _id: publicacion._id,
                            })
                          }
                        >
                          <Text className="text-black/60 dark:text-white/70">
                            <MaterialCommunityIcons name="pencil" size={30} />
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="mt-2"
                          onPress={() => {
                            Alert.alert(
                              "Eliminar publicación",
                              "¿Está seguro que desea eliminar esta publicación?",
                              [
                                {
                                  text: "Cancelar",
                                  onPress: () => console.log("Cancel Pressed"),
                                  style: "cancel",
                                },
                                {
                                  text: "Aceptar",
                                  onPress: () => {
                                    deletePublicacion(publicacion._id);
                                  },
                                },
                              ],
                              { cancelable: false }
                            );
                          }}
                        >
                          <Text className="text-black/60 dark:text-white/70">
                            <MaterialCommunityIcons name="delete" size={30} />
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View className="flex-row w12/12">
                      <View className="w-5/12">
                        <Image
                          source={{ uri: publicacion.foto }}
                          className="w-20 h-20 rounded-full mr-1 self-center mb-2"
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
                                <View key={p} className="flex-row items-center rounded-full bg-stone-200 dark:bg-stone-600 px-1 py-0.5">
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
                              <View key={p} className="flex-row items-center rounded-full bg-stone-200 dark:bg-stone-600 px-2 py-0.5">
                                <Text
                                  className={
                                    "text-sm font-semibold dark:text-zinc-300"
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
                  <View className="flex flex-row justify-center items-center w-full">
                    <Text
                      numberOfLines={5}
                      className="text-sm mt-1 dark:text-white"
                    >
                      {publicacion.contenido}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <Text
              className="text-2xl text-black/40 dark:text-white
                /40  self-center"
            >
              Sin publicaciones
            </Text>
          )}
        </ScrollView>
      ) : (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="flex flex-col justify-center items-center h-full w-full"
        />
      )}
    </>
  );
};

export default PerfilScreen;
