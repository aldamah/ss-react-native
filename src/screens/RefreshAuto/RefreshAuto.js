import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { connect } from "react-redux";
import axios from "axios";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { injectIntl } from "react-intl";

import API from "../../configs/API";
import PlannedOffline from "../../dbSQLite/PlannedOffline";
import PlannedUpdateOffline from "../../dbSQLite/PlannedUpdateOffline";
import PlannedNoRemarkOffline from "../../dbSQLite/PlannedNoRemarkOffline";
import PlannedUpdateNoRemarkOffline from "../../dbSQLite/PlannedUpdateNoRemarkOffline";
import AddOffline from "../../dbSQLite/AddOffline";
import AddNoDueDateOffline from "../../dbSQLite/AddNoDueDateOffline";
import EditOffline from "../../dbSQLite/EditOffline";
import EditNoDueDateOffline from "../../dbSQLite/EditNoDueDateOffline";
import ResolveOffline from "../../dbSQLite/ResolveOffline";
import DisableOffline from "../../dbSQLite/DisableOffline";
import ChangeLanguageOffline from "../../dbSQLite/ChangeLanguageOffline";
import AttachmentOffline from "../../dbSQLite/AttachmentOffline";
import MeterOffline from "../../dbSQLite/MeterOffline";
import { COLORS } from "../../configs/theme";
import ScreenDimensions from "../../configs/ScreenDimensions";
import { NetworkContext } from "../../../NetworkProvider";
import {
  beforeFileUpload,
  upload,
  fileUploadSuccess,
  getOfflineAttachments,
  deleteAttachment,
} from "../../components/TaskInformation/UploadHelper";

class RefreshAuto extends React.Component {
  static contextType = NetworkContext;
  static navigationOptions = ({ navigation }) => ({
    headerShown: false,
  });

  constructor(props) {
    super(props);
    this.state = {};
  }

  async PlannedTaskOffline() {
    await PlannedOffline.all()
      .then((planned) =>
        planned.forEach((item) => {
          if (item.subtask === "false") {
            this.resolutionPlannedTask(
              item.idTask,
              item.actualResolutionDate,
              item.resolutionHourMeterValue,
              item.remark,
              item.id,
              item.subtask
            );
          } else {
            this.updatePlannedHourSubTask(
              item.idTask,
              item.actualResolutionDate,
              item.resolutionHourMeterValue,
              item.remark,
              item.id
            );
          }
        })
      )
      .catch(function (error) {});
  }
  // subtask resolutionPlannedTask
  // async PlannedSubTaskOffline() {
  //   await PlannedOffline.all()
  //     .then((planned) =>
  //       planned.forEach((item) => {
  //         if (item.subtask === "true") {
  //           this.updatePlannedHourSubTask(
  //             item.idTask,
  //             item.actualResolutionDate,
  //             item.resolutionHourMeterValue,
  //             item.remark,
  //             item.id
  //           );
  //         }
  //       })
  //     )
  //     .catch(function (error) {});
  // }

  async PlannedNoRemarkTaskOffline() {
    await PlannedNoRemarkOffline.all()
      .then((planned) =>
        planned.forEach((item) => {
          if (item.subtask === "false") {
            this.resolutionPlannedTaskNoRemark(
              item.idTask,
              item.actualResolutionDate,
              item.resolutionHourMeterValue,
              item.id
            );
          } else {
            this.updatePlannedSubTaskHourNoRemark(
              item.idTask,
              item.actualResolutionDate,
              item.resolutionHourMeterValue,
              item.id
            );
          }
        })
      )
      .catch(function (error) {});
  }
  // subtask resolutionPlannedTaskNoRemark
  // async PlannedNoRemarkSubTaskOffline() {
  //   await PlannedNoRemarkOffline.all()
  //     .then((planned) =>
  //       planned.forEach((item) => {
  //         if (item.subtask === "true") {
  //           this.updatePlannedSubTaskHourNoRemark(
  //             item.idTask,
  //             item.actualResolutionDate,
  //             item.resolutionHourMeterValue,
  //             item.id
  //           );
  //         }
  //       })
  //     )
  //     .catch(function (error) {});
  // }

