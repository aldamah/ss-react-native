import { StyleSheet } from 'react-native';

// screen sizing
import ScreenDimensions from '../../configs/ScreenDimensions';
import { COLORS, SIZES } from '../../configs/theme';
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
// orientation must fixed
const SCREEN_WIDTH = ScreenDimensions.widthScreen < ScreenDimensions.heightScreen ? ScreenDimensions.widthScreen : ScreenDimensions.heightScreen;

const taskNumColums = 2;
// item size
const TASK_ITEM_HEIGHT = 150;
const TASK_ITEM_MARGIN = 20;

export const StyleAddTask = StyleSheet.create(
  {
    main: {
      flex: 1,
      backgroundColor: '#e6f9ff',
      paddingHorizontal: ScreenDimensions.widthScreen * 0.05,
    },
    KeyBmain: {
      flex: 1

    },
    dateContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      alignSelf: 'center',
      height: ScreenDimensions.heightScreen * 0.1,
      marginVertical: ScreenDimensions.heightScreen * 0.03,

    },
    dateTitle: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
      fontSize: ScreenDimensions.widthScreen * 0.04,
    },
    dateContent: {
      marginTop: 45,
      width: ScreenDimensions.widthScreen * 0.6,
      height: ScreenDimensions.heightScreen * 0.07,
      backgroundColor: '#ffffff',
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center'
    },
    datePickerContainer: {
      flexDirection: 'row',
      backgroundColor: '#ffffff',
      height: ScreenDimensions.heightScreen * 0.05,
      borderRadius: 6,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
    },
    datePickerContent: {
      width: ScreenDimensions.widthScreen * 0.7,
      height: ScreenDimensions.heightScreen * 0.1,
    },
    datePickerTitle: {
      color: '#d9d9d9',
      alignSelf: 'center',
    },
    dateInformation: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dateInformationTitle: {
      color: '#d9d9d9',
      paddingHorizontal: ScreenDimensions.widthScreen * 0.1
    },
    InfoContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      alignSelf: 'center',
      marginVertical: ScreenDimensions.heightScreen * 0.01,

    },

    InfoTitleContainer: {
      fontSize: ScreenDimensions.widthScreen * 0.04,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
      marginTop: 10
    },
    commentContent: {
      height: ScreenDimensions.heightScreen * 0.3,
      width: ScreenDimensions.widthScreen * 0.8,
      backgroundColor: '#ffffff',
      marginVertical: ScreenDimensions.heightScreen * 0.02,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
      flexWrap: 'wrap'

    },
    titleInputContent: {
      height: ScreenDimensions.heightScreen * 0.05,
      width: ScreenDimensions.widthScreen * 0.8,
      backgroundColor: '#ffffff',
      marginVertical: ScreenDimensions.heightScreen * 0.02,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
      flexWrap: 'wrap'

    },
    commentButtonContent: {
      height: ScreenDimensions.heightScreen * 0.08,
      width: ScreenDimensions.widthScreen * 0.8,
      backgroundColor: '#66ccff',
      marginVertical: ScreenDimensions.heightScreen * 0.02,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
      borderRadius: 15,
      marginLeft: 10,

    },
    ButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
    },
    buttonTitleContent: {
      fontSize: ScreenDimensions.widthScreen * 0.04,
      alignSelf: 'center',
      textAlign: 'center',
      color: '#ffffff',
    },
    cancelButtonContent: {
      height: ScreenDimensions.heightScreen * 0.08,
      width: ScreenDimensions.widthScreen * 0.3,
      backgroundColor: '#ffffff',
      marginVertical: ScreenDimensions.heightScreen * 0.02,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
      borderRadius: 15,
      borderColor: '#bfbfbf',
      borderWidth: 1,

    },
    buttonSubTitleContent: {
      color: '#999999',
      fontSize: ScreenDimensions.widthScreen * 0.04,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
    },
    cancelTitleContent: {
      color: '#808080',
      fontSize: ScreenDimensions.widthScreen * 0.04,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
    },
    equipmentContent: {
      color: '#808080',
      fontSize: ScreenDimensions.widthScreen * 0.04,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
    },
    keyContainer: {
      marginTop: 50,
    },
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
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingRight: 15,
      paddingLeft: 15,
      marginTop: 20
    },
    heading: {
      color: COLORS.primary,
      fontSize: SIZES.body3,
      fontWeight: 'bold'
    },
    buttonsContainer: {
      zIndex: 100,
      padding: 10,
      display: 'flex',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center'
    },
    buttonSubmit: {
      width: ScreenDimensions.widthScreen * 0.8,
      color: COLORS.primary,
      backgroundColor: COLORS.primary,
      padding: 3,
      borderRadius: 5,
    },
    fieldContainer: {
      marginBottom: 10,
      marginTop: 10
    },
    fieldContainerRow: {
      marginBottom: 10,
      marginTop: 10,
      minHeight: 310,
    },
    fieldContainerRowDepartment: {
      marginBottom: 10,
      marginTop: 10,
      minHeight: 200,
    },
    fieldContainerRowShip: {
      marginBottom: 10,
      marginTop: 10,
      minHeight: 130,
    },
    fieldContainerCenter: {
      marginBottom: 10,
      marginTop: 10,
      flex: 1,
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
    blueText: {
      color: COLORS.primary,
      fontSize: SIZES.body3,
      marginBottom: 10
    },
    required: {
      color: 'red',
      fontSize: SIZES.body3
    },
    smallGreyText: {
      color: COLORS.darkgray,
      fontSize: SIZES.body5,
      marginTop: 4,
      marginLeft: 5
    },
    textArea: {
      borderColor: COLORS.lightGray3,
      borderWidth: 1,
      borderRadius: 5,
      fontSize: 15,
      minHeight: 50,
      padding: 5,
      marginTop: 10
    },
    inline: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
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
      zIndex: 10000,
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

