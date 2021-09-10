import { Platform, Dimensions } from 'react-native'
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
const ScreenDimensions = {
  widthScreen: width < height ? width : Platform.OS == 'ios' ? height : height * 1 ,
  heightScreen: width < height ? Platform.OS == 'ios' ? height : height * 1: width,
}
export default ScreenDimensions
