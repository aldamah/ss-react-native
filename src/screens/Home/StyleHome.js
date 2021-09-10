import { StyleSheet } from 'react-native';
import ScreenDimensions from '../../configs/ScreenDimensions';

// screen sizing

// orientation must fixed
const SCREEN_WIDTH = ScreenDimensions.widthScreen < ScreenDimensions.heightScreen ? ScreenDimensions.widthScreen : ScreenDimensions.heightScreen;

const taskNumColums = 2;
// item size
const TASK_ITEM_HEIGHT = 150;
const TASK_ITEM_MARGIN = 20;

const styles = StyleSheet.create({
 container:{
   flex: 1,
   alignItems: 'center',
   alignContent: 'center',
   paddingVertical: 5,
 },
  content: {
    // flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    marginLeft: TASK_ITEM_MARGIN,
    marginTop: 20,
    width: ScreenDimensions.widthScreen * 0.9,
    height: TASK_ITEM_HEIGHT + 75,
    borderColor: '#cccccc',
    borderWidth: 0.5,
    borderRadius: 15,
  },
  photo: {
    top:5,
    alignSelf: 'center',

  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#444444',
    marginTop: 3,
    marginRight: 5,
    marginLeft: 5,
  },
  category: {
    marginTop: 5,
    marginBottom: 5
  }
});

export default styles;
