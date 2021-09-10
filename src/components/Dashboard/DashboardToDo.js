import React from "react";
import { FlatList, Text, View } from "react-native";
import { Card } from "react-native-elements";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { DateTime } from "luxon";
import Icon from "react-native-vector-icons/MaterialIcons";

import { NetworkContext } from "../../../NetworkProvider";
import { StyleDashboardStats } from "./StyleDashboardStats";
import { COLORS } from "../../configs/theme";
import { TouchableOpacity } from "react-native";

class DashboardToDo extends React.Component {
  static contextType = NetworkContext;
  //historique Item
  renderItemResults = ({ item }) => (
    <Card containerStyle={{ borderRadius: 5 }}>
      <TouchableOpacity key={item._id} style={StyleDashboardStats.cardContainer} onPress={() => this.props.navigation.navigate('TaskInformation', {item:item})}>
        <View style={StyleDashboardStats.cardRow}>
          <Text style={StyleDashboardStats.cardTitle}>{item.name}</Text>
        </View>
        <View style={StyleDashboardStats.cardRow}>
          <Icon
            name="access-alarm"
            color={COLORS.gray1}
            size={20}
            style={{ marginRight: 10 }}
          />
          <Text style={StyleDashboardStats.cardInformation}>
            {this.props.intl.formatDate(DateTime.fromISO(item.dueDate), {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </Text>
        </View>
        <View style={StyleDashboardStats.cardRow}>
          <Icon
            name="directions-boat"
            color={COLORS.gray1}
            size={20}
            style={{ marginRight: 10 }}
          />
          <Text style={StyleDashboardStats.cardInformation}>
            {item.ship.name}
          </Text>
          <Text style={StyleDashboardStats.cardInformation}>     </Text>
          <Icon
            name="settings"
            color={COLORS.gray1}
            size={20}
            style={{ marginRight: 10 }}
          />
          <Text style={StyleDashboardStats.cardEquipment}>
            {item.equipment.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Card>
  );

  render() {
    return (
        <FlatList
          vertical
          showsVerticalScrollIndicator={true}
          bounce={false}
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          data={this.props.data}
          renderItem={this.renderItemResults}
          onEndReachedThreshold={0.5}
          keyExtractor={(item, index) => item?._id}
        />
    );
  }
}

const mapStateToProps = (state) => ({
  FilterReducer: state.FilterReducer,
  TaskReducer: state.TaskReducer,
  AuthReducer: state.AuthReducer,
});
export default connectActionSheet(
  injectIntl(connect(mapStateToProps)(DashboardToDo))
);
