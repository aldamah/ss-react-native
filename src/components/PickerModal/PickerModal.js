import React from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Overlay, Divider } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../../configs/theme";
import ScreenDimensions from "../../configs/ScreenDimensions";

export const PickerModal = (props) => {
  const { visible, hideModal, startCamera, pickPhoto, pickDocument, intl } =
    props;

  return (
    <Overlay
      isVisible={visible}
      onBackdropPress={() => {
        hideModal();
      }}
      overlayStyle={{
        alignSelf: "center",
      }}
    >
      <View style={styles.menuPickerContainer}>
        <Divider inset={true} insetType="middle" />
        <TouchableOpacity
          style={styles.menuPicker}
          onPress={() => startCamera()}
        >
          <Text style={styles.filterLabel}>
            {intl.formatMessage({
              id: "attachmentPicker.takePhoto",
              defaultMessage: "Take Photo",
            })}
          </Text>
          <View style={styles.btnIcon}>
            <Icon name={"camera-alt"} size={30} color={COLORS.primary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuPicker}
          onPress={() => pickPhoto("image/*")}
        >
          <Text style={styles.filterLabel}>
            {intl.formatMessage({
              id: "attachmentPicker.choosePhoto",
              defaultMessage: "Choose Photo",
            })}
          </Text>
          <View style={styles.btnIcon}>
            <Icon name={"photo-library"} size={30} color={COLORS.primary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuPicker}
          onPress={() => pickDocument()}
        >
          <Text style={styles.filterLabel}>
            {intl.formatMessage({
              id: "attachmentPicker.chooseFile",
              defaultMessage: "Choose File",
            })}
          </Text>
          <View style={styles.btnIcon}>
            <Icon name={"upload-file"} size={30} color={COLORS.primary} />
          </View>
        </TouchableOpacity>
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  menuPickerContainer: {
    width: ScreenDimensions.widthScreen * 0.8,
    padding: 10,
    ...(Platform.OS !== "android" && {
      zIndex: 2000,
    }),
    flexDirection: "column",
    alignItems: "center",
  },
  menuPicker: {
    ...(Platform.OS !== "android" && {
      zIndex: 5000,
    }),
    width: ScreenDimensions.widthScreen * 0.7,
    flexDirection: "row",
    // marginVertical: 10,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  filterLabel: {
    color: COLORS.primary,
    // marginBottom: 5,
    // marginTop: 5,
    fontSize: 15,
  },
});
