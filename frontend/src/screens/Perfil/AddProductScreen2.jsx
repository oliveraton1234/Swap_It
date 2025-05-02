import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Progress from "react-native-progress";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { initializeApp } from "@firebase/app";
import { firebaseConfig } from "../../firebase.config";
import SERVER_HOST from '../../ServerHost'

const AddProductScreen2 = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const _id = route.params._id;
  const tipo = route.params.tipo;
  const categoria = route.params.categoria;
  const titulo = route.params.titulo;
  const contenido = route.params.contenido;
  const image = route.params.image;
  const precio = route.params.precio;

  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  function handleSubmit(downloadURL) {
    // Petici+on post a la API
    fetch(`http://${SERVER_HOST}/api/publicaciones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipo: tipo,
        titulo: titulo,
        contenido: contenido,
        foto: downloadURL,
        categoria: categoria,
        precio: precio,
        autor: _id,
      }),
    }).then(() => {
        
    });
  }

  // This function is triggered when the "Upload image" button pressed
  const uploadImage = async () => {
    // Convert image into blob image
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });

    const file = new Blob([blob], { type: "image/jpeg" });

    //set the metadata of the image
    const metadata = {
      contentType: "image/jpeg",
    };

    setUploading(true);
    setTransferred(0);

    // Upload the image to Firebase Storage
    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, "publicaciones/" + _id + "/" + Date.now());
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        setTransferred(
          Math.ceil((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        );
        const progress = Math.ceil(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setUploading(false);
          handleSubmit(downloadURL);
          Alert.alert(
            "Publicación creada!",
            "Tu publicación ya es visible para todos en Swapit!"
          );
          navigation.navigate("Profile", { _id: _id });
        });
      }
    );
  };

  return (
    <SafeAreaView className={"flex-1 justify-center bg-white dark:bg-black"}>
      <View>
        <View className="flex-row w-12/12 pb-3 dark:bg-black justify-center items-center">
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            className="w-3/12"
          >
            <Text className="mr-1 mt-2 font-bold text-center text-gray-700 dark:text-white">
              <MaterialCommunityIcons name="arrow-left" size={26} />
            </Text>
          </TouchableOpacity>
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
              2 de 2
            </Text>
          </View>
          <View className="flex-1 w-6/12 border-4 border-transparent border-t-blue-700" />
        </View>
      </View>
      <ScrollView className={" bg-white dark:bg-black"}>
        <View className="flex self-start justify-center ml-3 mt-8">
          <Text className="text-2xl font-bold text-gray-700 dark:text-white mb-2">
            Revisa tu publicación
          </Text>
        </View>
        <View className="flex p-5 border m-5 border-slate-300 dark:border-zinc-700 rounded-xl	">
          <View className="bg-black w-full">
            <View className="flex-row bg-white dark:bg-black pb-5">
              <Text className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
                Esta es una vista previa de tu publicación, revisa que todo esté
                en orden y luego presiona el botón de "Publicar"
              </Text>
            </View>

            <Image
              source={{ uri: image }}
              className="w-full h-72"
              style={{ resizeMode: "contain" }}
            />
            <View className="p-5 rounded-t-3xl bg-white dark:bg-zinc-900">
              <View className="flex-row mb-3">
                <Image
                  source={{
                    uri: "https://scontent.foax1-1.fna.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=106&ccb=1-7&_nc_sid=c6021c&_nc_eui2=AeHRCG_9TRy9dX-Hm35n5nSiso2H55p0AlGyjYfnmnQCUbg31lqjTm2yCfT8j7X3uJ0hr1l-bogaiVyxaGQqK_M0&_nc_ohc=102P-6BNVGYAX_i5QuB&_nc_ht=scontent.foax1-1.fna&oh=00_AfA6APGIrvxYjRvtN6XI9FkUva_4Ls1XtV5WN_wKuQFEIA&oe=64555138",
                  }}
                  className="w-8 h-8 rounded-full mr-1"
                />
                <View className="flex">
                  <Text
                    className={
                      "text-sm font-bold dark:text-white justify-center"
                    }
                  >
                    {" Nombre Apellido "}
                    <MaterialCommunityIcons
                      name="check-decagram"
                      className="text-black/60 dark:text-white/70"
                      size={12}
                    />
                  </Text>
                </View>
              </View>

              <Text className={"text-3xl font-bold dark:text-white"}>
                {titulo}
              </Text>
              <Text className={"text-sm font-bold dark:text-white"}>
                {categoria}
              </Text>

              <Text
                numberOfLines={8}
                className={"text-base text-black/60 dark:text-white/70 mt-2"}
              >
                {contenido}
              </Text>
              <View className="mt-2">
                <Text className="text-black/60 dark:text-white/70">
                  <MaterialCommunityIcons
                    name="account-sync"
                    className="text-black/60 dark:text-white/70"
                    size={26}
                  />{" "}
                  Intercambio por:
                </Text>
                <Text
                  className={
                    "text-sm text-black/60 dark:text-white/70 pt-1 mx-1 mt-2"
                  }
                >
                  <View style={{ flexWrap: "wrap" }} className="mt-5 flex-row">
                    {precio.slice(0, 6).map((p) => (
                      <View key={p}>
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
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="flex self-center justify-center items-center">
          {uploading ? (
            <View className="flex w-12/12 justify-center mb-8">
              <Text className="text-lg font-semibold text-gray-700 dark:text-white">
                Subiendo...
              </Text>
              <Progress.Bar progress={transferred} width={300} />
            </View>
          ) : (
            <TouchableOpacity
              onPress={uploadImage}
              className="flex-row w-12/12 justify-center py-2 bg-zinc-300 dark:bg-zinc-800 rounded-xl mb-10"
              style={{ width: 300 }}
            >
              <Text className="text-lg font-semibold text-gray-700 dark:text-white">
                Publicar
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProductScreen2;
