import { StyleSheet } from "react-native"
import Colors from "../../configs/Colors"
import ScreenDimensions from "../../configs/ScreenDimensions"

export const StyleMyButton = StyleSheet.create({
    buttonAuth: {
        height: ScreenDimensions.heightScreen * 0.09,
        width: ScreenDimensions.widthScreen * 0.85,
        backgroundColor: Colors.yellow,
        borderRadius: ScreenDimensions.widthScreen * 0.08,
        alignSelf: 'center',
        alignItems:"center",
        marginBottom: ScreenDimensions.heightScreen * 0.008,
        justifyContent:"space-around",
        flexDirection:"row",
    },
    textButton: {
        color: Colors.white,
        fontSize: ScreenDimensions.heightScreen * 0.027,
        fontFamily:'segoeui',
        alignSelf: 'center'
    },
})