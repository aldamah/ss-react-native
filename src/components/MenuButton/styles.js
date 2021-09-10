import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  btnClickContain: {
    flexDirection: 'row',
    padding: 5,
    marginTop: 5,
    marginBottom: 5
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  btnIcon: {
    alignSelf:'center'
  },
  btnText: {
    fontSize: 16,
    marginLeft: 10,
    marginTop: 2,
    color: '#ffffff'
  }
});

export default styles;
