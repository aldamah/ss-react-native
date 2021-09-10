import React from "react";
import { TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/Ionicons";

import styles from "./styles";

export default class MenuImage extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.headerButtonContainer}
        onPress={this.props.onPress}
      >
        <Icon name="menu" color="#ffffff" size={30} />
      </TouchableOpacity>
    );
  }
}

MenuImage.propTypes = {
  onPress: PropTypes.func,
};
