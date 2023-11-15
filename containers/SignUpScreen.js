import {
  Text,
  TextInput,
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import axios from "axios";

export default function SignUpScreen({ setToken, navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    // console.log({ email, username, description, password, confirmPassword });
    if (email && username && description && password && confirmPassword) {
      if (password === confirmPassword) {
        try {
          const { data } = await axios.post(
            "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/sign_up",
            { email, username, description, password }
          );

          console.log("response>>", data);
          setToken(data.token, data.id);
        } catch (error) {
          console.log("catch>>", error.response.data);
          setErrorMessage("error occured");
        }
      } else {
        setErrorMessage("different password");
      }
    } else {
      setErrorMessage("missing information");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Image source={require("../assets/logo.png")} style={styles.logo} />

      <Text style={styles.title}>Sign up</Text>

      <TextInput
        value={email}
        placeholder="email"
        style={styles.textInput}
        onChangeText={(text) => {
          // réinitialisation du message d'erreur dès que l'utilisateur change la valeur de l'input
          setErrorMessage("");
          setEmail(text);
        }}
      />
      <TextInput
        value={username}
        placeholder="username"
        style={styles.textInput}
        onChangeText={(text) => {
          setErrorMessage("");
          setUsername(text);
        }}
      />
      <TextInput
        value={description}
        placeholder="description"
        multiline
        style={[styles.textInput, styles.multiline]}
        onChangeText={(text) => {
          setDescription(text);
        }}
      />
      <TextInput
        value={password}
        placeholder="password"
        style={styles.textInput}
        secureTextEntry
        onChangeText={(text) => {
          setErrorMessage("");
          setPassword(text);
        }}
      />
      <TextInput
        value={confirmPassword}
        placeholder="confirmPassword"
        style={styles.textInput}
        secureTextEntry
        onChangeText={(text) => {
          setErrorMessage("");
          setConfirmPassword(text);
        }}
      />
      {/* Affichage du message d'erreur */}
      {errorMessage && <Text>{errorMessage}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.textButton}>Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.link}
        onPress={() => {
          navigation.navigate("SignIn");
        }}
      >
        <Text style={styles.textLink}>Go to SignIn</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    alignItems: "center",
  },
  logo: {
    width: 130,
    height: 150,
    resizeMode: "contain",
    marginTop: 70,
  },
  title: {
    fontSize: 30,
    color: "grey",
    fontWeight: "bold",
    marginVertical: 20,
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: "coral",
    width: "80%",
    // height: 35,
    paddingBottom: 3,
    marginVertical: 20,
  },
  multiline: {
    borderWidth: 1,
    height: 100,
  },
  button: {
    borderWidth: 1,
    borderColor: "coral",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
  },
  textButton: {
    color: "gray",
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
  },
  textLink: {
    color: "grey",
  },
});
