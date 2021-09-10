import { StyleSheet, } from 'react-native';
import { COLORS, SIZES } from '../../configs/theme';

export const StyleDashboard = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray3,
    flexDirection: 'column',
    alignContent: "center"
  },
  headerContainer: {
    paddingRight: 15,
    paddingLeft: 15,
  },
  heading: {
    marginTop:32,
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: 'bold'
  },
  viewMore :  {
    marginTop:15,
    color: COLORS.primary,
    fontSize: SIZES.body3,
    fontWeight: 'bold'
  },
  ViewMoreContainer: {
    display: 'flex',
    alignSelf:'center',
    paddingRight: 15,
    paddingLeft: 15,
    marginBottom: 45
  },
  notConnected : {
    flex: 1,
    backgroundColor: COLORS.lightGray3,
    alignContent:'center',
    justifyContent:'center'
  }
})
