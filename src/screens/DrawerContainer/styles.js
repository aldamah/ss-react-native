import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'column',
   
    justifyContent: 'center',
    backgroundColor: '#00004d',
  },
  contentMenu: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00004d',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 20
  },
  versionTitle: {
    color: '#ffffff',
    opacity: 0.8,
    fontSize: 13,
  },
  bottom: {
    bottom: -150
  },
  iconWorldContainer: {
    alignSelf:'flex-end',
    marginRight: 20,
    marginTop: 20
  },
  iconWorld: {
    width: 30,
    height: 30
  }
});

export default styles;
