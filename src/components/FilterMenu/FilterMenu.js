import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { connect } from "react-redux";
import { Badge } from "react-native-elements";

class FilterMenu extends React.Component {

  pressVisibility() {
    const { FilterReducer, TaskReducer } = this.props;
    if (TaskReducer.taskName === "Meters") {
      const action = {
        type: "VISIBLE_METER_ACTION",
        value: !FilterReducer.visibleMeter,
      };
      this.props.dispatch(action);
    } else if (TaskReducer.taskName === "Planned") {
      const actionP = { type: "VISIBLE_ACTION", value: !FilterReducer.visible };
      this.props.dispatch(actionP);
    } else {
      const actionV = {
        type: "VISIBLE_UNPLANNED_ACTION",
        value: !FilterReducer.visibleUnplanned,
      };
      this.props.dispatch(actionV);
    }
  }
  
  render() {
    const { FilterReducer } = this.props;
    return (
      <TouchableOpacity
        style={styles.headerButtonContainer}
        onPress={() => this.pressVisibility()}
      >
        <MaterialCommunityIcons
          name="filter-outline"
          size={30}
          color="#ffffff"
        />
        {FilterReducer.badgeShip ? (
          <Badge status="error" containerStyle={styles.badgeStyle} value="1" />
        ) : null}
        {FilterReducer.badgeShip && FilterReducer.badgeDepartment ? (
          <Badge status="error" containerStyle={styles.badgeStyle} value="2" />
        ) : null}
        {FilterReducer.badgeShip &&
        FilterReducer.badgeDepartment &&
        FilterReducer.badgeEquipment ? (
          <Badge status="error" containerStyle={styles.badgeStyle} value="3" />
        ) : null}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  headerButtonContainer: {
    padding: 10,
  },
  headerButtonImage: {
    justifyContent: "center",
    width: 25,
    height: 25,
    margin: 6,
  },
  badgeStyle: {
    position: "absolute",
    top: 2,
    right: 2,
  },
});
const mapStateToProps = (state) => ({
  FilterReducer: state.FilterReducer,
  TaskReducer: state.TaskReducer,
});
export default connect(mapStateToProps)(FilterMenu);
