import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet, StatusBar } from "react-native";
import { Avatar, Card, IconButton } from "react-native-paper";
import { getPokemonIdFromURL } from "../../functions/generalFunctions";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import colors from "../../app/colors";

const PokemonCard = ({ item }) => {
  const navigation = useNavigation();

  const id = getPokemonIdFromURL(item.url);
  const imageURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <Card
      style={styles.item}
      onPress={() => navigation.navigate("Details", item)}
    >
      <View
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Avatar.Image
          style={{ backgroundColor: "transparent" }}
          size={56}
          source={{ uri: imageURL }}
        />

        <Text style={styles.title}>{item.name}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 8,
    marginHorizontal: 22,
    backgroundColor: colors.backGroundSurface,
    borderRadius: 16,
  },
  title: {
    fontSize: 28,
    paddingHorizontal: 10,
    color: colors.primaryTextColor,
  },
});

export default PokemonCard;
