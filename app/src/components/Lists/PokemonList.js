import { StyleSheet, StatusBar, FlatList, View } from "react-native";
import PokemonCard from "../Cards/PokemonCard";
import { Text } from "react-native-paper";
import colors from "../../app/colors";

const PokemonsList = ({ data, bottomPagination, isFetching, refetch }) => {
  const renderItem = ({ item }) => <PokemonCard item={item} key={item.name} />;

  const headerComponent = (
    <View style={{ marginHorizontal: 24 }}>
      <Text style={{ ...styles.h1 }}>Pokemons List</Text>
      <Text style={{ ...styles.h2 }}>Paginated list of all pokemons</Text>
    </View>
  );






  
  const toReturn = (
    <View>
      <FlatList
        data={data.results}
        renderItem={renderItem}
        keyExtractor={(pokemon) => pokemon.name}
        ListFooterComponent={bottomPagination}
        ListHeaderComponent={headerComponent}
        refreshing={isFetching}
        onRefresh={refetch}
      />
    </View>
  );



  





  return toReturn;
};

const styles = StyleSheet.create({
  h1: {
    marginTop: 17,
    fontStyle: "normal",
    fontSize: 32,
    lineHeight: 47,
    color: colors.primaryTextColor,
  },
  h2: {
    margin: 0,
    padding: 0,
    fontStyle: "normal",
    color: colors.secondaryTextColor,
    fontSize: 16,
    lineHeight: 19,
    marginBottom: 9,
  },
});

export default PokemonsList;