  async PlannedUpdateTaskOffline() {
    await PlannedUpdateOffline.all()
      .then((planned) =>
        planned.forEach((item) => {
          if (item.subtask === "false") {
            this.updatePlannedTask(
              item.idTask,
              item.actualResolutionDate,
              item.remark,
              item.id
            );
          } else {
            this.updatePlannedSubTask(
              item.idTask,
              item.actualResolutionDate,
              item.remark,
              item.id
            );
          }
        })
      )
      .catch(function (error) {});
  }
  // subtask updatePlannedTask
  // async PlannedUpdateSubTaskOffline() {
  //   await PlannedUpdateOffline.all()
  //     .then((planned) =>
  //       planned.forEach((item) => {
  //         if (item.subtask === "true") {
  //           this.updatePlannedSubTask(
  //             item.idTask,
  //             item.actualResolutionDate,
  //             item.remark,
  //             item.id
  //           );
  //           //  console.log('item.remark',item.remark, item.subtask)
  //         }
  //       })
  //     )
  //     .catch(function (error) {});
  // }
  async PlannedUpdateNoRemarkTaskOffline() {
    await PlannedUpdateNoRemarkOffline.all()
      .then((planned) =>
        planned.forEach((item) => {
          if (item.subtask === "false") {
            this.updatePlannedTaskNoRemark(
              item.idTask,
              item.actualResolutionDate,
              item.id
            );
          } else {
            this.updatePlannedSubTaskNoRemark(
              item.idTask,
              item.actualResolutionDate,
              item.id
            );
          }
        })
      )
      .catch(function (error) {});
  }
  // subtask updatePlannedTaskNoRemark
  // async PlannedUpdateNoRemarkSubTaskOffline() {
  //   await PlannedUpdateNoRemarkOffline.all()
  //     .then((planned) =>
  //       planned.forEach((item) => {
  //         if (item.subtask === "true") {
  //           this.updatePlannedSubTaskNoRemark(
  //             item.idTask,
  //             item.actualResolutionDate,
  //             item.id
  //           );
  //         }
  //       })
  //     )
  //     .catch(function (error) {});
  // }

  handleToastOffline() {
    const errorMessage = this.props.intl.formatMessage({
      id: "planned.toast.errorSendingOffline",
      defaultMessage: "An error has occurred when sending offline content",
    });
    const errorType = "Error";

    const actionErrorText = { type: "TOAST_TEXT_ACTION", value: errorMessage };
    this.props.dispatch(actionErrorText);

    const actionErrorType = { type: "TOAST_TYPE_ACTION", value: errorType };
    this.props.dispatch(actionErrorType);
  }

  //send data offline Planned
  async fetchDataPlannedOffLine() {
    await Promise.all([
      this.PlannedTaskOffline(),
      // this.PlannedSubTaskOffline(),
      this.PlannedNoRemarkTaskOffline(),
      //  this.PlannedNoRemarkSubTaskOffline(),
      this.PlannedUpdateTaskOffline(),
      //  this.PlannedUpdateSubTaskOffline(),
      this.PlannedUpdateNoRemarkTaskOffline(),
      // this.PlannedUpdateNoRemarkSubTaskOffline(),
    ]);
    await this.enlineModePlanned();
  }

  async getNextPlanned(token, nextToken) {
    return await axios.get(`${API.getPlannedTask}&next=${nextToken}`, {
      headers: {
        AUTHORIZATION: `Bearer ${token}`,
      },
    });
  }

  async enlineModePlanned() {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const response = await axios.get(API.getPlannedTask, {
      headers: {
        AUTHORIZATION: `Bearer ${token.accessToken}`,
      },
    });
    let data = [];
    data.push(response.data.results);
    let hasNext = response.data.hasNext;
    let next = response.data.next;
    while (hasNext) {
      try {
        const res = await that.getNextPlanned(token.accessToken, next);
        data.push(res.data.results);
        hasNext = res.data.hasNext;
        next = res.data.next;
      } catch (error) {
        hasNext = false;
        console.log(error);
      }
    }

    const actionPlanned = { type: "PLANNED_ACTION", value: data.flat() };
    that.props.dispatch(actionPlanned);
    that.disableToastPlanned();
  }

