import React, { useState, useContext, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Alert,
  Switch,
  TouchableOpacity,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { initializeApp } from "@firebase/app";
import { firebaseConfig } from "../../firebase.config";
import { AuthContext } from "../../AuthContext";
import { useColorScheme } from "nativewind";
import { useNavigation } from "@react-navigation/native";
import SERVER_HOST from "../../ServerHost";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const LoginScreen = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const navigation = useNavigation();

  const [registro, setRegistro] = useState(false);
  const { setUser } = useContext(AuthContext);
  const { isUser } = useContext(AuthContext);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  //Constructor para usuario default
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState({ text: "", valid: true, error: "" });
  const [password, setPassword] = useState({
    text: "",
    valid: true,
    error: "",
  });

  const [direccion, setDireccion] = useState("");

  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email.text, password.text)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        Alert.alert(
          `Bienvenido a Swapit!`,
          `Hola ${nombre.text}, ahora puedes usar Swapit para intercambiar artículos y servicios con tus compañeros universitarios, a continuación inicia sesión`
        );
        setRegistro(!registro);
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  };
  //Función para guardar los datos del usuario en mongo
  const guardarData = async (e) => {
    try {
      //Enviar una solicitud POST para guardar los datos en la base de datos
      fetch(`http://${SERVER_HOST}/api/usuarios`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre.text,
          apellido: apellido.text,
          telefono: telefono.text,
          email: email.text,
          direccion: direccion.text,
          contacto: "Sin asignar",
          foto: "https://i.pinimg.com/736x/58/51/2e/58512eb4e598b5ea4e2414e3c115bef9.jpg",
          calificacion: 0,
          reportes: 0,
          estatus: 1,
        }),
      });
      handleCreateAccount();
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const handleLogin = () => {
    if (userAuthenticated) {
      // El usuario ya está autenticado
      CargarDatos(); // Cargar los datos del usuario si es necesario

      console.log("El usuario ya está autenticado");
      return;
    }

    if (email.text === "" || password.text === "") {
      setEmail({
        ...email,
        valid: false,
        error: "Por favor, ingresa el correo electrónico.",
      });
      setPassword({
        ...password,
        valid: false,
        error: "Por favor, ingresa la contraseña.",
      });
      return;
    }

    signInWithEmailAndPassword(auth, email.text, password.text)
      .then(() => {
        CargarDatos();
        console.log("Inicio de sesión exitoso");
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          setEmail({
            ...email,
            valid: false,
            error: "El correo electrónico no está registrado.",
          });
        } else if (error.code === "auth/wrong-password") {
          setPassword({
            ...password,
            valid: false,
            error: "La contraseña es incorrecta.",
          });
        } else {
          setEmail({
            ...email,
            valid: false,
            error: "Error al iniciar sesión.",
          });
          setPassword({
            ...password,
            valid: false,
            error: "Error al iniciar sesión.",
          });
        }
      });
  };

  //Cargar datos del usuario a todos los componentes
  async function CargarDatos() {
    try {
      const campoBuscado = email.text; //Correo del usuario
      fetch(`http://${SERVER_HOST}/api/usuarios/get/${campoBuscado}`, {
        headers: {
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          Alert.alert(
            "Bienvenido a Swapit!",
            `Hola ${data.nombre}, ahora puedes usar Swapit para intercambiar artículos y servicios con tus compañeros universitarios.`
          );
          navigation.navigate("Profile", {
            _id: data._id,
          });
        });
    } catch (e) {
      Alert.alert(e.message);
    }
  }
  const [userAuthenticated, setUserAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserAuthenticated(true);
      } else {
        setUserAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container} className="bg-white dark:bg-black">
      <Switch
        value={colorScheme === "dark"}
        onChange={toggleColorScheme}
        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
      />

      {registro ? (
        <View className="bg-gray-500/20  p-10 dark:bg-gray-200/20 rounded-xl ">
          <Text className="text-3xl font-bold  item-center mb-5  dark:text-white text-center">
            Se parte de Swapit
          </Text>

          <TextInput
            placeholder="Correo electrónico"
            name="email"
            onChangeText={(text) => setEmail({ text })}
            className="dark:bg-white bg-gray-800/20 text-white font-bold"
            style={styles.input}
            textContentType="emailAddress"
          />
          <TextInput
            placeholder="Contraseña"
            name="password"
            onChangeText={(text) => setPassword({ text })}
            style={styles.input}
            className="dark:bg-white bg-gray-800/20 text-white font-bold"
            textContentType="password"
          />
          <TextInput
            placeholder="Nombre"
            name="nombre"
            onChangeText={(text) => setNombre({ text })}
            className="dark:bg-white bg-gray-800/20 text-white font-bold"
            style={styles.input}
          />
          <TextInput
            placeholder="Apellido"
            name="apellido"
            onChangeText={(text) => setApellido({ text })}
            className="dark:bg-white bg-gray-800/20 text-white font-bold"
            style={styles.input}
          />
          <TextInput
            placeholder="Telefono"
            name="telefono"
            onChangeText={(text) => setTelefono({ text })}
            className="dark:bg-white bg-gray-800/20 text-white font-bold"
            style={styles.input}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Institución educativa"
            name="direccion"
            onChangeText={(text) => setDireccion({ text })}
            className="dark:bg-white bg-gray-800/20 text-white font-bold"
            style={styles.input}
          />

          <View className="">
            <TouchableOpacity
              style={{
                marginTop: 5,
                backgroundColor: colorScheme === "dark" ? "green" : "green",
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
              }}
              onPress={guardarData}
            >
              <Text style={{ color: "white" }}>Registrarme</Text>
            </TouchableOpacity>
          </View>

          <Text className="dark:text-white text-center mt-3 ">
            Ya tienes cuenta?{" "}
            <Text
              onPress={() => {
                setRegistro(!registro);
              }}
              className="text-green-700 "
            >
              Inicia sesión
            </Text>{" "}
          </Text>
        </View>
      ) : (
        <View className="bg-gray-500/20  p-10 dark:bg-gray-200/20 rounded-xl ">
          <Text className="text-4xl font-bold  item-center mb-5  dark:text-white text-center">
            Iniciar sesión
          </Text>
          <TextInput
            onChangeText={(text) => setEmail({ text, valid: true, error: "" })}
            style={[styles.input, !email.valid && { borderColor: "red" }]}
            placeholder="Correo electrónico"
            className="dark:bg-white bg-gray-800/20 text-white font-bold"
            keyboardType="email-address"
          />
          {!email.valid && <Text style={styles.errorText}>{email.error}</Text>}
          <TextInput
            onChangeText={(text) =>
              setPassword({ text, valid: true, error: "" })
            }
            style={[styles.input, !password.valid && { borderColor: "red" }]}
            placeholder="Contraseña"
            className="dark:bg-white bg-gray-800/20 animate-pulse text-white font-bold"
            secureTextEntry
          />
          {!password.valid && (
            <Text style={styles.errorText}>{password.error}</Text>
          )}

          <View className="">
            <TouchableOpacity
              style={{
                marginTop: 5,
                backgroundColor: colorScheme === "dark" ? "green" : "green",
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
              }}
              onPress={handleLogin}
            >
              <Text style={{ color: "white" }}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>

          <Text className="mt-3 dark:text-white text-center">
            No tienes cuenta?{" "}
            <Text
              onPress={() => {
                setRegistro(!registro);
              }}
              className="text-green-700 mt-5"
            >
              Regístrate
            </Text>{" "}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    marginVertical: 10,
    minWidth: "80%",
    },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default LoginScreen;
