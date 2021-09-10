import React from "react";
import { View, Image } from "react-native";

import Images from "../../configs/Images";
import styles from "./styles";

export default class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.photo} source={Images.imgLogo} />
      </View>
    );
  }
}
