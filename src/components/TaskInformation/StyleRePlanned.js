import { StyleSheet, } from 'react-native'
import ScreenDimensions from '../../configs/ScreenDimensions'
import { COLORS, SIZES } from '../../configs/theme'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
export const StyleRePlanned = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray3,
  },
  containerOffline: {
    flex: 1,
    backgroundColor: COLORS.lightGray3,
    paddingTop:25
  },
  orangeError: {
    position: 'absolute',
    top: 0,
    backgroundColor: COLORS.orange,
    width: ScreenDimensions.widthScreen,
    zIndex: 1000,
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
  saveButton: {
    width: "95%",
    color: COLORS.primary,
    backgroundColor: COLORS.primary,
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
    padding: 10,
    marginBottom: 10
  },
  blueText: {
    color: COLORS.primary,
    fontSize: SIZES.body3,
    marginBottom: 10
  },
  required: {
    color: 'red',
    fontSize: SIZES.body3
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
  smallGreyText: {
    color: COLORS.darkgray,
    fontSize: SIZES.body5,
    marginTop: 4,
    marginLeft: 5
  },
  smallGreyNoText: {
    color: COLORS.darkgray,
    fontSize: SIZES.body5,
    marginTop: 4,
    marginLeft: 5,
    fontStyle: 'italic'
  },
  greyText: {
    color: COLORS.darkgray,
    fontSize: SIZES.body4,
    marginTop: 4,
    marginLeft: 5
  },
  greyTextComment: {
    color: COLORS.darkgray,
    width: ScreenDimensions.widthScreen * 0.48,
    fontSize: SIZES.body4,
    marginTop: 4,
    marginLeft: 5,

  },
  lightGreyText: {
    color: COLORS.gray1,
    fontSize: SIZES.body4,
    marginBottom: 10,
    width: ScreenDimensions.widthScreen * 0.48,
    fontStyle: 'italic'
  },
  textArea: {
    borderColor: COLORS.lightGray3,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 15,
    // height: 60,
    padding: 5,
    minHeight: 60
  },
  listRow: {
    marginBottom: 10
  },
  listRow1: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  listRow2: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circle: {
    width: 15,
    height: 15,
    justifyContent: "center",
    borderRadius: 15 / 2,
    backgroundColor: COLORS.primary,
    marginRight: 10
  },
  yellowLine: {
    borderLeftColor: COLORS.customYellow,
    borderLeftWidth: 3,
    marginLeft: 5,
    height: 50
  },
  inline: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  popupContent: {

    flexDirection: "row",
    justifyContent: "center",
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
    // height: ScreenDimensions.heightScreen * 0.2,
    backgroundColor: '#DBE4F0',
    alignItems:"flex-start",
    alignContent: "center",
    justifyContent: 'center',
    borderRadius: ScreenDimensions.widthScreen * 0.02,
    borderBottomWidth: 7,
    borderBottomColor: COLORS.redError,
    paddingHorizontal: 16,
    zIndex: 10000,
    // marginTop: getStatusBarHeight()
  },
  errorMode: {
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    paddingBottom: 4,
    // width: ScreenDimensions.widthScreen * 0.6,
  },
  popupTextErrorTitle: {
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    fontSize: ScreenDimensions.widthScreen * 0.07,
    color: COLORS.redError
  },
  greyTextDate: {
    color: COLORS.darkgray,
    fontSize: SIZES.body5,
    marginTop:2,
  },
})
