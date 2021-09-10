import { StyleSheet } from 'react-native';

// screen sizing
import ScreenDimensions from '../../configs/ScreenDimensions';
import { COLORS } from '../../configs/theme';
// orientation must fixed
const SCREEN_WIDTH = ScreenDimensions.widthScreen < ScreenDimensions.heightScreen ? ScreenDimensions.widthScreen : ScreenDimensions.heightScreen;

const taskNumColums = 2;
// item size
const TASK_ITEM_HEIGHT = 150;
const TASK_ITEM_MARGIN = 20;

export const StyleTaskInformation = StyleSheet.create(
  {
    main: {
      flex: 1,
      backgroundColor: '#e6f9ff',
      paddingHorizontal: ScreenDimensions.widthScreen * 0.05,

    },
    dateContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      alignSelf: 'center',
      height: ScreenDimensions.heightScreen * 0.1,

    },
    dateTitle: {
      position: 'absolute',
      top: 10,
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
      backgroundColor: '#ffffff'
    },
    datePickerContainer: {
      display: 'flex',
      flex: 1,
      justifyContent: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center'
    },
    datePickerContent: {
      borderColor: COLORS.lightGray3,
      borderWidth: 1,
      borderRadius: 5,
      paddingLeft: 5,
      paddingRight: 5,
      width: '90%'
    },
    datePickerTitle: {
      color: '#d9d9d9',
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
      marginTop: ScreenDimensions.heightScreen * 0.01,
    },
    InfoUPContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      alignSelf: 'center',
      textAlign: 'center',
      marginTop: ScreenDimensions.heightScreen * 0.05,
      // backgroundColor: '#ffffff',
      marginVertical: 10,
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
    numInformation: {
      flexDirection: 'row',
      alignItems: 'center',
      width: ScreenDimensions.widthScreen * 0.56,
      height: ScreenDimensions.heightScreen * 0.05,
      backgroundColor: '#ffffff',
      marginVertical: ScreenDimensions.heightScreen * 0.05,
    },
    numContent: {
      // marginRight: ScreenDimensions.widthScreen * 0.2,
      paddingLeft: ScreenDimensions.widthScreen * 0.05,
      height: ScreenDimensions.heightScreen * 0.08,
      width: ScreenDimensions.widthScreen * 0.4,
    },
    commentContent: {
      height: ScreenDimensions.heightScreen * 0.1,
      width: ScreenDimensions.widthScreen * 0.8,
      backgroundColor: '#ffffff',
      marginVertical: ScreenDimensions.heightScreen * 0.02,
      paddingHorizontal: 10,

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

    },
    buttonIcon: {
      position: 'absolute',
      left: 20,
    },
    buttonClose: {
      borderColor: "#33ff77",
      borderWidth: 0.5,
      width: ScreenDimensions.widthScreen * 0.8,
      marginVertical: ScreenDimensions.heightScreen * 0.02,
      backgroundColor: "#e6ffee",
      height: 40
    },
    textClose: {
      color: "#00cc44",
      fontSize: ScreenDimensions.widthScreen * 0.04,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
    },
    buttonEdit: {
      height: 40,
      width: ScreenDimensions.widthScreen * 0.8,
      borderColor: "#80bfff",
      borderWidth: 0.5,
      backgroundColor: "#ccf2ff",
      marginVertical: ScreenDimensions.heightScreen * 0.02,
     
    },
    textEdit: {
      color: "#80bfff",
      fontSize: ScreenDimensions.widthScreen * 0.04,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
    },
    buttonDisable: {
      height: 40,
      width: ScreenDimensions.widthScreen * 0.8,
      borderColor: "#ff0000",
      borderWidth: 0.5,
      backgroundColor: "#ffe6e6",
      marginVertical: ScreenDimensions.heightScreen * 0.02,
    },
    textDisable: {
      color: "#ff6666",
      fontSize: ScreenDimensions.widthScreen * 0.04,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
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
    buttonTitleContent: {
      color: '#ffffff',
      fontSize: ScreenDimensions.widthScreen * 0.04,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
    },
    buttonTitleCapContent: {
      // color: '#ffffff',
      fontWeight: 'bold',
      fontSize: ScreenDimensions.widthScreen * 0.04,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
    },
    unplannedInformation: {
      paddingTop: ScreenDimensions.heightScreen * 0.15,
      width: ScreenDimensions.widthScreen * 0.6,
      height: ScreenDimensions.heightScreen * 0.2,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    },
    unplannedInformationTitle: {
      fontSize: ScreenDimensions.widthScreen * 0.04,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
      marginTop: 10,
    },
    informationName: {
      fontSize: ScreenDimensions.widthScreen * 0.04,
      alignSelf: 'center',
      textAlign: 'center',
      width: ScreenDimensions.widthScreen * 0.6,
      height: ScreenDimensions.heightScreen * 0.05,
      backgroundColor: '#ffffff',
      margin: 10,
      // marginVertical: ScreenDimensions.heightScreen * 0.02,
    },
    Information: {
      marginBottom: ScreenDimensions.heightScreen * 0.04,
    },
    down: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      marginVertical: ScreenDimensions.heightScreen * 0.03,

    },
    downInformation: {
      flexDirection: 'row',
      backgroundColor: '#66ccff',
      alignContent: 'space-around',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      width: ScreenDimensions.widthScreen * 0.8,
      height: ScreenDimensions.heightScreen * 0.05,
      borderWidth: 0.5,
      borderColor: '#66ccff',
      borderRadius: 10,
      marginVertical: ScreenDimensions.heightScreen * 0.03,
    },
    downTitleInformation: {
      fontSize: ScreenDimensions.widthScreen * 0.04,
      fontWeight: 'bold',
      alignSelf: 'center',
      textAlign: 'center',
      color: '#808080',
      marginRight: ScreenDimensions.widthScreen * 0.02,

    },
    downTitle: {
      fontSize: ScreenDimensions.widthScreen * 0.04,
      fontWeight: 'bold',

    },
    downStateContainer: {
      width: ScreenDimensions.widthScreen * 0.6,
      height: ScreenDimensions.heightScreen * 0.04,
      borderWidth: 0.5,
      borderColor: '#ffcc99',
      backgroundColor: '#fff2e6',
      borderRadius: 5,
      alignContent: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      margin: 5,
    },
    downTitleState: {
      fontSize: ScreenDimensions.widthScreen * 0.04,
      fontWeight: 'bold',
      color: '#ffbf80',
      textAlign: 'center',
      borderRadius: 10,
    },
    downTask: {
      fontSize: ScreenDimensions.widthScreen * 0.04,
      width: ScreenDimensions.widthScreen * 0.8,
      height: ScreenDimensions.heightScreen * 0.05,
      borderWidth: 0.5,
      borderColor: '#808080',
      borderRadius: 10,
      alignContent: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      borderWidth: 0.5,
      borderColor: '#ffffff',
      borderRadius: 10,
      backgroundColor: '#ffffff',
    },
    downUNTask: {
      fontSize: ScreenDimensions.widthScreen * 0.04,
      width: ScreenDimensions.widthScreen * 0.8,
      height: ScreenDimensions.heightScreen * 0.1,
      borderWidth: 0.5,
      borderColor: '#808080',
      borderRadius: 10,
      alignContent: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      borderWidth: 0.5,
      borderColor: '#ffffff',
      borderRadius: 10,
      backgroundColor: '#ffffff',
    },
    historiqueTitleContainer: {
      alignSelf: 'center',
      width: ScreenDimensions.widthScreen * 0.5,
      height: ScreenDimensions.widthScreen * 0.2,
      borderLeftColor: '#cccccc',
      borderLeftWidth: 5,
      position: 'absolute',

    },
    circleHistorique: {
      width: ScreenDimensions.widthScreen * 0.05,
      height: ScreenDimensions.widthScreen * 0.05,
      borderRadius: (ScreenDimensions.widthScreen * 0.05) / 2,
      backgroundColor: '#cccccc',
      position: 'absolute',
      left: -12,
      top: -5,

    },
    infoHistorique: {
      width: ScreenDimensions.widthScreen * 0.5,
      height: ScreenDimensions.widthScreen * 0.2,
      // backgroundColor: '#cccccc',
      borderLeftColor: '#cccccc',
      borderLeftWidth: 5,
    },
    historiqueNoComment: {
      fontSize: ScreenDimensions.widthScreen * 0.04,
      fontStyle: "italic",
      textAlign: 'center',
      margin: ScreenDimensions.widthScreen * 0.02,
    },
    downTaskSec: {
      width: ScreenDimensions.widthScreen * 0.8,
      height: ScreenDimensions.heightScreen * 0.2,
      borderWidth: 0.5,
      borderColor: '#ffffff',
      borderRadius: 10,
      alignContent: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      margin: ScreenDimensions.widthScreen * 0.02,
      backgroundColor: '#ffffff'
    },
    downTaskS: {
      width: ScreenDimensions.widthScreen * 0.8,
      height: ScreenDimensions.heightScreen * 0.2,
      borderWidth: 0.5,
      borderColor: '#ffffff',
      borderRadius: 10,
      alignContent: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      margin: ScreenDimensions.widthScreen * 0.02,
      paddingVertical: ScreenDimensions.widthScreen * 0.07,
      backgroundColor: '#ffffff'
    },
    downSCroll: {
      borderWidth: 0.5,
      borderColor: '#ffffff',
      borderRadius: 10,


    },
    downTaskSe: {

      // alignContent: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',

    },
    historique: {
      width: ScreenDimensions.widthScreen * 0.8,
      height: ScreenDimensions.heightScreen * 0.2,
      borderWidth: 0.5,
      borderColor: '#ffffff',
      borderRadius: 10,
      alignContent: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      margin: ScreenDimensions.widthScreen * 0.02,
      marginHorizontal: ScreenDimensions.widthScreen * 0.05,
      backgroundColor: '#ffffff'
    },
    downTaskSecText: {
      fontSize: ScreenDimensions.widthScreen * 0.04,
      // alignSelf: 'center',
      // justifyContent: 'center',
      // alignItems: 'center',
      // alignContent: 'center',
      // textAlign: 'center',
      padding: 10,
    },
    hoursMeters: {
      fontSize: ScreenDimensions.widthScreen * 0.1,
      fontWeight: 'bold',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
      padding: 10,
    },
    dateMeters: {
      fontSize: ScreenDimensions.widthScreen * 0.04,
      fontWeight: 'bold',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
      padding: 10,
    },
    downTaskNotice: {
      flexDirection: 'row',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
    },
    downTaskSecNotice: {
      fontSize: ScreenDimensions.widthScreen * 0.04,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
      padding: 10,
      color: '#a6a6a6'
    },
    UNtaskButton: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
    },
    SwitchContainer: {
      // justifyContent: 'space-between', 
      flexDirection: 'column',
    },
    SwitchContent: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
      flexDirection: 'row',
      marginVertical: ScreenDimensions.heightScreen * 0.01,

    },
    switch: {
      marginHorizontal: ScreenDimensions.widthScreen * 0.01,

    },
    SwitchValueOff: {
      fontSize: ScreenDimensions.widthScreen * 0.04,
      color: "#000000",
    },
    SwitchValueOn: {
      color: "#1a75ff",
      fontSize: ScreenDimensions.widthScreen * 0.04,
    },
    attachmentContainer: {
      marginBottom: 10,
      marginTop: 10,
      
    },
    uploadContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth:1,
      borderStyle: 'dashed',
      borderColor:'#c0c4cc',
      borderRadius: 1,
      justifyContent:'space-between',
      padding:10
    },
    uploadedFile: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderColor:'#c0c4cc',
      borderRadius: 1,
      justifyContent:'space-between',
      padding:10
    },
    fileName: {
      width: ScreenDimensions.widthScreen * 0.7
    }
  })

