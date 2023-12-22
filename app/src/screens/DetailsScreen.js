import { Text } from "react-native-paper";
import { View } from "react-native";
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { useGetPokemonsByIdQuery } from "../services/pokemon";
import { getPokemonIdFromURL } from "../functions/generalFunctions";
import Unorderedlist from "react-native-unordered-list";

import ErrorScreen from "./CommonScreens/ErrorScreen";
import LoadingScreen from "./CommonScreens/LoadingScreen";

import colors from "../app/colors";

/*
abilities (V)
moves (V)
name (V)
stats (V)
types (V)
weight (V)
held_items (V)

*/

const EmptyPlaceholder = ({ placeholder }) => {
  return (
    <View style={{ ...styles.paragraphContainer }}>
      <Text style={{ ...styles.paragraph }}>
        This pokemon has no {placeholder}
      </Text>
    </View>
  );
};

const StringsToUnorderedList = ({ strings }) => {
  const toRender = strings.map((item) => {
    return (
      <Unorderedlist style={{ ...styles.paragraph }} key={item}>
        <Text style={{ ...styles.paragraph }}>{item}</Text>
      </Unorderedlist>
    );
  });

  return <View style={{ ...styles.paragraphContainer }}>{toRender}</View>;
};

const Abilities = ({ data }) => {
  const abilities = data.abilities;
  const abilitiesStrings = [];
  for (const key in abilities) {
    abilitiesStrings.push(abilities[key].ability.name);
  }

  if (abilitiesStrings.length == 0) {
    return <EmptyPlaceholder placeholder={"abilities"} />;
  }

  return <StringsToUnorderedList strings={abilitiesStrings} />;
};

const Moves = ({ data }) => {
  const moves = data.moves;
  const movesStrings = [];
  for (const key in moves) {
    movesStrings.push(moves[key].move.name);
  }

  if (movesStrings.length == 0) {
    return <EmptyPlaceholder placeholder={"moves"} />;
  }

  return <StringsToUnorderedList strings={movesStrings} />;
};

const Stats = ({ data }) => {
  const stats = data.stats;
  const statsStrings = [];
  for (const key in stats) {
    const base_stat = stats[key].base_stat;
    statsStrings.push(`${stats[key].stat.name}: ${base_stat}`);
  }

  if (statsStrings.length == 0) {
    return <EmptyPlaceholder placeholder={"stats"} />;
  }

  return <StringsToUnorderedList strings={statsStrings} />;
};

const Types = ({ data }) => {
  const types = data.types;
  const typesStrings = [];
  for (const key in types) {
    typesStrings.push(`${types[key].type.name}`);
  }
  console.log(typesStrings);

  if (typesStrings.length == 0) {
    return <EmptyPlaceholder placeholder={"types"} />;
  }

  return <StringsToUnorderedList strings={typesStrings} />;
};

const HeldItems = ({ data }) => {
  const held_items = data.held_items;
  const held_itemsStrings = [];
  for (const key in held_items) {
    held_itemsStrings.push(`${held_items[key].item.name}`);
  }
  console.log(held_itemsStrings);

  if (held_itemsStrings.length == 0) {
    return <EmptyPlaceholder placeholder={"held items"} />;
  }

  return <StringsToUnorderedList strings={held_itemsStrings} />;
};

const DisplayDetailsScreen = ({ data }) => {
  let ScreenWidth = Dimensions.get("window").width;
  const id = data.id;
  const name = data.name;

  const imageURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ ...styles.container }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
              paddingTop: 30,
            }}
          >
            <Image
              style={{
                ...styles.mainImage,
                width: ScreenWidth - 32,
                height: ScreenWidth - 32,
              }}
              source={{
                uri: imageURL,
              }}
              resizeMode={"contain"}
            />
          </View>

          <View>
            <Text style={{ ...styles.title }}>Name:</Text>
            <View style={{ ...styles.paragraphContainer }}>
              <Unorderedlist style={{ ...styles.paragraph }}>
                <Text style={{ ...styles.paragraph }}>{name}</Text>
              </Unorderedlist>
            </View>

            <Text style={{ ...styles.title }}>Weight:</Text>
            <View style={{ ...styles.paragraphContainer }}>
              <Unorderedlist style={{ ...styles.paragraph }}>
                <Text style={{ ...styles.paragraph }}>{data.weight}</Text>
              </Unorderedlist>
            </View>

            <Text style={{ ...styles.title }}>Abilities:</Text>
            <Abilities data={data} />

            <Text style={{ ...styles.title }}>Moves:</Text>
            <Moves data={data} />

            <Text style={{ ...styles.title }}>Stats:</Text>
            <Stats data={data} />

            <Text style={{ ...styles.title }}>Types:</Text>
            <Types data={data} />

            <Text style={{ ...styles.title }}>Held Items:</Text>
            <HeldItems data={data} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const DetailsScreen = ({ route }) => {
  const { url } = route.params;
  const id = getPokemonIdFromURL(url);

  const { data, error, isFetching, refetch, isLoading } =
    useGetPokemonsByIdQuery(id);
  console.log(`data ${data}`);

  let toRender = error ? (
    <ErrorScreen refetch={refetch} isFetching={isFetching} />
  ) : isLoading ? (
    <LoadingScreen />
  ) : data ? (
    <DisplayDetailsScreen data={data} />
  ) : null;

  return toRender;
};

const styles = StyleSheet.create({
  container: { backgroundColor: colors.backGround, padding: 16 },

  title: {
    fontSize: 32,
    lineHeight: 38,
    color: colors.primaryTextColor,
    paddingTop: 16,
  },
  paragraphContainer: {
    paddingHorizontal: 0,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 19,
    color: colors.secondaryTextColor,
  },

  mainImage: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 50,
    backgroundColor: colors.backGroundSurface,
  },
});

export default DetailsScreen;
