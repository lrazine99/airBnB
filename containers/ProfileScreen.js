import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function SettingsScreen({ setToken, userToken, userId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("dfb");
  const [username, setUsername] = useState("dfsgb");
  const [description, setDescription] = useState("ddddddddfb");
  const [avatar, setAvatar] = useState(null);
  const [avatarModified, setAvatarModified] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [inputModified, setInputModified] = useState(false);

  console.log("token>>", userToken, "id>>>", userId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/${userId}`,
          {
            headers: {
              authorization: `Bearer ${userToken}`,
            },
          }
        );

        console.log("data>>", data);

        setEmail(data.email);
        setDescription(data.description);
        setUsername(data.username);
        // === A MODIFIER PLUS TARD ========================================
        if (data.photo) {
          console.log("ajouter la photo", data.photo.url);
          setAvatar(data.photo.url);
        }
        // ===========================================
      } catch (error) {
        console.log("catch>>>", error.response);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const accessCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status === "granted") {
        const result = await ImagePicker.launchCameraAsync();

        if (!result.canceled) {
          console.log("result>>", result.assets[0].uri);
          setAvatar(result.assets[0].uri);
          setAvatarModified(true);
        } else {
          alert("caméra fermée");
        }
      } else {
        alert("access camera denied");
      }
    } catch (error) {
      console.log("catch camera>>>", error.response);
    }
  };

  const accessLibrary = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === "granted") {
        console.log("access autorisé");

        const result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
        });

        if (!result.canceled) {
          console.log("result>>>", result.assets[0].uri);
          setAvatar(result.assets[0].uri);
          setAvatarModified(true);
        } else {
          alert("Gallerie fermée");
        }
      } else {
        alert("access Library denied");
      }
    } catch (error) {
      console.log("catch Library>>>", error);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      if (avatarModified) {
        // console.log("avatar modifié");

        const extension = avatar.split(".").pop();

        const formData = new FormData();
        formData.append("photo", {
          uri: avatar,
          name: `my-pic.${extension}`,
          type: `image/${extension}`,
        });

        const { data } = await axios.put(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/upload_picture",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: `Bearer ${userToken}`,
            },
          }
        );

        console.log("data>>>", data);
        setAvatar(data.photo.url);
      } else {
        console.log("avatar non modifié");
      }
      // ---------------------------------------
      if (inputModified) {
        console.log("modifié");

        const { data } = await axios.put(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/update",
          {
            email,
            description,
            username,
          },
          {
            headers: {
              authorization: `Bearer ${userToken}`,
            },
          }
        );
        console.log("data input>>", data);

        setEmail(data.email);
        setDescription(data.description);
        setUsername(data.username);

        if (data.photo) {
          setAvatar(data.photo.url);
        }
      } else {
        console.log("no modification");
      }
    } catch (error) {
      console.log("catch update>>>", error.response);
    }
    setIsUpdating(false);
  };

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <View style={styles.container}>
      <View style={styles.firstPart}>
        <View style={styles.avatarBloc}>
          {avatar ? (
            <Image
              source={{
                uri: avatar,
              }}
              // resizeMode="contain"
              style={styles.avatar}
            />
          ) : (
            <Text>No avatar</Text>
          )}
        </View>

        <View>
          <MaterialIcons
            name="add-a-photo"
            size={24}
            color="black"
            onPress={accessCamera}
          />
          <MaterialIcons
            name="add-photo-alternate"
            size={24}
            color="black"
            onPress={accessLibrary}
          />
        </View>
      </View>

      <TextInput
        style={styles.textInput}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setInputModified(true);
        }}
      />
      <TextInput
        style={styles.textInput}
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          setInputModified(true);
        }}
      />
      <TextInput
        style={[styles.textInput, styles.multiline]}
        value={description}
        multiline
        onChangeText={(text) => {
          setDescription(text);
          setInputModified(true);
        }}
      />

      {isUpdating ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text>Update</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setToken(null, null);
        }}
      >
        <Text>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  button: {
    borderWidth: 1,
    borderColor: "coral",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
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
  avatarBloc: {
    // borderWidth: 1,
    width: 150,
    height: 150,
    // borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  firstPart: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
    borderWidth: 1,
  },
});
