// import { useRoute } from "@react-navigation/core";
import {
  Text,
  View,
  ImageBackground,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { displayStars } from "../utils/displayStars";
import MapView, { Marker } from "react-native-maps";

export default function ProfileScreen({ route }) {
  const { id } = route.params;
  const [room, setRoom] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [displayMore, setDisplayMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/${id}`
        );

        console.log("data room>>>>", data);
        setRoom(data);
      } catch (error) {
        console.log("catch>>>", error.response);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  return isLoading ? (
    <ActivityIndicator size="large" />
  ) : (
    <View>
      <ImageBackground
        source={{ uri: room.photos[0].url }}
        style={styles.imageBg}
      >
        <View style={styles.priceBloc}>
          <Text style={styles.price}>{room.price} €</Text>
        </View>
      </ImageBackground>

      <View style={styles.descBloc}>
        <View>
          {/* Pour afficher/cacher le text qui dépasse, on peut changer la valeur de numberOfLines={0} (0 est la valeur par défaut) en fonction d'un state. */}
          <Text> {room.title}</Text>
          {/* La fonction displayStars vient du fichier du même nom qui se trouve dans le dossier "utils" */}
          <Text>{displayStars(room.ratingValue)}</Text>
          <Text>{room.reviews} reviews</Text>
        </View>

        <Image
          source={{ uri: room.user.account.photo.url }}
          style={styles.avatar}
        />
      </View>

      {/* Afficher 3 ou toutes les ligne au clic sur le bouton "showMore" */}
      <Text numberOfLines={displayMore ? 0 : 3}>{room.description}</Text>

      <TouchableOpacity
        onPress={() => {
          setDisplayMore(!displayMore);
        }}
      >
        {/* Changement du texte selon sa visibilité actuelle */}
        {displayMore ? <Text>ShowLess</Text> : <Text>ShowMore</Text>}
      </TouchableOpacity>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: room.location[1],
          longitude: room.location[0],
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        <Marker
          coordinate={{
            latitude: room.location[1],
            longitude: room.location[0],
          }}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  map: {
    marginTop: 20,
    width: "100%",
    height: 250,
  },
});
