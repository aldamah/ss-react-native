import { StyleSheet, } from 'react-native'
import ScreenDimensions from '../../configs/ScreenDimensions'
import { COLORS, SIZES } from '../../configs/theme'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
export const StyleReUnplanned = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray3,
  },
  orangeError: {
    backgroundColor: COLORS.orange,
    // zIndex: 10000,
  },
  orangeErrorText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: SIZES.body5,
    textAlign: 'center',
    padding: 5
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15,
    paddingLeft: 15,
    // marginTop: 20
  },
  headerContainerNO: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15,
    paddingLeft: 15,
    marginTop: 20
  },
  heading: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop:10
  },
  buttonAnnuler: {
    width: 100,
    color: COLORS.white,
    backgroundColor: COLORS.customYellow,
    padding: 3,
    borderRadius: 5,
  },
  fieldContainer: {
    marginBottom: 10,
    marginTop: 10
  },
  fieldContainerCenter: {
    marginBottom: 10,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  borderContainer: {
    borderColor: COLORS.lightGray3,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10
  },
  borderContainerCenter: {
    borderColor: COLORS.lightGray3,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blueText: {
    color: COLORS.primary,
    fontSize: SIZES.body3,
    marginBottom: 10
  },
  blueTextSmall: {
    color: COLORS.primary,
    fontSize: SIZES.body4,
    marginBottom: 10
  },
  blueTextBold: {
    color: COLORS.primary,
    fontSize: SIZES.body4,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  blueTextBoldCenter: {
    color: COLORS.primary,
    fontSize: SIZES.body4,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  smallGreyText: {
    color: COLORS.darkgray,
    fontSize: SIZES.body5,
    marginTop: 4,
    marginLeft: 5
  },
  greyText: {
    color: COLORS.darkgray,
    fontSize: SIZES.body4,
    marginTop: 4,
    marginLeft: 5
  },
  boldGreyText: {
    color: COLORS.darkgray,
    fontSize: SIZES.body4,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    textDecorationLine: 'underline'
  },
  lightGreyText: {
    color: COLORS.gray1,
    fontSize: SIZES.body4,
    marginBottom: 10,
    fontStyle: 'italic'
  },
  textArea: {
    borderColor: COLORS.lightGray3,
    borderWidth: 1,
    borderRadius: 5,
    // height: 80,
    padding: 10,
    minHeight: 80

  },
  redBorder: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#FBB4B4",
    color: "#F10D0D",
    width: "70%",
    borderWidth: 1,
    borderColor: "#f10d0d",
    height: 40
  },
  redText: {
    color: "#f10d0d"
  },
  fourButtonsContainer: {
    marginTop: 20,
    marginBottom: 20
  },
  row1: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  row2: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  borderContainer: {
    borderColor: COLORS.lightGray3,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  bottomBorder: {
    borderColor: COLORS.lightGray3,
    borderBottomWidth: 1,
    marginBottom: 5
  },
  blueTextBold: {
    color: COLORS.primary,
    fontSize: SIZES.body4,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  greyTextCom: {
    color: COLORS.darkgray,
    fontSize: SIZES.body4,
    marginTop: 4,
    fontStyle: 'italic'
  },
  popupContent: {

    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
    borderRadius: ScreenDimensions.widthScreen * 0.05,
  },
  popupContent: {

    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
    borderRadius: ScreenDimensions.widthScreen * 0.05,
  },
  popupIconSad: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    // paddingTop:ScreenDimensions.widthScreen*0.001,
    fontSize: 70,
    borderBottomColor: COLORS.green,

  },
  popupText: {
    fontSize: 16,
    color: '#595959',
  },
  overlayPopupContent: {
    // position: 'absolute',
    marginBottom: ScreenDimensions.heightScreen * 0.8,
    width: ScreenDimensions.widthScreen * 0.85,
    zIndex: 10000,
    // height: ScreenDimensions.heightScreen * 0.2,
    backgroundColor: '#DBE4F0',
    alignItems: "flex-start",
    alignContent: "center",
    justifyContent: 'center',
    borderRadius: ScreenDimensions.widthScreen * 0.02,
    borderBottomWidth: 7,
    borderBottomColor: COLORS.redError,
    paddingHorizontal: 16,
    // marginTop: getStatusBarHeight()
  },
  errorMode: {
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    paddingBottom: 4
  },
  popupTextErrorTitle: {
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    fontSize: ScreenDimensions.widthScreen * 0.07,
    color: COLORS.redError
  },
})