import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import axios from "axios";

const AroundMe = ({ navigation }) => {
  const [coordinate, setCoordinate] = useState([48.8564449, 2.3522219]);
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const getPermissionAndLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        let latitude = "";
        let longitude = "";

        if (status === "granted") {
          const { coords } = await Location.getCurrentPositionAsync();
          setCoordinate([coords.latitude, coords.longitude]);
          // console.log("result>>>", result);
          latitude = coords.latitude;
          longitude = coords.longitude;

          // const { data } = await axios.get(
          //   `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/around?latitude=${latitude}&longitude=${longitude}`
          // );

          // console.log("data>>>", data.length);

          // setRooms(data);
        } else {
          // const { data } = await axios.get(
          //   `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/around?latitude=${""}&longitude=${""}`
          // );

          // console.log("data>>>", data.length);

          // setRooms(data);

          alert("Permission refusée");
        }

        const { data } = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/around?latitude=${latitude}&longitude=${longitude}`
        );

        // console.log("data>>>", data);

        setRooms(data);
      } catch (error) {
        console.log("catch>>", error);
      }
      setIsLoading(false);
    };

    getPermissionAndLocation();
  }, []);

  return isLoading ? (
    <ActivityIndicator size="large" />
  ) : (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: coordinate[0],
        longitude: coordinate[1],
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      }}
      showsUserLocation={true}
    >
      {rooms.map((room) => {
        console.log("id>>", room._id);
        return (
          <Marker
            onPress={() => navigation.navigate("Room", { id: room._id })}
            key={room._id}
            coordinate={{
              latitude: room.location[1],
              longitude: room.location[0],
            }}
          />
        );
      })}
    </MapView>
  );
};

export default AroundMe;

const styles = StyleSheet.create({
  map: { flex: 1 },
});
