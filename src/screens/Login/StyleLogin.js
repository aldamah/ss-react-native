import { StyleSheet, Platform } from 'react-native';
import ScreenDimensions from '../../configs/ScreenDimensions';
import { COLORS, SIZES } from '../../configs/theme';
import { getStatusBarHeight } from 'react-native-iphone-x-helper'

export const StyleLogin = StyleSheet.create(
    {
        isLoggedIn: {
            flex: 1,
            backgroundColor: 'rgba(0, 54, 84, 0.2)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        orangeError: {
            backgroundColor: COLORS.orange,
            width: ScreenDimensions.widthScreen,
          },
          orangeErrorText: {
            color: COLORS.white,
            fontWeight: 'bold',
            fontSize: SIZES.body5,
            textAlign: 'center',
            padding: 5
          },
        container: {
            flex: 1,
            backgroundColor: '#00004d',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: getStatusBarHeight(true)
            // zIndex:1,:
        },

        imgContainer: {
            height: ScreenDimensions.heightScreen * 0.25,
            alignItems: 'center',
            alignContent: 'center',
            top: 80

        },
        imgContent: {
            ...Platform.select({
                ios: {
                    width: 162.9,
                    height: 67.5,
                    alignSelf: 'center',

                },
                android: {
                    width: 162.9,
                    height: 67.5,
                    alignSelf: 'center',

                }
            })
        },
        formContainer: {
            width: ScreenDimensions.widthScreen,
            alignSelf: 'center',
            alignItems: 'center',
            marginTop: 60,
            height: ScreenDimensions.heightScreen * 0.52,

        },
        inputView: {
            backgroundColor: "#ffffff",
            borderRadius: 5,
            marginBottom: 20,
            width: ScreenDimensions.widthScreen * 0.8,
            height: 40,
            alignItems: "center",
            alignContent: 'center',
            justifyContent: 'center',
        },
        inputScrollView: {
            height: ScreenDimensions.heightScreen * 0.1,
        },
        TextInput: {
            height: 50,
            width: ScreenDimensions.widthScreen * 0.6,
            alignItems: "center",
            alignContent: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            flex: 1,
            padding: 10,
            fontSize:15
            // marginLeft: 20,
        },
        TextInputEmail: {
            alignItems: "center",
            alignContent: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            padding: 10,
        },
        loginBtn: {
            marginTop:30,
            height:40,
            width: ScreenDimensions.widthScreen * 0.8,
            color: COLORS.primary,
            backgroundColor: COLORS.primary,
            padding: 3,
            borderRadius: 5,
        },
        loginOffBtn: {
            width: ScreenDimensions.widthScreen * 0.9,
            borderRadius: 25,
            height: ScreenDimensions.heightScreen * 0.08,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: ScreenDimensions.heightScreen * 0.02,
        },
        loginText: {
            fontWeight: 'bold',
            fontSize: ScreenDimensions.widthScreen * 0.06,
            color: '#e6f5ff',
            alignSelf: 'center',
        },
        buttonImage: {
            // resizeMode: 'contain',
            height: ScreenDimensions.heightScreen * 0.03,
            width: ScreenDimensions.heightScreen * 0.03,
        },
        touchableImage: {
            position: 'absolute',
            right: ScreenDimensions.widthScreen * 0.04,
            // top: 20,
            alignItems: "center",
            alignSelf: "center",

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
            justifyContent:"space-around",
            alignContent: "center",
            borderRadius: ScreenDimensions.widthScreen * 0.05,
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
            borderBottomWidth:7,
            borderBottomColor: COLORS.redError,
            paddingHorizontal:16,
            
        },
        closeButton: {
            width: ScreenDimensions.heightScreen * 0.025,
            height: ScreenDimensions.heightScreen * 0.025,
            resizeMode: 'contain',
            alignSelf: 'center'
        },
        closeButtonContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#DBE4F0',
            top: -14,
            right: -(ScreenDimensions.widthScreen * 0.56),
            width: ScreenDimensions.heightScreen * 0.045,
            height: ScreenDimensions.heightScreen * 0.045,
            borderRadius: (ScreenDimensions.heightScreen * 0.045) / 2,
        },
        popupText: {
            fontSize: 15,
            color: '#595959',
        },
        popupTextErrorTitle: {
            fontWeight: 'bold',
            alignSelf: 'flex-start',
            fontSize: ScreenDimensions.widthScreen * 0.07,
            color: COLORS.redError
        },
        errorMode: {
           flexDirection: "column",
           alignItems:'center',
           justifyContent:'center',
           alignContent:'center',
           paddingBottom:4
        },
        popupIconSad: {
            alignSelf: 'center',
            justifyContent: 'center',
            alignContent:'center',
            alignItems:'center',
            // paddingTop:ScreenDimensions.widthScreen*0.001,
            fontSize: 70,
            borderBottomColor: COLORS.redError,
            
        },
        popupConnexion: {
            flexDirection: 'row',
            height: ScreenDimensions.heightScreen * 0.05,
            width: ScreenDimensions.widthScreen * 0.9,
            backgroundColor: 'rgba(234, 231, 230, 0.5)',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: (ScreenDimensions.widthScreen * 0.8) / 2,
            marginVertical: ScreenDimensions.heightScreen * 0.05,
        },
        popupCloseConnexion: {
            position: 'absolute',
            right: 10
        },
        popupTextConnexion: {
            color: 'rgba(234, 231, 230, 0.5)',
            fontSize: ScreenDimensions.widthScreen * 0.05,
        },
        versionTitle: {
            color: '#ffffff',
            opacity: 0.8,
        },
        bottom: {
            alignSelf: 'center',
            fontSize: 13,
            bottom: 0,
            position: 'absolute'
        },
        iconWorldContainer: {
            alignSelf: 'flex-end',
            marginRight:40,
            marginTop:10
        },
        iconWorld: {
            width:30,
            height:30
        }
    })