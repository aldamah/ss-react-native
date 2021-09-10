import { StyleSheet } from "react-native";
import ScreenDimensions from "../../configs/ScreenDimensions";
import { COLORS, SIZES } from "../../configs/theme";

export const StyleDashboardStats = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray3,
  },

  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 15,
    paddingLeft: 15,
    // marginTop: 20
  },

  heading: {
    color: COLORS.primary,
    fontSize: SIZES.body3,
    fontWeight: "bold",
  },

  
  greyTextDate: {
    color: COLORS.darkgray,
    fontSize: SIZES.body5,
    marginTop: 2,
  },
  cardValue: {
    alignSelf: "center",
    color: COLORS.primary,
    fontSize: SIZES.body1,
  },
  cardLabel: {
    alignSelf: "center",
    color: COLORS.primary,
    textAlign: "center",
  },
  cardContainer: {
    flexDirection: "column",
    alignContent: "space-between",
  },
  cardRow: {
    flexDirection: "row",
    marginVertical: 5,
  },
  cardTitle: {
    color: COLORS.primary,
    fontSize: SIZES.body3,
    fontWeight: "500",
    width: ScreenDimensions.widthScreen * 0.8,
  },
  cardInformation: {
    marginTop:2,
    color: COLORS.secondary,
  },
  cardEquipment: {
    color: COLORS.secondary,
    width: ScreenDimensions.widthScreen * 0.45,
    marginTop:2,
  },
});
