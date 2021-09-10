import React from "react";
import { TouchableHighlight, Alert } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import styles from "./styles";

class BackButton extends React.Component {
  render() {
    const { TaskReducer, FilterReducer } = this.props;
    return TaskReducer.taskName === "Unplanned" ? (
      <TouchableHighlight
        onPress={
          FilterReducer?.goBackToUnplanned
            ? this.props.backToUnplanned
            : this.props.onPress
        }
        style={styles.btnContainer}
        underlayColor="rgba(128, 128, 128, 0.1)"
      >
        <Icon name="leftcircle" size={30} color="#ffffff" />
      </TouchableHighlight>
    ) : (
      <TouchableHighlight
        onPress={this.props.onPress}
        style={styles.btnContainer}
        underlayColor="rgba(128, 128, 128, 0.1)"
      >
        <Icon name="leftcircle" size={30} color="#ffffff" />
      </TouchableHighlight>
    );
  }
}

BackButton.propTypes = {
  onPress: PropTypes.func,
  backToUnplanned: PropTypes.func,
  source: PropTypes.number,
  title: PropTypes.string,
};

const mapStateToProps = (state) => ({
  FilterReducer: state.FilterReducer,
  TaskReducer: state.TaskReducer,
});

export default connect(mapStateToProps)(BackButton);
