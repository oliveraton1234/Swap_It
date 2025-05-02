import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  RefreshControl,
  Modal,
  Alert,
  Linking
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { useRoute } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useColorScheme } from "nativewind";
import Calificacion from "../Resourses/Calificacion";
import { ServerHost } from "../../ServerHost";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../AuthContext";

const ProductsScreen2 = (props) => {
  const route = useRoute();
  const navigation = useNavigation();
  const _id = route.params._id;
  
  const [publicacion, setPublicacion] = useState(null);
  const [comentarios, setComentarios] = useState(null);
  const { isUser } = useContext(AuthContext);
  const [lastCommentTime, setLastCommentTime] = useState(new Date());
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [idUsuario, setIdUsuario] = useState("Sin usuario");
  const [uriLink, setUriLink] = useState(
    "https://scontent.foax1-1.fna.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=106&ccb=1-7&_nc_sid=c6021c&_nc_eui2=AeHRCG_9TRy9dX-Hm35n5nSiso2H55p0AlGyjYfnmnQCUbg31lqjTm2yCfT8j7X3uJ0hr1l-bogaiVyxaGQqK_M0&_nc_ohc=102P-6BNVGYAX_i5QuB&_nc_ht=scontent.foax1-1.fna&oh=00_AfA6APGIrvxYjRvtN6XI9FkUva_4Ls1XtV5WN_wKuQFEIA&oe=64555138"
  );
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    if (isUser) {
      setUriLink(isUser.foto);
      setIdUsuario(isUser._id);
    }
    fetch(`http://${SERVER_HOST}/api/publicaciones/info/${_id}`)
      .then((response) => response.json())
      .then((data) => setPublicacion(data))
      .catch((error) => console.error(error));
  }, [_id]);

  async function reloadData() {
    fetch(`http://${SERVER_HOST}/api/publicaciones/info/${_id}`)
      .then((response) => response.json())
      .then((data) => setPublicacion(data))
      .catch((error) => console.error(error));
  }

  async function handleDelete(_id) {
    try {
      fetch(`http://${SERVER_HOST}/api/comentarios/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      reloadData();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  /////////////////Funcion de limite de reportes por dia - INICIO -///////////////////////

  async function handleReport() {

    if (isUser) {
      const publicacionId = _id;
      const userId = isUser._id;

      try {
        const response = await fetch(`http://${SERVER_HOST}/api/publicaciones/reportPost`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ publicacionId, userId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message);
          console.log(errorData);
          return;
        }

        const reportData = await response.json();
        alert("Servicio reportado con éxito");
      } catch (error) {
        alert("Error al reportar servicio: " + error.message);
        console.error(error);
      }
    }
    else {
      alert("Inicia sesión para reportar publicaciones");
    }
  }

  /////////////////Funcion de limite de reportes por dia - FIN- ///////////////////////

  async function handleComent() {
    if (isUser) {
      try {
        // Verificar si el usuario ha alcanzado el límite de comentarios por cada 10 minutos
        const currentTime = new Date();
        const timeDifference =
          currentTime.getTime() - lastCommentTime.getTime();
        const minutesDifference = Math.floor(timeDifference / 1000 / 60);
        if (minutesDifference < 10 && commentsCount >= 3) {
          Alert.alert(
            "Limite de comentarios alcanzado",
            "Solo puedes hacer 3 comentarios cada 10 minutos"
          );
          return;
        }

        const response = await fetch(
          `http://${SERVER_HOST}/api/comentarios`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contenido: comentarios,
              publicacion: _id,
              autor: isUser._id,
            }),
          }
        );
        const json = await response.json();

        // Actualizar la variable lastCommentTime con la hora actual
        setLastCommentTime(new Date());
        setCommentsCount(commentsCount + 1); // Incrementar la cuenta de comentarios del usuario

        Alert.alert("Comentario enviado");
        reloadData();
      } catch (error) {
        console.error(error);
      }
    } else {
      Alert.alert(
        "Debes iniciar sesión para comentar",
        "Crea una cuenta o inicia sesión en 'Perfil' para distrutar de Swapit"
      );
    }
  }
  const [showReportText, setShowReportText] = useState(false);

  const toggleReportText = () => {
    setShowReportText(!showReportText);
  };

  ////////////////////////////////////////////////////////////////////
  //Reportar comentario

  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  const toggleReportModal = () => {
    setReportModalVisible(!reportModalVisible);
  };

  async function handleReportComment() {
    if (isUser) {
      const userId = isUser._id;
      const comentarioId = selectedCommentId;

      try {
        const response = await fetch(`http://${SERVER_HOST}/api/comentarios/reportes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comentarioId, userId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message);
          return;
        }

        const reportData = await response.json();

        Alert.alert("Reporte enviado", "El comentario ha sido reportado");
      } catch (error) {
        console.error(error);
      }
    } else {
      Alert.alert(
        "Debes iniciar sesión para comentar",
        "Crea una cuenta o inicia sesión en 'Perfil' para distrutar de Swapit"
      );
    }
  }

  //////////////////////////////////////////////////////////////////

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const [mensaje, setMensaje] = useState('');


  const enviarWhatsApp = () => {
    const mensajeWhatsApp = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=+52${publicacion.autor.telefono}&text=‼️Swap It‼️\n ${mensajeWhatsApp+ "\n\n "+ publicacion.publicacion.titulo+ " "+ publicacion.publicacion.contenido}`;

    Linking.openURL(urlWhatsApp);
  };

  return (
    <SafeAreaView className="flex-1 justify-center bg-white dark:bg-zinc-900">
      <View className="flex-row bg-white dark:bg-zinc-900 justify-between pb-1">
        <TouchableOpacity onPress={() => navigation.goBack()} className='mx-5 mt-2'>
          <Text className="dark:text-white self-center">
            <MaterialCommunityIcons name="chevron-left" size={35} />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} className='mx-5 pt-1 my-2'>
          <Text className="dark:text-white self-center">
            <MaterialCommunityIcons name="comment-alert-outline" size={25} />
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className={" bg-white dark:bg-zinc-900"}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {!publicacion ? (
          <View className="flex justify-center items-center w-screen h-screen dark:bg-zinc-900 ">
            <ActivityIndicator size="large" className="mb-60" />
          </View>
        ) : (
          <>
            <View className="bg-black w-full">
              <Image
                source={{ uri: publicacion.publicacion.foto }}
                className="w-full h-96"
                style={{ resizeMode: "contain" }}
              />
              <View className="p-5 rounded-t-3xl bg-white dark:bg-zinc-900">
                <TouchableOpacity
                  className="flex-row mb-3"
                  onPress={() =>
                    navigation.navigate("Profile", {
                      _id: publicacion.autor._id,
                    })
                  }
                >
                  <Image
                    source={{ uri: publicacion.autor.foto }}
                    className="w-8 h-8 rounded-full mr-1"
                  />
                  <View className="flex">
                    <Text
                      className={
                        "text-sm font-bold dark:text-white justify-center"
                      }
                    >
                      {" " +
                        publicacion.autor.nombre +
                        publicacion.autor.apellido +
                        " "}
                      <MaterialCommunityIcons
                        name="check-decagram"
                        className="text-black/60 dark:text-white/70"
                        size={12}
                      />
                    </Text>
                    <Calificacion
                      calificacion={publicacion.autor.calificacion}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={toggleReportText}
                    style={{ marginLeft: "auto" }}
                  >
                    <Text className="text-black/60 dark:text-white/70">
                      <MaterialCommunityIcons name="dots-vertical" size={20} />
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={showReportText}
                  onRequestClose={toggleReportText}
                >
                  <View
                    className="flex-1 justify-center items-center"
                  >
                    <View
                      className="bg-white dark:bg-zinc-800 w-4/5 p-5 rounded-lg "
                    >
                      <TouchableOpacity onPress={handleReport}>
                        <View
                          className="text-black/60  dark:text-white/70 flex flex-row content-center"
                        >
                          <Text className="text-black/60 dark:text-white/70 mt-1 mr-2">
                            <MaterialCommunityIcons
                              name="alert-octagon"
                              size={25}
                              className="mr-5"
                            />
                          </Text>

                          <Text className="text-red-600 mt-2">
                            Denunciar Servicio
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={toggleReportText}
                        className="self-end mt-5"
                      >
                        <Text className="text-black/60 dark:text-white/70">
                          Cerrar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>

                <Text className={"text-3xl font-bold dark:text-white"}>
                  {publicacion.publicacion.titulo}
                </Text>
                <Text className={"text-sm font-bold dark:text-white"}>
                  {publicacion.publicacion.categoria}
                </Text>

                <Text
                  numberOfLines={8}
                  className={"text-base text-black/60 dark:text-white/70 mt-2"}
                >
                  {publicacion.publicacion.contenido}
                </Text>

                <View className="mt-1">
                  <Text className="text-black/60 dark:text-white/70">
                    <MaterialCommunityIcons
                      name="account-sync"
                      className="text-black/60 dark:text-white/70"
                      size={26}
                    />{" "}
                    Intercambio por:
                  </Text>
                  <View
                    style={{ flexDirection: "row", flexWrap: "wrap" }}
                    className="mt-1"
                  >
                    {publicacion.publicacion.precio.slice(0, 6).map((p) => (
                      <View style={{ marginVertical: 5 }} key={p}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#E5E7EB",
                            borderRadius: 999,
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            marginStart: 4,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "600",
                              color: "#374151",
                            }}
                          >
                            {p}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                <View className="bg-emerald-800/80 shadow-2xl mt-5 mb-2 p-4 dark:bg-black rounded-3xl">
      <Text className="text-white dark:text-emerald-400 font-bold px-2 mb-2">Enviar Mensaje</Text>
      <View className="flex-row items-center">
        <TextInput
          className="py-2 px-5 bg-gray-200 text-gray-500 shadow-2xl w-[250px] dark:text-white dark:border-gray-800 rounded-3xl pr-10"
          placeholder="Coloque su mensaje"
          value={mensaje}
          onChangeText={setMensaje}
        />
        <TouchableOpacity className="bg-gray-200 py-2 px-4 rounded-3xl ml-2" onPress={enviarWhatsApp}>
          <Text className="text-gray-600 font-bold">Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>

    <Text className="my-3 text-xl font-bold  dark:text-white">
                  Comentarios
                </Text>
                <View className="flex-row justify-center items-center">
                  <Image
                    source={{ uri: uriLink }}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  <TextInput
                    placeholder="Deja un comentario"
                    name="nombre"
                    className="dark:bg-white bg-gray-200 rounded-lg p-3 w-60 "
                    onChangeText={(text) => setComentarios(text)}
                  />
                  <TouchableOpacity
                    className="flex-row justify-center rounded-full bg-black/90 dark:bg-white/50 p-2 w-8 ml-2"
                    onPress={handleComent}
                  >
                    <MaterialCommunityIcons
                      name="send"
                      color={isUser ? "#fff" : "#AAA"}
                      size={18}
                    />
                  </TouchableOpacity>
                </View>

                <View className="mt-5 shadow-xl bg-gray-200/80 p-3 rounded-xl">
                  {publicacion.comentarios.map((comentario) => (
                    <TouchableOpacity
                      key={comentario._id}
                      onPress={() =>
                        navigation.navigate("Profile", {
                          _id: comentario.autor._id,
                        })
                      }
                    >
                      <View className="flex-row mb-4" key={comentario._id}>
                        <Image
                          source={{ uri: comentario.autor.foto }}
                          className="w-8 h-8 rounded-full mr-1"
                        />
                        <View style={{ flex: 1 }}>
                          <Text
                            className={
                              "text-sm font-bold dark:text-white justify-center"
                            }
                          >
                            {" " +
                              comentario.autor.nombre +
                              comentario.autor.apellido +
                              "  "}
                          </Text>
                          <Text className="text-[9px] italic dark:text-white px-1">
                          {new Date(comentario.createdAt).toLocaleString('es-ES', { year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric' })}
                          </Text>
                          <Text className="dark:text-white">
                            {" "}
                            {comentario.contenido}
                          </Text>
                        </View>

                        <View style={{ flexDirection: "row" }}>
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedCommentId(comentario._id);
                              toggleReportModal();
                            }}
                          >
                            <Text className="text-black/60 dark:text-white/70">
                              <MaterialCommunityIcons
                                name="dots-horizontal"
                                size={20}
                              />
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              handleDelete(comentario._id);
                            }}
                          >
                            {comentario.autor._id === idUsuario && (
                              <MaterialCommunityIcons
                                name="delete"
                                color={"#c00"}
                                size={20}
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={reportModalVisible}
                    onRequestClose={toggleReportModal}
                  >
                    <View className="flex flex-1 justify-center items-center mt-2.5">
                      <View
                        className="bg-white m-2.5 rounded-2xl p-9 items-center shadow-md dark:bg-zinc-800 "
                      >
                        <TouchableOpacity
                          onPress={() => handleReportComment()}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text className="text-black/60 dark:text-white/70 mr-2">
                              <MaterialCommunityIcons
                                name="alert-octagon"
                                size={25}
                                style={{ marginRight: 5, marginTop: 5 }}
                              />
                            </Text>

                            <Text className="text-red-500">
                              Denunciar comentario
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ alignSelf: "flex-end", marginTop: 10 }}
                          onPress={toggleReportModal}>
                          <Text className="text-black/60 pt-1 dark:text-white/70 ">
                            Cerrar
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductsScreen2;
