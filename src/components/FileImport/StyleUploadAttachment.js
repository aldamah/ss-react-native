import { StyleSheet } from "react-native";

// screen sizing
import ScreenDimensions from "../../configs/ScreenDimensions";
import { COLORS, SIZES} from "../../configs/theme";

export const StyleUploadAttachment = StyleSheet.create({
  attachmentContainer: {
    marginBottom: 10,
    marginTop: 10,
  },
  uploadContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#c0c4cc",
    borderRadius: 1,
    justifyContent: "space-between",
    padding: 10,
  },
  uploadedFile: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#c0c4cc",
    borderRadius: 1,
    justifyContent: "space-between",
    padding: 10,
  },
  fileName: {
    width: ScreenDimensions.widthScreen * 0.7,
  },
  greyText: {
    color: COLORS.darkgray,
    fontSize: SIZES.body4,
    marginTop: 4,
    marginLeft: 5,
  },
  blueText: {
    color: COLORS.primary,
    fontSize: SIZES.body3,
    marginBottom: 10,
  },
  greyTextDate: {
    color: COLORS.darkgray,
    fontSize: SIZES.body5,
    marginTop:2,
  },
});
