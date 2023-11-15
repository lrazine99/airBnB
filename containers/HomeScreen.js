import { useNavigation } from "@react-navigation/core";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";

import { displayStars } from "../utils/displayStars";

export default function HomeScreen() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms"
        );

        // console.log("data>>>", data);

        setRooms(data);
      } catch (error) {
        console.log("catch>>>", error.response);
      }
      setisLoading(false);
    };
    fetchData();
  }, []);

  return isLoading ? (
    <ActivityIndicator size="large" />
  ) : (
    <View>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate("Room", { id: item._id })}
            >
              <ImageBackground
                source={{ uri: item.photos[0].url }}
                style={styles.imageBg}
              >
                <View style={styles.priceBloc}>
                  <Text style={styles.price}>{item.price} €</Text>
                </View>
              </ImageBackground>

              <View style={styles.descBloc}>
                <View>
                  <Text>{item.title}</Text>
                  {/* La fonction displayStars vient du fichier du même nom qui se trouve dans le dossier "utils" */}
                  <Text>{displayStars(item.ratingValue)}</Text>
                  <Text>{item.reviews} reviews</Text>
                </View>

                <Image
                  source={{ uri: item.user.account.photo.url }}
                  style={styles.avatar}
                />
              </View>
            </TouchableOpacity>
          );
        }}
        style={styles.flatlist}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flatlist: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  imageBg: {
    width: "100%",
    height: 250,
    justifyContent: "flex-end",
  },
  priceBloc: {
    backgroundColor: "black",
    height: 40,
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  price: {
    color: "white",
    fontWeight: "bold",
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  descBloc: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
});
