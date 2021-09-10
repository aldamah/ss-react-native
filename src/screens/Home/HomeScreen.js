import React from "react";
import { FlatList, Text, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { TouchableOpacity } from "react-native-gesture-handler";

import StyleHome from "./StyleHome";
import MenuImage from "../../components/MenuImage/MenuImage";

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Home",
    headerLeft: (
      <MenuImage
        onPress={() => {
          navigation.openDrawer();
        }}
      />
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      categorie: [
        {
          key: 1,
          title: "Planned",
          navigation: "Planned",
          categoryId: "Task",
          icon: "calendar",
        },
        {
          key: 2,
          title: "Unplanned",
          navigation: "Unplanned",
          categoryId: "Task",
          icon: "exclamationcircleo",
        },
        {
          key: 3,
          title: "Meters",
          navigation: "Meters",
          categoryId: "Task",
          icon: "dashboard",
        },
      ],
    };
  }

  goTo = (screen) => {
    this.props.navigation.navigate("Home");
  };

  renderCategorie = ({ item }) => (
    <TouchableOpacity
      underlayColor="rgba(73,182,77,1,0.9)"
      onPress={() => this.props.navigation.navigate(item.navigation)}
    >
      <View style={StyleHome.content}>
        {/* <View style={StyleHome.photo}> */}
        <Icon
          name={item.icon}
          size={140}
          color="#00004d"
          style={StyleHome.photo}
        />
        {/* </View> */}
        <Text style={StyleHome.title}>{item.title}</Text>
        <Text style={StyleHome.category}>{item.categoryId}</Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    const { categorie } = this.state;
    return (
      <View style={StyleHome.container}>
        <FlatList
          vertical
          showsVerticalScrollIndicator={false}
          numColumns={1}
          data={categorie}
          renderItem={this.renderCategorie}
          keyExtractor={(item) => `${item.recipeId}`}
        />
      </View>
    );
  }
}
