import { StyleSheet, Platform } from 'react-native';
import ScreenDimensions from '../../configs/ScreenDimensions';

export const StyleAuth = StyleSheet.create(
    {
        isLoggedIn:{
            flex: 1,
            backgroundColor: 'rgba(0, 54, 84, 0.2)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        container: {
            flex: 1,
            backgroundColor: '#00004d',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex:1,
        },
       
        imgContainer: {
            height: ScreenDimensions.heightScreen * 0.3,
            alignItems: 'center',
            alignContent:'center',
            top:80
            
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
            height: ScreenDimensions.heightScreen * 0.4,
            width: ScreenDimensions.widthScreen,
            alignSelf: 'center',
            alignItems: 'center',
            marginTop:60,
        },
        inputView: {  
            backgroundColor: "#ffffff",
            borderRadius: 30,
            marginBottom: 20,
            width: ScreenDimensions.widthScreen * 0.8,
            height: ScreenDimensions.heightScreen * 0.08,    
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
            // marginLeft: 20,
        },
        loginBtn: {
            width: ScreenDimensions.widthScreen * 0.9,
            borderRadius: 25,
            height: ScreenDimensions.heightScreen * 0.08,
            alignItems: "center",
            justifyContent: "center",
            alignContent: 'center',
            textAlign: 'center',
            marginVertical: ScreenDimensions.heightScreen * 0.02,
            backgroundColor: "#4db8ff",
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
            resizeMode: 'contain',
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
            alignSelf: 'center',
            width: ScreenDimensions.widthScreen * 0.6,
            height: ScreenDimensions.heightScreen * 0.2,
            backgroundColor: '#DBE4F0',
            textAlign: "center",
            borderRadius: ScreenDimensions.widthScreen * 0.05,
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
            fontWeight: 'bold',
            alignSelf: "center",
            fontSize: ScreenDimensions.widthScreen * 0.05,
            textAlign: "center",
            color: '#595959'
        },
        popupIconSad: {
            alignSelf: 'center',
            fontSize: 50,
        },
        popupConnexion:{
            flexDirection: 'row',
            height: ScreenDimensions.heightScreen *0.05,
            width: ScreenDimensions.widthScreen *0.9,
            backgroundColor: 'rgba(234, 231, 230, 0.5)',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems:'center',
            borderRadius: (ScreenDimensions.widthScreen *0.8)/2,
            marginVertical: ScreenDimensions.heightScreen *0.05,
        },
        popupCloseConnexion: {
            position: 'absolute',
            right:10
        },
        popupTextConnexion:{
            color:'rgba(234, 231, 230, 0.5)',
            fontSize: ScreenDimensions.widthScreen * 0.05,
        }

    })