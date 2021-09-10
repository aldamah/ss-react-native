import React from "react";
import { Card } from "react-native-elements";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { PieChart } from "react-native-chart-kit";

import ScreenDimensions from "../../configs/ScreenDimensions";
import { COLORS } from "../../configs/theme";

class DashboardPieChart extends React.Component {
  render() {
    const { data, intl } = this.props;

    const chartData = [
      {
        name: intl.formatMessage({
          id: "dashboard.late",
          defaultMessage: "Late",
        }),
        value: data.late,
        color: "#FE4560",
        legendFontColor: COLORS.primary,
        legendFontSize: 11,
      },
      {
        name: intl.formatMessage({
          id: "dashboard.almostLate",
          defaultMessage: "Almost late",
        }),
        value: data.almostLate,
        color: "#FEAF1A",
        legendFontColor: COLORS.primary,
        legendFontSize: 11,
      },
      {
        name: intl.formatMessage({
          id: "dashboard.onTime",
          defaultMessage: "On time",
        }),
        value: data.onTime,
        color: "#00E495",
        legendFontColor: COLORS.primary,
        legendFontSize: 11,
      },
    ];

    const chartConfig = {
      backgroundGradientFrom: "#1E2923",
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: "#08130D",
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5,
      useShadowColorFromDataset: false, // optional
    };

    return (
        <Card containerStyle={{ padding: 0, borderRadius: 5 }}>
          <PieChart
            data={chartData}
            width={ScreenDimensions.widthScreen * 0.88}
            height={180}
            chartConfig={chartConfig}
            accessor={"value"}
            backgroundColor={"transparent"}
            center={[5, 0]}
            absolute
          />
        </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  FilterReducer: state.FilterReducer,
  TaskReducer: state.TaskReducer,
  AuthReducer: state.AuthReducer,
});
export default connectActionSheet(
  injectIntl(connect(mapStateToProps)(DashboardPieChart))
);
