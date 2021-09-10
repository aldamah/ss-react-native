import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import Toast from "react-native-easy-toast";
import { connect } from "react-redux";

import ScreenDimensions from "../../configs/ScreenDimensions";
import { COLORS } from "../../configs/theme";

class ToastApp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate() {
    if (this.props.text) {
      this.toast.show(this.renderToast());
      this.disableToastError();
    }
  }

  async disableToastError() {
    const that = this;
    const actionErrorText = { type: "TOAST_TEXT_ACTION", value: null };
    that.props.dispatch(actionErrorText);

    const actionErrorType = { type: "TOAST_TYPE_ACTION", value: null };
    that.props.dispatch(actionErrorType);
  }

  renderToast = () => (
    <View>
      <View style={Style.popupContent}>
        <View style={Style.errorMode}>
          <Text style={Style.popupText}>{this.props.text}</Text>
        </View>
      </View>
    </View>
  );

  render() {
    const { screen, update } = this.props;
    return (
      <Toast
        ref={(toast) => (this.toast = toast)}
        style={
          update ? Style.overlayPopupContentSucces : Style.overlayPopupContent
        }
        position="top"
        positionValue={screen ? getStatusBarHeight(true) + 12 : 4}
        fadeInDuration={200}
        fadeOutDuration={2000}
        opacity={50}
      />
    );
  }
}

const Style = StyleSheet.create({
  popupContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
    borderRadius: ScreenDimensions.widthScreen * 0.05,
    zIndex: 2000,
  },
  overlayPopupContent: {
    // position: 'absolute',
    marginBottom: ScreenDimensions.heightScreen * 0.8,
    width: ScreenDimensions.widthScreen * 0.85,
    // height: ScreenDimensions.heightScreen * 0.2,
    backgroundColor: COLORS.red,
    alignItems: "flex-start",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: ScreenDimensions.widthScreen * 0.02,
    borderBottomWidth: 7,
    borderBottomColor: COLORS.red,
    paddingHorizontal: 16,
    zIndex: 2000,
  },
  overlayPopupContentSucces: {
    position: 'absolute',
    top:0,
    marginBottom: ScreenDimensions.heightScreen * 0.8,
    width: ScreenDimensions.widthScreen * 0.85,
    // height: ScreenDimensions.heightScreen * 0.2,
    backgroundColor: COLORS.green,
    alignItems: "flex-start",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: ScreenDimensions.widthScreen * 0.02,
    borderBottomWidth: 7,
    borderBottomColor: COLORS.green,
    paddingHorizontal: 16,
    zIndex:2000
  },
  errorMode: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    paddingBottom: 4,
  },
  popupText: {
    fontSize: 16,
    color: COLORS.white,
  },
});

const mapStateToProps = (state) => ({});
export default connect(mapStateToProps)(ToastApp);
