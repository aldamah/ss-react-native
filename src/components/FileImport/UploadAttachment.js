import React from "react";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import { injectIntl, FormattedMessage } from "react-intl";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import EntypoIcon from "react-native-vector-icons/Entypo";
import Icon from "react-native-vector-icons/AntDesign";
import { DateTime } from "luxon";
import * as WebBrowser from "expo-web-browser";

import { NetworkContext } from "../../../NetworkProvider";
import { StyleUploadAttachment } from "./StyleUploadAttachment";
import {
  askCameraPermission,
  askPhotoLibraryPermission,
  compressSelectedImage,
} from "./UploadUtils";
import {
  beforeFileUpload,
  upload,
  fileUploadSuccess,
  getAttachments,
  deleteAttachments,
  saveAttachmentOffline,
} from "../TaskInformation/UploadHelper";
import { PickerModal } from "../PickerModal/PickerModal";
import AttachmentOffline from "../../dbSQLite/AttachmentOffline";
import ToastApp from "../ToastApp/ToastApp";

// Component responsible for handling the display and events of a document file.
class UploadAttachmentButton extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      attachments: [],
      pickerVisible: false,
      uploadLoading: false,
      documentName: "",
      textError: "hoho",
      typeError: "",
    };
  }

  async componentDidMount() {
    await this._getAttachments();
  }

  handleToastOnline(textError) {
    let errorMessage;
    if (textError) {
       errorMessage = this.props.intl.formatMessage({
        id: textError,
      });
    } else {
       errorMessage = this.props.intl.formatMessage({
        id: "planned.toast.errorSendingOnline",
        defaultMessage: "An error has occurred when sending your content",
      });
    }

    const errorType = "Error";

    const actionErrorText = { type: "TOAST_TEXT_ACTION", value: errorMessage };
    this.props.dispatch(actionErrorText);

    const actionErrorType = { type: "TOAST_TYPE_ACTION", value: errorType };
    this.props.dispatch(actionErrorType);
  }

  handleToastOfflineAttachment() {
    const errorMessage = this.props.intl.formatMessage({
      id: "planned.toast.successAttachmentOffline",
      defaultMessage:
        "Your file has been successfully uploaded, it will be available when online",
    });
    const errorType = "Success";

    const actionErrorText = { type: "TOAST_TEXT_ACTION", value: errorMessage };
    this.props.dispatch(actionErrorText);

    const actionErrorType = { type: "TOAST_TYPE_ACTION", value: errorType };
    this.props.dispatch(actionErrorType);
  }

  _getAttachments = async () => {
    const that = this;
    const { item } = this.props;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const connexion = this.context.connexion;
    if (connexion) {

      await getAttachments(item._id, token.accessToken).then((response) => {
        const attachments = response.data.results;
        for (let i = 0; i < attachments.length; i++) {
          attachments[i].active = false;
        }
        that.setState({ attachments });
      });
    } else {
      that.fetchAttchmentOffline(item._id);
    }
  };

  async fetchAttchmentOffline(idTask) {
    const that = this;
    await AttachmentOffline.findByTaskId(idTask)
      .then((attachments) => {
        const prevAttachment = [...this.state.attachments];
        for (let i = 0; i < attachments.length; i++) {
          attachments[i].active = false;
          prevAttachment.push(attachments[i]);
        }
        that.setState({ attachments: prevAttachment });
      })
      .catch(function (error) {
        console.log("attachment offline error: ", error);
        return false;
      });
  }

  _deleteAttachments = async (idAttachments, index) => {
    const that = this;
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    let attachments = [...this.state.attachments];
    for (let i = 0; i < attachments.length; i++) {
      attachments[i].active = false;
    }
    attachments[index].active = true;
    await deleteAttachments(idAttachments, token.accessToken).then(
      async (response) => {
        this.setState({ attachments });
        await that._getAttachments();
      }
    );
  };

  sendAttachment = async (idTask, attachment) => {
    const { AuthReducer } = this.props;
    const token = AuthReducer.token;
    const connexion = this.context.connexion;
    const that = this;
    if (connexion) {
      const signedUrl = await beforeFileUpload(
        attachment,
        token.accessToken,
        idTask
      );
      if (signedUrl) {
        const uploadData = {
          action: signedUrl,
          file: attachment,
        };
        await upload(uploadData)
          .then(async (data) => {
            await fileUploadSuccess(
              data,
              attachment,
              token.accessToken,
              idTask
            ).then(async (result) => {
              await that._getAttachments();
              that.setState({ uploadLoading: false });
            });
          })
          .catch((error) => {
            that.setState({ uploadLoading: false });
            that.handleToastOnline();
          });
      } else {
        that.handleToastOnline();
        that.setState({ uploadLoading: false, documentName: "" });
      }
    } else {
      //  await getAllOfflineAttachments();
      await this.handleAttachmentOffline(attachment, idTask);
      that.setState({ uploadLoading: false });
    }
  };

  // handle attachment when offline
  handleAttachmentOffline = async (file, idTask) => {
    const that = this;
    AttachmentOffline.createTable();
    const newUri = await saveAttachmentOffline(file.uri, file.name);
    if (newUri) {
      // save in sqlite
      console.log("saving to sqlite...");
      const attachments = {
        type: "OFFLINE_ATTACHMENT_EXIST_ACTION",
        value: true,
      };
      this.props.dispatch(attachments);
      AttachmentOffline.create(newUri, idTask, file.name)
        .then((id) => {
          that.handleToastOfflineAttachment();
          console.log("attachment sqlite:", id);

          const prevAttachment = [...this.state.attachments];
          prevAttachment.push({ _id: file.uri, filename: file.name });
          that.setState({ attachments: prevAttachment });

          that.setState({ uploadLoading: false });
        })
        .catch((err) => {
          console.log("Errora", err);
        });
    }
  };

  _pickImage = async () => {
    const that = this;
    const { item } = this.props;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      this.handleToastOnline("missing_permission");
    } else {
      let oPhoto = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 0.9,
      });
      if (!oPhoto.cancelled) {
        let resizedResult = await compressSelectedImage(oPhoto);
        if (resizedResult) {
          const uriParts = resizedResult?.uri.split(".");
          const fileType = uriParts[uriParts.length - 1];
  
          const result = {
            uri: resizedResult.uri,
            name: "img-" + Date.now() + "." + fileType,
          };
  
          this.setState({
            uploadLoading: true,
            documentName: result.name,
            pickerVisible: false,
          });
          await that.sendAttachment(item._id, result);
        } else {
          this.handleToastOnline();
        }
        
      } else {
        this.setState({
          uploadLoading: false,
        });
      }
    }
  };

  _startCamera = async () => {
    const { item } = this.props;
    const permission = await askCameraPermission();
    // const { status } = await ImagePicker.getCameraPermissionsAsync();
    if (permission) {
      const oPhoto = await ImagePicker.launchCameraAsync();
      if (oPhoto.cancelled) {
        this.setState({
          pickerVisible: false,
        });
        return;
      }
      this.setState({
        uploadLoading: true,
        pickerVisible: false,
      });
      let resizedResult = await compressSelectedImage(oPhoto);
      if(resizedResult) {
        const result = {
          uri: resizedResult.uri,
          name: "img-" + Date.now() + ".jpg",
        };
        this.setState({
          documentName: result.name,
        });
        await this.sendAttachment(item._id, result);
      } else {
        this.handleToastOnline();
      }
    } else {
      this.handleToastOnline("missing_permission");
    }
  };

  _pickDocument = async (typeDoc) => {
    const { item } = this.props;
    const type = typeDoc ? typeDoc : "*/*";
    let result = await DocumentPicker.getDocumentAsync({
      type: type,
      copyToCacheDirectory: true,
    });

    console.log("result size:", result.size);

    const maxFileSize = 10000000; // 10mo (a verifier @dinah)
    if (result.size > maxFileSize) {
      this.handleToastOnline("documentPicker.fileTooBig");
      this.setState({
        uploadLoading: false,
        pickerVisible: false,
      });
    } else {
      // Check the file mime type against the locally accepted mime types
      this.setState({
        uploadLoading: true,
        documentName: result.name,
        pickerVisible: false,
      });
      const that = this;
      if (result.type !== "cancel") {
        await that.sendAttachment(item._id, result);
      } else {
        that.setState({ uploadLoading: false });
      }
    }
  };

  _pickAttachment = () => {
    this.setState({ pickerVisible: true });
  };

  hidePickerModal = () => {
    this.setState({ pickerVisible: false });
  };

  _onOpenActionSheet = (idAttachments, index) => {
    const { intl } = this.props;
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = [
      intl.formatMessage({
        id: "delete",
        defaultMessage: "Delete",
      }),
      intl.formatMessage({
        id: "cancel",
        defaultMessage: "Cancel",
      }),
    ];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;
    const that = this;
    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      async (buttonIndex) => {
        // Do something here depending on the button index selected
        switch (buttonIndex) {
          case 0:
            that._deleteAttachments(idAttachments, index);
            break;
        }
      }
    );
  };

  showAttachmentOnBrowser = async (url) => {
    await WebBrowser.openBrowserAsync(encodeURI(url));
  };

  renderAttachment = ({ item, index }) => (
    <View style={StyleUploadAttachment.uploadedFile} key={item._id}>
      <View style={StyleUploadAttachment.fileName}>
        <TouchableOpacity
          style={StyleUploadAttachment.greyText}
          onPress={() => this.showAttachmentOnBrowser(item.url)}
        >
          <Text>{item.filename}</Text>
          <Text style={StyleUploadAttachment.greyTextDate}>
            {item?.createdAt
              ? this.props.intl.formatMessage(
                  {
                    id: "planned.attachmentSentOn",
                  },
                  {
                    date: this.props.intl.formatDate(
                      DateTime.fromISO(item.createdAt),
                      {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                      }
                    ),
                    hour: this.props.intl.formatDate(
                      DateTime.fromISO(item.createdAt),
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    ),
                  }
                )
              : this.props.intl.formatMessage({
                  id: "planned.attachmentSentOnOffline",
                  defaultMessage: "Saved offline",
                })}
          </Text>
        </TouchableOpacity>
      </View>
      {!item.active ? (
        <View>
          <Icon
            onPress={() => this._onOpenActionSheet(item._id, index)}
            name="close"
            color="#c0c4cc"
            size={30}
          />
        </View>
      ) : (
        <ActivityIndicator size="small" color="#0000ff" />
      )}
    </View>
  );

  render() {
    // Fait le render du button ici
    const { intl } = this.props;
    const { pickerVisible, uploadLoading, attachments, documentName } =
      this.state;

    return (
      <View>
        <PickerModal
          visible={pickerVisible}
          hideModal={this.hidePickerModal}
          startCamera={this._startCamera}
          pickPhoto={this._pickImage}
          pickDocument={this._pickDocument}
          intl={intl}
        />
        <TouchableOpacity
          onPress={this._pickAttachment}
          style={StyleUploadAttachment.attachmentContainer}
          disabled={uploadLoading}
        >
          <Text style={StyleUploadAttachment.blueText}>
            {intl.formatMessage({
              id: "planned.attachment",
              defaultMessage: "Add an attachment",
            })}
          </Text>
          <View style={StyleUploadAttachment.uploadContainer}>
            <Text style={StyleUploadAttachment.greyText}>
              {intl.formatMessage({
                id: "planned.attachmentText",
                defaultMessage: "Almost every files are accepted",
              })}
            </Text>
            <EntypoIcon name={"upload-to-cloud"} size={30} color="#c0c4cc" />
          </View>
        </TouchableOpacity>
        {uploadLoading && (
          <View style={StyleUploadAttachment.uploadedFile}>
            <View style={StyleUploadAttachment.fileName}>
              <Text style={StyleUploadAttachment.greyText}>{documentName}</Text>
            </View>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        )}
        <FlatList
          vertical
          alwaysBounceVertical={false}
          // horizontal
          showsHorizontalScrollIndicator={false}
          data={attachments}
          renderItem={this.renderAttachment}
          keyExtractor={(item, index) => item._id}
        />
        
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  FilterReducer: state.FilterReducer,
  TaskReducer: state.TaskReducer,
  AuthReducer: state.AuthReducer,
});

export default connectActionSheet(
  injectIntl(connect(mapStateToProps)(UploadAttachmentButton))
);
