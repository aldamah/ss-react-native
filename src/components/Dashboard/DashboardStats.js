import React from "react";
import { FlatList, Text, View } from "react-native";
import { Card } from "react-native-elements";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { connectActionSheet } from "@expo/react-native-action-sheet";

import { NetworkContext } from "../../../NetworkProvider";
import { StyleDashboardStats } from "./StyleDashboardStats";
import { TouchableOpacity } from "react-native";

class DashboardStats extends React.Component {
  static contextType = NetworkContext;
  //historique Item
  renderItemResults = ({ item }) => (
    <TouchableOpacity onPress={() => this.props.navigation.navigate(item.screen)}>
      <Card containerStyle={{ borderRadius: 5 }}>
        <View key={item._id}>
          <Text style={StyleDashboardStats.cardValue}>{item.value}</Text>
          <Text style={StyleDashboardStats.cardLabel}>{item.label}</Text>
        </View>
      </Card>
    </TouchableOpacity>
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
  injectIntl(connect(mapStateToProps)(DashboardStats))
);
