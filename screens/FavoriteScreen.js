import React from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import Artwork from "../components/Artwork";
import ButtonComponent from "../components/ButtonComponent";
import Header from "../components/Header";
import { removeAllFavorites } from "../reducers/favorites";
import { useDispatch, useSelector } from "react-redux";

export default function FavoriteScreen({ navigation }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.value);

  let favoritesArtworks = (
    <Text style={styles.noFavText}>Your Favorites list is empty</Text>
  );
  let removeFavorites;
  if (favorites.length > 0) {
    favoritesArtworks = favorites.map((data, i) => {
      const handleArtPress = () => {
        console.log("click art");
        navigation.navigate("Artwork", { ...data });
      };

      return (
        <TouchableOpacity key={i} onPress={() => handleArtPress()}>
          <Artwork
            key={i}
            image={data.image}
            author={data.author}
            title={data.title}
            cardStyle={styles.favoriteCard}
            imageStyle={styles.favoriteImage}
            textStyle={styles.favoriteText}
            authorStyle={styles.favoriteAuthorText}
            titleStyle={styles.favoriteTitleText}
            textContainerStyle={styles.favoriteTextContainer}
            isFavorite
            removeFromFavorites={true}
            showLabels={false}
          />
        </TouchableOpacity>
      );
    });

    const handleRemoveAllFavorites = () => {
      dispatch(removeAllFavorites());
    };

    removeFavorites = (
      <ButtonComponent
        onPress={handleRemoveAllFavorites}
        buttonText="Delete all Favorites"
        style={styles.deleteButton}
      />
    );
  }

  return (
    <SafeAreaView style={styles.favoriteContainer}>
      <Header />
      <View style={styles.scrollableContent}>
        <ScrollView contentContainerStyle={styles.favoriteArtworksBox}>
          {favoritesArtworks}
        </ScrollView>
      </View>
      <View style={styles.removeFavoritesBox}>{removeFavorites}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  favoriteContainer: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    paddingTop: Platform.OS === 'android' ? 50 : 0
  },

  noFavText: {
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "NotoSansMono-Regular",
    fontSize: 16,
  },

  favoriteCard: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width * 0.6,
    aspectRatio: 0.78,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: {
    width: 2,
    height: 2,
},
    shadowOpacity:  0.25,
    shadowRadius: 4,
    elevation: 4
  },

  scrollableContent: {
    display: "flex",
    flex: 1,
    marginTop: 10,
    marginBottom: 65,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },

  favoriteArtworksBox: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  favoriteImage: {
    width: "85%",
    aspectRatio: 1,
    borderRadius: 10,
    contentFit: "contain",
    marginBottom: 5,
  },

  favoriteTextContainer: {
    width: "90%",
  },

  favoriteAuthorText: {
    fontFamily: "NotoSansMono-Bold",
    fontSize: 12,
  },

  favoriteTitleText: {
    fontSize: 12,
    fontFamily: "NotoSansMono-Regular",
  },

  favoriteTitle: {
    fontFamily: "NotoSansMono-Bold",
  },

  removeFavoritesBox: {
    position: "absolute",
    bottom: 10,
    marginBottom: 5,
  },
});
