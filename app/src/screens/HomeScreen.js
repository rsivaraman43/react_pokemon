import { View, Text, Image } from "react-native";
import { useGetPokemonsPaginatorQuery, usePrefetch } from "../services/pokemon";
import { useState, useCallback, useEffect } from "react";
import { SafeAreaView, StyleSheet, StatusBar, ScrollView } from "react-native";
import PokemonsList from "../components/Lists/PokemonList";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { Button } from "react-native-paper";
import PaginationButtons from "../components/PaginationButtons";
import { getPokemonIdFromURL } from "../functions/generalFunctions";

import LoadingScreen from "./CommonScreens/LoadingScreen";
import ErrorScreen from "./CommonScreens/ErrorScreen";
import colors from "../app/colors";

import * as React from "react";
import { BottomNavigation } from "react-native-paper";
import { Avatar } from "react-native-paper";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: colors.backGround,
  },
  buttonsContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  button: {
    width: "35%",
    padding: 5,
  },
  centererView: { flex: 1, justifyContent: "center", alignItems: "center" },
});

const ListScreen = ({
  data,
  page,
  isPrevActive,
  isNextActive,
  incrementPage,
  decrementPage,
  isFetching,
  refetch,
}) => {
  const activityIndicator = isFetching ? (
    <View style={{ ...styles.centererView }}>
      <ActivityIndicator size={"large"} />
    </View>
  ) : (
    <></>
  );

  const bottomPagination = (
    <PaginationButtons
      isPrevActive={isPrevActive}
      isNextActive={isNextActive}
      page={page}
      incrementPage={incrementPage}
      decrementPage={decrementPage}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <PokemonsList
        data={data}
        bottomPagination={bottomPagination}
        isFetching={isFetching}
        refetch={refetch}
      />
    </SafeAreaView>
  );
};

const ActiveStar = () => (
  <Image
    source={require("../shapes/ActiveStar.png")}
    style={{ width: 20, height: 20 }}
  />
);

const ActiveChatSmile = () => (
  <Image
    source={require("../shapes/ActiveChatSmile.png")}
    style={{ width: 20, height: 20 }}
  />
);
const ActiveEdit = () => (
  <Image
    source={require("../shapes/ActiveEdit.png")}
    style={{ width: 20, height: 20 }}
  />
);
const IdleChatSmile = () => (
  <Image
    source={require("../shapes/IdleChatSmile.png")}
    style={{ width: 20, height: 20 }}
  />
);
const IdleEdit = () => (
  <Image
    source={require("../shapes/IdleEdit.png")}
    style={{ width: 20, height: 20 }}
  />
);
const IdleStar = () => (
  <Image
    source={require("../shapes/IdleStar.png")}
    style={{ width: 20, height: 20 }}
  />
);

const PokemonListRoute = () => {
  const [page, setPage] = useState(1);
  const incrementPage = () => {
    setPage(page + 1);
  };
  const decrementPage = () => {
    setPage(page - 1);
  };

  const { data, error, isFetching, refetch, isLoading } =
    useGetPokemonsPaginatorQuery(page);

  const prefetchPage = usePrefetch("getPokemonsPaginator");

  const prefetchNext = useCallback(() => {
    prefetchPage(page + 1);
  }, [prefetchPage, page]);

  let isNextActive = false;
  let isPrevActive = false;

  if (!error) {
    if (!isFetching) {
      if (data.next != null) {
        isNextActive = true;
      }
      if (data.previous != null) {
        isPrevActive = true;
      }
    }
  }

  useEffect(() => {
    if (isNextActive) {
      prefetchNext();
    }
  });

  let toRender = error ? (
    <ErrorScreen refetch={refetch} isFetching={isFetching} />
  ) : isLoading ? (
    <LoadingScreen />
  ) : data ? (
    <ListScreen
      page={page}
      isPrevActive={isPrevActive}
      isNextActive={isNextActive}
      incrementPage={incrementPage}
      decrementPage={decrementPage}
      data={data}
      isFetching={isFetching}
      refetch={refetch}
    />
  ) : null;

  return toRender;
};

const FavoritesRoute = () => (
  <View style={{ ...styles.centererView, backgroundColor: colors.backGround }}>
    <Text style={{ fontSize: 50 }}>Favorites</Text>
    <Avatar.Image
      size={100}
      source={require("../shapes/ActiveStar.png")}
      style={{ backgroundColor: "transparent" }}
    />
    <Avatar.Image
      size={100}
      source={require("../shapes/IdleStar.png")}
      style={{ backgroundColor: "transparent" }}
    />
  </View>
);

const EditRoute = () => (
  <View style={{ ...styles.centererView, backgroundColor: colors.backGround }}>
    <Text style={{ fontSize: 50 }}>Edit</Text>
    <Avatar.Image
      size={100}
      source={require("../shapes/ActiveEdit.png")}
      style={{ backgroundColor: "transparent" }}
    />
    <Avatar.Image
      size={100}
      source={require("../shapes/IdleEdit.png")}
      style={{ backgroundColor: "transparent" }}
    />
  </View>
);

const HomeScreen = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "pokemons",
      focusedIcon: ActiveChatSmile,
      unfocusedIcon: IdleChatSmile,
      badge: false,
      title: "Pokemons",
    }
  ]);

  const renderScene = BottomNavigation.SceneMap({
    pokemons: PokemonListRoute,
    favorites: FavoritesRoute,
    edit: EditRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{ backgroundColor: colors.backGroundSurface }}
    />
  );
};

export default HomeScreen;
