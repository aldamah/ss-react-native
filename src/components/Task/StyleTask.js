import { StyleSheet } from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { COLORS, SIZES } from '../../configs/theme';
// screen sizing
import ScreenDimensions from '../../configs/ScreenDimensions';
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
// orientation must fixed
const SCREEN_WIDTH = ScreenDimensions.widthScreen < ScreenDimensions.heightScreen ? ScreenDimensions.widthScreen : ScreenDimensions.heightScreen;

const taskNumColums = 2;
// item size
const TASK_ITEM_HEIGHT = 40;
const TASK_ITEM_MARGIN = 20;

export const StyleTask = StyleSheet.create(
  {
    dataFetch: {
      flex: 1,
      backgroundColor: 'rgba(0, 54, 84, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    main: {
      flex: 1,
      backgroundColor: '#e2e2e2',
      marginBottom: getBottomSpace()
    },
    orangeError: {
      backgroundColor: COLORS.orange,
    },
    orangeErrorText: {
      color: COLORS.white,
      fontWeight: 'bold',
      fontSize: SIZES.body5,
      textAlign: 'center',
      padding: 5
    },
    popupContainer: {
      flex: 1,
      position: "absolute",
      width: ScreenDimensions.widthScreen,
      height: ScreenDimensions.heightScreen,
      top: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      alignItems: "center",
      alignContent: 'center',
      justifyContent: 'center',
      alignSelf: 'center',

    },
    popupContent: {
      flexDirection: "row",
      justifyContent: "center",
      alignContent: "center",
      borderRadius: ScreenDimensions.widthScreen * 0.05,
    },
    popupContentUpdate: {
      flexDirection: "row",
      alignContent: "center",
      borderRadius: ScreenDimensions.widthScreen * 0.05,
      paddingHorizontal: 30,
    },
    popupTextErrorTitle: {
      fontWeight: 'bold',
      alignSelf: 'flex-start',
      fontSize: ScreenDimensions.widthScreen * 0.07,
      color: COLORS.redError
    },
    popupTextErrorTitleUpdate: {
      fontWeight: 'bold',
      alignSelf: 'flex-start',
      fontSize: ScreenDimensions.widthScreen * 0.07,
      color: COLORS.redError
    },
    popupText: {
      fontSize: 16,
      color: '#595959',
    },
    popupTextUpdate: {
      fontSize: 16,
      color: '#595959',
    },
    popupIconSad: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      // paddingTop:ScreenDimensions.widthScreen*0.001,
      fontSize: 70,
      borderBottomColor: COLORS.redError,

    },
    popupIconSmileUpdate: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      // paddingTop:ScreenDimensions.widthScreen*0.001,
      fontSize: 70,
      borderBottomColor: COLORS.green,
      marginRight: 10,

    },
    errorMode: {
      flexDirection: "column",
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: 'center',
      paddingBottom: 4
    },
    checkModeUpdate: {
      flexDirection: "column",
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: 'center',
      paddingBottom: 4,
      width: ScreenDimensions.widthScreen * 0.6,
    },
    overlayPopupContent: {
      // position: 'absolute',
      marginBottom: ScreenDimensions.heightScreen * 0.8,
      width: ScreenDimensions.widthScreen * 0.85,
      height: ScreenDimensions.heightScreen * 0.2,
      backgroundColor: '#DBE4F0',
      alignItems: "center",
      alignContent: "center",
      justifyContent: 'center',
      borderRadius: ScreenDimensions.widthScreen * 0.02,
      borderBottomWidth: 7,
      borderBottomColor: COLORS.redError,
    },
    overlayPopupContentUpdate: {
      // position: 'absolute',
      zIndex: 20000,
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
    container: {
      width: ScreenDimensions.widthScreen * 0.95,
      height: ScreenDimensions.heightScreen * 0.345,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: '#eaeaea',
      margin: 10,
      backgroundColor: '#ffffff',
    },
    rowContent: {
      flexDirection: 'row',
      alignContent: 'center',
      marginVertical: 2,
      alignItems: 'center'

    },
    bodyContainer: {
      flexDirection: 'column',
      width: ScreenDimensions.widthScreen * 0.5,
      height: ScreenDimensions.heightScreen * 0.3,
    },
    bodyContent: {
      flexDirection: 'row',
      marginLeft: 10,
      margin: 3,
    },
    TitleContainer: {
      marginTop: 18,
      marginLeft: 15,
      marginRight: 15,
      flexDirection: 'row',
      borderBottomColor: '#001846',
      borderBottomWidth: 1,
      fontSize: 20,
      justifyContent: 'space-between',
    },
    TitleContent: {
      fontSize: 20,
      color: '#001846',

      marginTop: 5,
    },
    photo: {
      width: (SCREEN_WIDTH - (taskNumColums + 1) * TASK_ITEM_MARGIN) / taskNumColums,
      height: TASK_ITEM_HEIGHT,
      borderRadius: 15,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0
    },
    title: {
      margin: 5,
      fontSize: 18,
      color: '#001846',
      fontWeight: 'bold'
    },
    progressionStyle: {
      marginTop: 13.5
    },
    informationTitle: {
      margin: 5,
      color: '#707070',
      fontSize: 18,

    },
    category: {
      marginTop: 5,
      marginBottom: 5
    },
    orderByContainer: {
      width: ScreenDimensions.widthScreen * 0.5,
      height: ScreenDimensions.heightScreen * 0.15,
      alignSelf: 'center',
    },
    orderBy: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: 'center',
      flexDirection: 'row',


    },
    titleOrderBy: {
      margin: 20,
      alignSelf: 'center',
      fontSize: ScreenDimensions.widthScreen * 0.04,
    },
    filtreContainer: {
      flexDirection: 'column',
    },
    orderByContent: {
      // height: 30,
      marginVertical: 5,
      flexDirection: 'row',
    },
    addNewTask: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      backgroundColor: "#FFFFFF",
      borderRadius: 70 / 2

    },
    taskInformationContainer: {
      flexDirection: 'column',
      alignContent: 'center',
      alignItems: 'center'

    },
    searchContent: {
      height: ScreenDimensions.heightScreen * 0.05,
      // width: ScreenDimensions.widthScreen * 0.8,
      backgroundColor: '#ffffff',
      marginVertical: ScreenDimensions.heightScreen * 0.02,
      paddingHorizontal: 10,
      borderRadius: 10,

    },
    progress: {
      flexDirection: 'column',
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      position: 'absolute',
      bottom: -5
    },
    card: {
      margin: 10,
      marginBottom: 0,
      backgroundColor: COLORS.white,
      // height: 250,
      borderRadius: 15,
      paddingVertical: 20,
      borderWidth: 1,
      borderColor: COLORS.lightGray2,
      justifyContent: 'center',
      alignContent: 'center',
    },
    cardNoRes: {
      margin: 10,
      // backgroundColor: COLORS.white,
      height: 250,
      borderRadius: 15,
      // paddingVertical: 20,
      // borderWidth: 1,
      // borderColor: COLORS.lightGray2,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    },
    cardUM: {
      margin: 10,
      backgroundColor: COLORS.white,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: COLORS.lightGray2,
      // maxHeight:700,
      paddingVertical: 20,
      justifyContent: 'center',
      alignContent: 'center',
      // alignItems:'center'
    },
    waitCardUM: {
      borderRadius: 30 / 2,
      backgroundColor: COLORS.orange,
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center'
    },
    cardHeader: {
      // marginTop: 18,
      marginLeft: 15,
      marginRight: 15,
      flexDirection: 'row',
      borderBottomColor: COLORS.primary,
      borderBottomWidth: 1,
      fontSize: SIZES.h3,
      justifyContent: 'space-between',
      flexWrap: 'wrap'

    },
    headerText: {
      width: ScreenDimensions.widthScreen * 0.65,
      fontSize: SIZES.h3,
      color: COLORS.primary,
      marginTop: 5,

    },
    headerTextNoRes: {
      width: ScreenDimensions.widthScreen * 0.65,
      fontSize: SIZES.h3,
      color: COLORS.primary,
      alignSelf: 'center',
      paddingHorizontal: 75

    },
    cardChildRowOne: {
      flexDirection: 'row',
      marginLeft: 10,
      marginTop: 10,
      // margin: 5,
    },
    cardChildRow: {
      flexDirection: 'row',
      marginLeft: 10,
      margin: 3,

    },
    childfirstColumn: {
      margin: 5,
      fontSize: SIZES.body4,
      color: COLORS.primary,
      fontWeight: 'bold'
    },
    childSecondColumn: {
      margin: 5,
      color: '#707070',
      fontSize: SIZES.body4,
    },
    progressionStyle: {
      marginTop: 13.5
    }
  })

