import React from "react";
import { TouchableHighlight, Text, View } from "react-native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/AntDesign";

import styles from "./styles";

export default class MenuButton extends React.Component {
  render() {
    const { icon } = this.props;
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        style={styles.btnClickContain}
        underlayColor="rgba(128, 128, 128, 0.1)"
      >
        <View style={styles.btnContainer}>
          <View style={styles.btnIcon}>
            <Icon name={icon} size={30} color="#ffffff" />
          </View>
          <Text style={styles.btnText}>{this.props.title}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

MenuButton.propTypes = {
  onPress: PropTypes.func,
  source: PropTypes.number,
  title: PropTypes.string,
};
