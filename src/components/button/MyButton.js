import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  View,
} from "react-native";

import { StyleMyButton } from "./StyleMyButton";
import Colors from "../../configs/Colors";

export default class MyButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <TouchableOpacity
        style={[StyleMyButton.buttonAuth, { ...this.props.stylesButton }]}
        onPress={this.props.onPress}
      >
        {this.props.isLoading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <View style={{ flexDirection: "row" }}>
            {this.props.img ? (
              <Image
                source={this.props.img}
                style={{ width: 30, height: 30 }}
              />
            ) : null}
            <Text style={StyleMyButton.textButton}>{this.props.title}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
}