  async resolutionPlannedTask(
    idTask,
    actualResolutionDate,
    resolutionHourMeterValue,
    remark,
    id,
    subtaskS
  ) {
    const action = { type: "COMMENT_ACTION", value: "" };
    const that = this;
    this.props.dispatch(action);
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const data = {
      actualResolutionDate: actualResolutionDate,
      resolutionHourMeterValue: parseInt(resolutionHourMeterValue),
      remark: remark,
    };
    // console.log(idTask)
    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        that.closePlannedTask(idTask, id, subtaskS);
      })
      .catch(function (error) {
        that.handleToastOffline();

        PlannedOffline.remove(id)
          .then((updated) => console.log("Planned removed error: " + updated))
          .catch((err) => that.handleToastOffline());
      });
  }

  async updatePlannedHourSubTask(
    idTask,
    actualResolutionDate,
    resolutionHourMeterValue,
    remark,
    id
  ) {
    const { AuthReducer, TaskReducer } = this.props;
    const offLineMode = TaskReducer.plannedOffline;
    const that = this;
    const token = AuthReducer.token;

    let findId = offLineMode.filter((item) => {
      if (item._id === idTask) {
        return item._id === idTask;
      }
    });

    const updatedData = findId[0].subtasks.map((element, index) => {
      const data = {
        _id: element._id,
        value: element.value,
      };
      return data;
    });

    const data = {
      actualResolutionDate: actualResolutionDate,
      resolutionHourMeterValue: parseInt(resolutionHourMeterValue),
      remark: remark,
      subtasks: updatedData,
    };

    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        that.closePlannedSubTask(idTask, id);
      })
      .catch(function (error) {
        that.handleToastOffline();
        PlannedOffline.remove(id)
          .then((updated) => console.log("Planned removed error: " + updated))
          .catch((err) => that.handleToastOffline());
      });
  }

  //no remark
  async resolutionPlannedTaskNoRemark(
    idTask,
    actualResolutionDate,
    resolutionHourMeterValue,
    id
  ) {
    const action = { type: "COMMENT_ACTION", value: "" };
    const that = this;
    this.props.dispatch(action);
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const data = {
      actualResolutionDate: actualResolutionDate,
      resolutionHourMeterValue: parseInt(resolutionHourMeterValue),
    };
    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        that.closePlannedTaskNoRemark(idTask, id);
      })
      .catch(function (error) {
        that.handleToastOffline();

        PlannedNoRemarkOffline.remove(id)
          .then((updated) =>
            console.log("Planned No Remark removed: " + updated)
          )
          .catch((err) => that.handleToastOffline());
      });
  }

  async updatePlannedSubTaskHourNoRemark(
    idTask,
    actualResolutionDate,
    resolutionHourMeterValue,
    id
  ) {
    const { AuthReducer, TaskReducer } = this.props;
    const offLineMode = TaskReducer.plannedOffline;
    const that = this;
    const token = AuthReducer.token;

    let findId = offLineMode.filter((item) => {
      if (item._id === idTask) {
        return item._id === idTask;
      }
    });

    const updatedData = findId[0].subtasks.map((element, index) => {
      const data = {
        _id: element._id,
        value: element.value,
      };
      return data;
    });

    const data = {
      actualResolutionDate: actualResolutionDate,
      resolutionHourMeterValue: parseInt(resolutionHourMeterValue),
      subtasks: updatedData,
    };

    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        that.closePlannedSubTaskNoRemark(idTask, id);
        console.log("success");
      })
      .catch(function (error) {
        PlannedNoRemarkOffline.remove(id)
          .then((updated) =>
            console.log("Planned No Remark removed 1: " + error)
          )
          .catch((err) => that.handleToastOffline());
      });
  }

  async closePlannedSubTaskNoRemark(idTask, id) {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const datab = {
      status: "closed",
    };
    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: datab,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        PlannedNoRemarkOffline.remove(id)
          .then((updated) =>
            console.log("Planned No Remark removed ato: " + updated)
          )
          .catch((err) => that.handleToastOffline());
      })
      .catch(function (error) {
        PlannedNoRemarkOffline.remove(id)
          .then((updated) =>
            console.log("Planned No Remark removed error: " + error)
          )
          .catch((err) => that.handleToastOffline());
      });
  }

  async closePlannedTask(idTask, id) {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const datab = {
      status: "closed",
    };
    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: datab,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        PlannedOffline.remove(id)
          .then((updated) => console.log("Planned removed: " + updated))
          .catch((err) => that.handleToastOffline());
      })
      .catch(function (error) {
        PlannedOffline.remove(id)
          .then((updated) => console.log("Planned removed error: " + updated))
          .catch((err) => that.handleToastOffline());
      });
  }

  async closePlannedSubTask(idTask, id) {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const datab = {
      status: "closed",
    };
    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: datab,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        PlannedOffline.remove(id)
          .then((updated) => console.log("Planned removed: " + updated))
          .catch((err) => that.handleToastOffline());
      })
      .catch(function (error) {
        PlannedOffline.remove(id)
          .then((updated) => console.log("Planned removed error: " + updated))
          .catch((err) => that.handleToastOffline());
      });
  }

  async closePlannedTaskNoRemark(idTask, id) {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const datab = {
      status: "closed",
    };
    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: datab,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        PlannedNoRemarkOffline.remove(id)
          .then((updated) =>
            console.log("Planned No Remark removed: " + updated)
          )
          .catch((err) => that.handleToastOffline());
      })
      .catch(function (error) {
        PlannedNoRemarkOffline.remove(id)
          .then((updated) =>
            console.log("Planned No Remark removed error: " + updated)
          )
          .catch((err) => that.handleToastOffline());
      });
  }

  async updatePlannedTask(idTask, actualResolutionDate, remark, id) {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const data = {
      actualResolutionDate: actualResolutionDate,
      remark: remark,
    };

    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        that.closeUpdatePlannedTask(idTask, id);
      })
      .catch(function (error) {
        // that.handleToastError()
        that.handleToastOffline();

        PlannedUpdateOffline.remove(id)
          .then((updated) => console.log("Planned update removed: " + updated))
          .catch((err) => that.handleToastOffline());
      });
  }

  //subtask 1
  async updatePlannedSubTask(idTask, actualResolutionDate, remark, id) {
    const { AuthReducer, TaskReducer } = this.props;
    const offLineMode = TaskReducer.plannedOffline;
    const that = this;
    const token = AuthReducer.token;

    let findId = offLineMode.filter((item) => item._id === idTask);

    const updatedData = findId[0]?.subtasks?.map((element, index) => {
      const data = {
        _id: element._id,
        value: element.value,
      };
      return data;
    });

    const data = {
      actualResolutionDate: actualResolutionDate,
      remark: remark,
      subtasks: updatedData,
    };

    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        that.closeUpdatePlannedTask(idTask, id);
      })
      .catch(function (error) {
        that.handleToastOffline();
        PlannedUpdateOffline.remove(id)
          .then((updated) => console.log("Planned update removed: " + updated))
          .catch((err) => that.handleToastOffline());
      });
  }

  async closeUpdatePlannedTask(idTask, id) {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const datab = {
      status: "closed",
    };
    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: datab,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        PlannedUpdateOffline.remove(id)
          .then((updated) => console.log("Planned update removed: " + updated))
          .catch((err) => that.handleToastOffline());
      })
      .catch(function (error) {
        PlannedUpdateOffline.remove(id)
          .then((updated) =>
            console.log("Plannedupdate removed error:  " + updated)
          )
          .catch((err) => that.handleToastOffline());
      });
  }

  async closeUpdatePlannedTask(idTask, id) {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const datab = {
      status: "closed",
    };
    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: datab,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        PlannedUpdateOffline.remove(id)
          .then((updated) => console.log("Planned update removed: " + updated))
          .catch((err) => that.handleToastOffline());
      })
      .catch(function (error) {
        PlannedUpdateOffline.remove(id)
          .then((updated) =>
            console.log("Plannedupdate removed error:  " + updated)
          )
          .catch((err) => that.handleToastOffline());
      });
  }

  //no remark
  async updatePlannedTaskNoRemark(idTask, actualResolutionDate, id) {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const data = {
      actualResolutionDate: actualResolutionDate,
    };

    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        that.closeUpdatePlannedTaskNoRemark(idTask, id);
      })
      .catch(function (error) {
        that.handleToastOffline();
        PlannedUpdateNoRemarkOffline.remove(id)
          .then((updated) => console.log("Planned up date removed: " + updated))
          .catch((err) => that.handleToastOffline());
      });
  }

  //Subtask NO remark
  async updatePlannedSubTaskNoRemark(idTask, actualResolutionDate, id) {
    const { AuthReducer, TaskReducer } = this.props;
    const offLineMode = TaskReducer.plannedOffline;
    const that = this;
    const token = AuthReducer.token;

    let findId = offLineMode.filter((item) => item._id === idTask);

    const updatedData = findId[0]?.subtasks?.map((element, index) => {
      const data = {
        _id: element._id,
        value: element.value,
      };
      return data;
    });
    const data = {
      actualResolutionDate: actualResolutionDate,
      subtasks: updatedData,
    };

    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        that.closeUpdatePlannedTaskNoRemark(idTask, id);
      })
      .catch(function (error) {
        that.handleToastOffline();
        PlannedUpdateNoRemarkOffline.remove(id)
          .then((updated) =>
            console.log("Planned update removed error: " + updated)
          )
          .catch((err) => that.handleToastOffline());
      });
  }

  async closeUpdatePlannedTaskNoRemark(idTask, id) {
    const { AuthReducer } = this.props;
    const that = this;
    const token = AuthReducer.token;
    const datab = {
      status: "closed",
    };
    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: datab,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        PlannedUpdateNoRemarkOffline.remove(id)
          .then((updated) => console.log("Planned up date removed: " + updated))
          .catch((err) => that.handleToastOffline());
      })
      .catch(function (error) {
        PlannedUpdateNoRemarkOffline.remove(id)
          .then((updated) =>
            console.log("Planned update removed error: " + updated)
          )
          .catch((err) => that.handleToastOffline());
      });
  }

  //no Remark
  async closeUpdatePlannedTaskNoRemark(idTask, id) {
    const { AuthReducer } = this.props;
    const that = this;
    const token = AuthReducer.token;
    const datab = {
      status: "closed",
    };
    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: datab,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        PlannedUpdateNoRemarkOffline.remove(id)
          .then((updated) => console.log("Planned up date removed: " + updated))
          .catch((err) => that.handleToastOffline());
      })
      .catch(function (error) {
        PlannedUpdateNoRemarkOffline.remove(id)
          .then((updated) =>
            console.log("Planned update removed error: " + updated)
          )
          .catch((err) => that.handleToastOffline());
      });
  }

  //disable toast
  disableToastPlanned() {
    const actionToastPlanned = { type: "TOAST_PLANNED_ACTION", value: false };
    this.props.dispatch(actionToastPlanned);
  }

  async AddTaskOffline() {
    const that = this;
    await AddOffline.all()
      .then((add) =>
        add.forEach((item, index) => {
          if (add.indexOf(item) === index) {
            this.addTask(
              item.name,
              item.dueDate,
              item.description,
              item.eventDate,
              item.equipmentId,
              item.id
            );
          }
        })
      )
      .catch(function (error) {});
  }
  async AddTaskNoDueDateOffline() {
    await AddNoDueDateOffline.all()
      .then((add) =>
        add.forEach((item, index) => {
          if (add.indexOf(item) === index) {
            this.addTaskNoDueDate(
              item.name,
              item.description,
              item.eventDate,
              item.equipmentId,
              item.id
            );
          }
        })
      )
      .catch(function (error) {
        // that.handleToastError()
      });
  }
  async DisableTaskOffline() {
    await DisableOffline.all()
      .then((disable) =>
        disable.forEach((item) => {
          this.disableTask(item.idTask, item.id);
        })
      )
      .catch(function (error) {
        // that.handleToastError()
      });
  }
  async ResolveTaskOffline() {
    await ResolveOffline.all()
      .then((resolve) =>
        resolve.forEach((item) => {
          this.resolveTask(
            item.idTask,
            item.actualResolutionDate,
            item.workDetails,
            item.id
          );
        })
      )
      .catch(function (error) {
        // that.handleToastError()
      });
  }
  async EditTaskOffline() {
    await EditOffline.all()
      .then((edit) =>
        edit.forEach((item) => {
          this.editTask(
            item.idTask,
            item.name,
            item.dueDate,
            item.description,
            item.eventDate,
            item.id
          );
        })
      )
      .catch(function (error) {
        // that.handleToastError()
      });
  }
  async EditTaskNoDueDateOffline() {
    await EditNoDueDateOffline.all()
      .then((edit) =>
        edit.forEach((item) => {
          this.editTaskNoDueDate(
            item.idTask,
            item.name,
            item.description,
            item.eventDate,
            item.id
          );
        })
      )
      .catch(function (error) {
        // that.handleToastError()
      });
  }

  //send data offline Unplanned
  async fetchDataOffLineUnplanned() {
    await Promise.all([
      this.AddTaskOffline(),
      this.AddTaskNoDueDateOffline(),
      this.ResolveTaskOffline(),
      this.DisableTaskOffline(),
      this.EditTaskOffline(),
      this.EditTaskNoDueDateOffline(),
    ]);

    await this.enlineModeUnplanned();
  }

  async enlineModeUnplanned() {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;

    axios
      .get(API.getUnplannedTask, {
        headers: {
          AUTHORIZATION: `Bearer ${token.accessToken}`,
        },
      })
      .then(function (response) {
        const action = { type: "RELOAD_ACTION", value: response.data.results };
        that.props.dispatch(action);
        const actionUnplanned = {
          type: "UNPLANNED_ACTION",
          value: response.data.results,
        };
        that.props.dispatch(actionUnplanned);
        that.disableToastUNPlanned();
        // navigation.navigate("Unplanned")
      })
      .catch(function (error) {
        // that.handleToastError()
      });
  }

  disableToastUNPlanned() {
    const actionToastUNPlanned = {
      type: "TOAST_UNPLANNED_ACTION",
      value: false,
    };
    this.props.dispatch(actionToastUNPlanned);
  }

  //add unplanned task offline mode
  async addTask(name, dueDate, description, eventDate, equipmentId, id) {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const data = {
      name: name,
      dueDate: dueDate,
      description: description,
      eventDate: eventDate,
      type: "unplanned-maintenance",
      equipmentId: equipmentId,
    };
    axios({
      method: "POST",
      url: API.patchTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log("the answer", response.data);
        AddOffline.remove(id)
          .then((updated) => console.log("Add task removed: " + updated))
          .catch((err) => that.handleToastOffline());
      })
      .catch(function (error) {
        that.handleToastOffline();

        const actionErrorType = { type: "TOAST_TYPE_ACTION", value: errorType };
        that.props.dispatch(actionErrorType);
        AddOffline.remove(id)
          .then((updated) => console.log("Add task removed: " + updated))
          .catch((err) => that.handleToastOffline());
      });

    const action = { type: "GOBACK_UNPLANNED_ACTION", value: true };
    that.props.dispatch(action);
  }
  //NO due date
  async addTaskNoDueDate(name, description, eventDate, equipmentId, id) {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const data = {
      name: name,
      description: description,
      eventDate: eventDate,
      type: "unplanned-maintenance",
      equipmentId: equipmentId,
    };
    axios({
      method: "POST",
      url: API.patchTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log("the answer", response.data);
        AddNoDueDateOffline.remove(id)
          .then((updated) => console.log("Add task removed: " + updated))
          .catch((err) => that.handleToastOffline());
      })
      .catch(function (error) {
        that.handleToastOffline();
        AddNoDueDateOffline.remove(id)
          .then((updated) => console.log("Add task removed: " + updated))
          .catch((err) => that.handleToastOffline());
      });

    const action = { type: "GOBACK_UNPLANNED_ACTION", value: true };
    that.props.dispatch(action);
  }
  //Disable task
  async disableTask(idTask, id) {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const data = {
      isDisabled: true,
    };
    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        DisableOffline.remove(id)
          .then((updated) => console.log("disable task removed: " + updated))
          .catch((err) => that.handleToastOffline());
      })
      .catch(function (error) {
        // that.handleToastError()
        that.handleToastOffline();
        DisableOffline.remove(id)
          .then((updated) => console.log("disabled task removed: " + updated))
          .catch((err) => that.handleToastOffline());
      });
  }

  //resolve task unplanned
  async resolveTask(idTask, actualResolutionDate, workDetails, id) {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const data = {
      actualResolutionDate: actualResolutionDate,
      workDetails: workDetails,
    };
    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        that.closeTaskUnplanned(idTask, id);
      })
      .catch(function (error) {
        // that.handleToastError()
        that.handleToastOffline();
        ResolveOffline.remove(id)
          .then((updated) => console.log("resolve task removed: " + updated))
          .catch((err) => that.handleToastOffline());
      });
  }
  async closeTaskUnplanned(idTask, id) {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const datab = {
      status: "closed",
    };
    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: datab,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        ResolveOffline.remove(id)
          .then((updated) => console.log("resolve task removed: " + updated))
          .catch((err) => that.handleToastOffline());
      })
      .catch(function (error) {
        // that.handleToastError()
        ResolveOffline.remove(id)
          .then((updated) => console.log("resolve task removed: " + updated))
          .catch((err) => that.handleToastOffline());
      });
  }

  //edit unplanned task offline mode
  async editTask(idTask, name, dueDate, description, eventDate, id) {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const data = {
      name: name,
      dueDate: dueDate,
      description: description,
      eventDate: eventDate,
    };
    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log("the answer", response);
        EditOffline.remove(id)
          .then((updated) => console.log("Edit task removed: " + updated))
          .catch((err) => that.handleToastOffline());
      })
      .catch(function (error) {
        // that.handleToastError()
        that.handleToastOffline();
        EditOffline.remove(id)
          .then((updated) => console.log("Edit task removed: " + updated))
          .catch((err) => that.handleToastOffline());
      });
  }

  async editTaskNoDueDate(idTask, name, description, eventDate, id) {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const data = {
      name: name,
      description: description,
      eventDate: eventDate,
    };
    axios({
      method: "PATCH",
      url: API.patchTask + idTask,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        console.log("the answer", response);
        EditNoDueDateOffline.remove(id)
          .then((updated) =>
            console.log("Edit task No duedate removed: " + updated)
          )
          .catch((err) => that.handleToastOffline());
      })
      .catch(function (error) {
        that.handleToastOffline();
        EditNoDueDateOffline.remove(id)
          .then((updated) =>
            console.log("Edit task No duedate removed: " + updated)
          )
          .catch((err) => that.handleToastOffline());
      });
  }

  //send data offline Meters
  async fetchDataOffLineMeter() {
    await MeterOffline.all()
      .then((meter) =>
        meter.forEach((item) => {
          console.warn("idTask Meters:", item);
          this.updateMeter(item.idTask, item.date, item.value, item.id);
        })
      )
      .catch(function (error) {
        // that.handleToastError()
      });
    await this.enlineModeMeter();
  }

  //send when online mode
  async enlineModeMeter() {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;

    axios
      .get(API.getMeterTask, {
        headers: {
          AUTHORIZATION: `Bearer ${token.accessToken}`,
        },
      })
      .then(function (response) {
        const action = { type: "RELOAD_ACTION", value: response.data.results };
        that.props.dispatch(action);
        const actionMeter = {
          type: "METER_ACTION",
          value: response.data.results,
        };
        that.props.dispatch(actionMeter);
        that.disableToastMeter();
        // navigation.navigate("Meters")
      })
      .catch(function (error) {
        // that.handleToastError()
      });
  }

  disableToastMeter() {
    const actionToastMeter = { type: "TOAST_METER_ACTION", value: false };
    this.props.dispatch(actionToastMeter);
  }

  //update Meter task offline
  async updateMeter(idTask, date, value, id) {
    const { AuthReducer } = this.props;
    const that = this;
    const token = AuthReducer.token;
    const data = {
      equipmentId: idTask,
      date: date,
      value: value,
    };
    axios({
      method: "POST",
      url: API.updateMeter,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        MeterOffline.remove(id)
          .then((updated) => console.log("meter task removed: " + updated))
          .catch((err) => that.handleToastOffline());
      })
      .catch(function (error) {
        // that.handleToastError()
        that.handleToastOffline();

        MeterOffline.remove(id)
          .then((updated) => console.log("meter task removed: " + updated))
          .catch((err) => that.handleToastOffline());
      });
  }

  async updateLanguage(lang) {
    const data = { lang: lang };
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const that = this;
    axios({
      method: "PATCH",
      url: API.patchUserLang + token.user._id,
      data: data,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        const languageOffline = {
          type: "OFFLINE_LANGUAGE_EXIST_ACTION",
          value: false,
        };
        that.props.dispatch(languageOffline);
        ChangeLanguageOffline.removeAll();
      })
      .catch(function (error) {
        console.log("Error when trying to change language:", error);
        ChangeLanguageOffline.removeAll();
      });
  }

  async fetchDataOffLineLanguage() {
    await ChangeLanguageOffline.all()
      .then((language) =>
        language.forEach((item) => {
          this.updateLanguage(item.lang);
        })
      )
      .catch(function (error) {
        console.log("language offline error: ", error);
      });
  }

  async fetchAttchmentOffline() {
    await AttachmentOffline.all()
      .then(async (attachment) => {
        const aPromise = [];
        attachment.forEach((item) => {
          aPromise.push(this.sendOfflineAttachment(item));
        });
        await Promise.all(aPromise);
      })
      .catch(function (error) {
        console.log("attachment offline error: ", error);
      });

    const actionAttachment = {
      type: "OFFLINE_ATTACHMENT_EXIST_ACTION",
      value: false,
    };
    this.props.dispatch(actionAttachment);
  }

  async sendOfflineAttachment(item) {
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const that = this;
    const res = await getOfflineAttachments(item.uri);
    const result = {
      uri: res,
      name: item.filename,
    };
    if (result) {
      const signedUrl = await beforeFileUpload(
        result,
        token.accessToken,
        item.idTask
      );
      if (signedUrl) {
        const uploadData = {
          action: signedUrl,
          file: result,
        };
        await upload(uploadData)
          .then(async (data) => {
            await fileUploadSuccess(
              data,
              result,
              token.accessToken,
              item.idTask
            ).then(async (result) => {
              that.setState({ uploadLoading: false });
            });
          })
          .catch((error) => {
            that.setState({ uploadLoading: false });
            that.handleToastOffline();
          });
      } else {
        that.handleToastOffline();
      }
    }
    //remove data from sqlite & delete file
    AttachmentOffline.remove(item.id)
      .then((updated) => console.log("attachments removed: " + updated))
      .catch((err) => that.handleToastOffline());
    await deleteAttachment(item.uri);
  }

  refreshMethod = () => {
    let nullValue = [];
    const action = { type: "FILTER_ACTION", value: nullValue };
    this.props.dispatch(action);

    const actionShip = { type: "SHIP_ACTION", value: null };
    this.props.dispatch(actionShip);

    const actionDepartment = { type: "DEPARTMENT_ACTION", value: null };
    this.props.dispatch(actionDepartment);
    const actionEquipment = { type: "EQUIPMENT_ACTION", value: null };

    this.props.dispatch(actionEquipment);
    const activeDepartment = { type: "DEPARTMENT_ACTIVE", value: true };
    this.props.dispatch(activeDepartment);
    const activeEquipment = { type: "EQUIPMENT_ACTIVE", value: true };
    this.props.dispatch(activeEquipment);

    const actionS = { type: "SHIP_NAME_ACTION", value: null };
    this.props.dispatch(actionS);
    const actionE = { type: "EQUIPMENT_NAME_ACTION", value: null };
    this.props.dispatch(actionE);
    const actionD = { type: "DEPARTMENT_NAME_ACTION", value: null };
    this.props.dispatch(actionD);

    const actionV = { type: "VISIBLE_ACTION", value: false };
    this.props.dispatch(actionV);
    const actionRES = { type: "RESULT_ACTION", value: false };
    this.props.dispatch(actionRES);

    const actionCompteDe = { type: "FILTERDEPARTMENT_COMPTE_ACTION", value: 0 };
    this.props.dispatch(actionCompteDe);
    const actionCompte = { type: "FILTEREQUIPMENT_COMPTE_ACTION", value: 0 };
    this.props.dispatch(actionCompte);
    const actionCompteSh = { type: "FILTERSHIP_COMPTE_ACTION", value: 0 };
    this.props.dispatch(actionCompteSh);

    const actionO = { type: "OVERLAY_ACTION", value: false };
    this.props.dispatch(actionO);
    const actionFIl = { type: "FILTEREQUIPMENTLENGTH_ACTION", value: 0 };
    this.props.dispatch(actionFIl);

    const actionBS = { type: "BADGE_SHIP_ACTION", value: false };
    this.props.dispatch(actionBS);
    const actionBDE = { type: "BADGE_DEPARTMENT_ACTION", value: false };
    this.props.dispatch(actionBDE);
    const actionBE = { type: "BADGE_EQUIPMENT_ACTION", value: false };
    this.props.dispatch(actionBE);
  };

  async componentDidMount() {
    const { navigation, TaskReducer, AuthReducer } = this.props;
    const screen = TaskReducer.taskName;
    const item = navigation.getParam("item");

    const toastDataSendPlanned = TaskReducer.activateToastPlanned;
    const toastDataSendUnplanned = TaskReducer.activateToastUnplanned;
    const toastDataSendMeter = TaskReducer.activateToastMeter;
    const offlineAttachmentExist = TaskReducer.offlineAttachmentExist;

    const connexion = this.context?.connexion;
    const offlineLanguageExist = AuthReducer.offlineLanguageExist;
    let timeOut = 50;

    if (connexion) {
      if (offlineLanguageExist) {
        timeOut = 4000;
        await this.fetchDataOffLineLanguage();
      }

      if (toastDataSendPlanned) {
        timeOut = 5000;
        await this.fetchDataPlannedOffLine();
      }

      if (toastDataSendUnplanned) {
        timeOut = 4000;
        await this.fetchDataOffLineUnplanned();
      }

      if (toastDataSendMeter) {
        timeOut = 4000;
        await this.fetchDataOffLineMeter();
      }

      if (offlineAttachmentExist) {
        timeOut = 4000;
        await this.fetchAttchmentOffline();
      }
    }

    setTimeout(() => {
      this.refreshMethod();
      navigation.navigate(screen, { item: item });
    }, timeOut);
  }

  renderToastError = () => (
    <View>
      <View style={StyleLogin.popupContent}>
        <View style={StyleLogin.errorMode}>
          <Text style={StyleLogin.popupText}>
            {this.props.intl.formatMessage({
              id: "planned.toast.errorSendingOffline",
              defaultMessage:
                "An error has occurred when sending offline content",
            })}
          </Text>
        </View>
      </View>
    </View>
  );

  // handleToastError() {
  //   this.toast.show(this.renderToastError());
  // }

  render() {
    return (
      <SafeAreaView style={StyleLogin.isLoggedIn}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }
}
const StyleLogin = StyleSheet.create({
  isLoggedIn: {
    flex: 1,
    backgroundColor: "rgba(0, 54, 84, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  popupContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: ScreenDimensions.widthScreen * 0.05,
  },
  popupIconSad: {
    alignSelf: "center",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    // paddingTop:ScreenDimensions.widthScreen*0.001,
    fontSize: 70,
    borderBottomColor: COLORS.green,
  },
  popupText: {
    fontSize: 16,
    color: "#595959",
  },
  overlayPopupContent: {
    // position: 'absolute',
    marginBottom: ScreenDimensions.heightScreen * 0.8,
    width: ScreenDimensions.widthScreen * 0.85,
    // height: ScreenDimensions.heightScreen * 0.2,
    backgroundColor: "#DBE4F0",
    alignItems: "flex-start",
    alignContent: "center",
    justifyContent: "center",
    borderRadius: ScreenDimensions.widthScreen * 0.02,
    borderBottomWidth: 7,
    borderBottomColor: COLORS.redError,
    paddingHorizontal: 16,
    zIndex: 10000,
    marginTop: getStatusBarHeight(),
  },
  errorMode: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    paddingBottom: 4,
  },
  popupTextErrorTitle: {
    fontWeight: "bold",
    alignSelf: "flex-start",
    fontSize: ScreenDimensions.widthScreen * 0.07,
    color: COLORS.redError,
  },
});

const mapStateToProps = (state) => ({
  AuthReducer: state.AuthReducer,
  FilterReducer: state.FilterReducer,
  TaskReducer: state.TaskReducer,
});

export default injectIntl(connect(mapStateToProps)(RefreshAuto));
