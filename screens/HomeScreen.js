import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Artwork from "../components/Artwork";
import DropdownComponent from "../components/DropdownComponent";
import Header from "../components/Header";
import { useEffect, useState } from "react";

export default function HomeScreen({ navigation }) {
  const [artworksData, setArtworksData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [filteredArtworks, setFilteredArtworks] = useState([]);

  // variable crée pour sortir auteurs masculins présents dans l'API malgré le tag female_artist ou images de mauvaises qualités 
  const excludedAuthors = ["Peter", "Henri", "Matthew", "Master", "Edith", "Paula", "Käthe", "Frances"];

  useEffect(() => {
    fetch(
      "https://openaccess-api.clevelandart.org/api/artworks/?has_image=1&limit=130&female_artists=none"
    )
      .then((response) => response.json())
      .then((data) => {
        const formatedData = data.data
          // filtre pour retirer les excludedAuthors
          .filter((artwork) => {
            const author = artwork.creators[0].description.toLowerCase();
            return !excludedAuthors.some((excludedAuthor) =>
              author.includes(excludedAuthor.toLowerCase())
            );
          })
          .map((artwork) => {
            let author = artwork.creators[0].description;
            let date = artwork.creation_date;
            let title = artwork.title;
            let image = artwork.images.web.url;
            let technique = artwork.technique;
            let type = artwork.type;
            let description = artwork.wall_description;
            let funFact = artwork.fun_fact;
            let department = artwork.department;
            return {
              author,
              date,
              title,
              image,
              technique,
              type,
              description,
              funFact,
              department,
            };
          });

        // recuperer les departements pour les labels du dropdown
        const departmentsData = data.data.map((artwork) => {
          let department = artwork.department;
          return {
            department,
          };
        });
        setArtworksData(formatedData);
        setDepartments(departmentsData);
      });
  }, []);

  // Obtenir les catégories uniques et les mettre au format pour le dropdown
  const uniqueDepartments = [...new Set(departments.map((e) => e.department))];
  const departmentsDropdown = [
    { label: "All Departments", value: null },
    ...uniqueDepartments.map((data, i) => ({
      label: data,
      value: data,
    })),
  ];

  // useEffect qui se déclenche lors de l'utilisation de la dropdown
  useEffect(() => {
    if (selectedDepartment) {
      const filteredArtworks = artworksData.filter(
        (data) => data.department === selectedDepartment
      );
      setFilteredArtworks(filteredArtworks);
    } else {
      setFilteredArtworks(artworksData);
    }
  }, [artworksData, selectedDepartment]);

  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
  };

  const artworks = filteredArtworks.map((data, i) => {
    // Enlever la date du nom de l'auteur pour alléger texte en homepage
    const formattedAuthor = data.author.replace(/\([^()]*\)/g, "").trim();
    const formatedTitle =
      data.title.length > 50 ? data.title.slice(0, 50) + "..." : data.title;
    const handleArtPress = () => {
      navigation.navigate("Artwork", { ...data });
    };

    return (
      <TouchableOpacity key={i} onPress={() => handleArtPress()}>
        <Artwork
          image={data.image}
          author={formattedAuthor}
          title={formatedTitle}
          cardStyle={styles.homeCard}
          imageStyle={styles.homeImage}
          textStyle={styles.homeText}
          authorStyle={styles.authorText}
          titleStyle={styles.titleText}
          textContainerStyle={styles.homeTextContainer}
          showLabels={false}
        />
      </TouchableOpacity>
    );
  });

  return (
    <SafeAreaView style={styles.homeContainer}>
      <Header />
      <DropdownComponent
        departments={departmentsDropdown}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={handleDepartmentChange}
      />
      <ScrollView
        contentContainerStyle={[
          styles.homeArtworksBox,
          { paddingBottom: "40%" },
        ]}
      >
        {artworks}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: Platform.OS === 'android' ? 50 : 0
  },

  homeCard: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width * 0.49,
    aspectRatio: 0.73,
    margin: 0.5,
    padding: 5,
    
  },

  homeArtworksBox: {
    backgroundColor: "white",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  homeImage: {
    width: "95%",
    aspectRatio: 1,
    borderRadius: 10,
    contentFit: "cover",
    marginBottom: 5,
  },

  homeTextContainer: {
    width: "95%",
  },

  authorText: {
    fontFamily: "NotoSansMono-Bold",
    fontSize: 11,
    textAlign: 'left'
  },

  titleText: {
    fontSize: 11,
    fontFamily: "NotoSansMono-Regular",
    textAlign: 'left'
  },

  homeTitle: {
    fontFamily: "NotoSansMono-Bold",
  },
});
