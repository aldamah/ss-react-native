import { StyleSheet, } from 'react-native'
import ScreenDimensions from '../../configs/ScreenDimensions'
import { COLORS, SIZES } from '../../configs/theme'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'

export const StyleReMeter = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray3,
  },
  containerOffline:{
    flex: 1,
    backgroundColor: COLORS.lightGray3,
    paddingTop:25
  },
  orangeError: {
    backgroundColor: COLORS.orange,
    zIndex: 10000,
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
  flextCenterEnd: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10
  },
  flextCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
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
  viewButton: {
    width: "30%",
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
  flexEnd: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  borderContainer: {
    borderColor: COLORS.lightGray3,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10
  },
  borderCenterContainer: {
    borderColor: COLORS.lightGray3,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  blueTextBoldBig: {
    color: COLORS.primary,
    fontSize: SIZES.h2,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  blueTextwoMargin: {
    color: COLORS.primary,
    fontSize: SIZES.body3,
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
  greyTextCenter: {
    color: COLORS.darkgray,
    fontSize: SIZES.body4,
    marginTop: 4,
    marginLeft: 5,
    textAlign: 'center'
  },
  lightGreyText: {
    color: COLORS.gray1,
    fontSize: SIZES.body4,
    marginBottom: 10,
    fontStyle: 'italic',
    alignSelf: 'flex-start'
  },
  textArea: {
    borderColor: COLORS.lightGray3,
    borderWidth: 1,
    borderRadius: 5,
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