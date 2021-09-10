import axios from "axios";
import * as mime from "react-native-mime-types";
import * as FileSystem from "expo-file-system";

import API from "../../configs/API";

const attachmentsDir = FileSystem.documentDirectory + "attachments/";

const getContentType = (file) => {
  const uriParts = file.uri.split(".");
  const fileType = uriParts[uriParts.length - 1];

  return mime.lookup(fileType.toLowerCase()) || "application/octet-stream";
};

export const beforeFileUpload = async (file, token, idTask) => {
  const contentType = getContentType(file);
  const request = {
    contentType: contentType,
    filename: file.name,
    resourceId: idTask,
    resourceType: "task",
  };

  return await axios({
    method: "POST",
    url: API.signedUrl,
    data: JSON.stringify(request),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json;charset=UTF-8",
    },
  })
    .then(function (response) {
      const signedS3Url = response.data.url;

      return signedS3Url;
    })
    .catch(function (error) {
      if (error.response) {
        console.log("error.request", error.request);
        //do something
      } else if (error.request) {
        console.log("error.request", error.request);
        //do something else
      } else if (error.message) {
        console.log("error.message", error.message);
        //do something other than the other two
      }
      return false;
    });
};

export const upload = async (upload) => {
  try {
    return await axios({
      timeout: 1000 * 60 * 5, // Hyper important sinon ça marche pas
      method: "put",
      url: upload.action, // (L'URL S3 retournée par la première requête ci-dessus),
      data: upload.file, // "File" javascript
      headers: {
        "Content-Type": getContentType(upload.file),
      },
      transformRequest: (data, headers) => {
        delete headers.Authorization;
        delete headers.common["Authorization"];
        return data;
      },
    });
  } catch (exception) {
    console.error("up ", exception.request);
    return false;
  }
};

export const fileUploadSuccess = async (res, file, token, idTask) => {
  return await axios({
    method: "POST",
    url: API.attachments,
    data: JSON.stringify({
      resourceType: "task",
      resourceId: idTask,
      filename: file.name,
    }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json;charset=UTF-8",
    },
  })
    .then(function (response) {
      // return response.data.results;
    })
    .catch(function (error) {
      if (error.response) {
        console.log("fus error.request", error.request);
        //do something
      } else if (error.request) {
        console.log("error.request", error.request);
        //do something else
      } else if (error.message) {
        console.log("error.message", error.message);
        //do something other than the other two
      }
      return false;
    });
};

export const getAttachments = async (idTask, token) => {
  return await axios.get(API.getAttachments + idTask, {
    headers: {
      AUTHORIZATION: `Bearer ${token}`,
    },
  });
};

export const deleteAttachments = async (idAttachments, token) => {
  return await axios.delete(API.deleteAttachments + idAttachments, {
    headers: {
      AUTHORIZATION: `Bearer ${token}`,
    },
  });
};

// Checks if attachments directory exists. If not, creates it
async function ensureDirExists() {
// await FileSystem.deleteAsync(FileSystem.documentDirectory + "attachments/", {idempotent: true})
//   await FileSystem.deleteAsync(FileSystem.documentDirectory + "attachments", {idempotent: true})
  const dirInfo = await FileSystem.getInfoAsync(attachmentsDir);
  if (!dirInfo.exists) {
    console.log("Attachments directory doesn't exist, creating...");
    await FileSystem.makeDirectoryAsync(attachmentsDir, {
      intermediates: true,
    });
  }
}

export const saveAttachmentOffline = async (fileUri, filename) => {
  await ensureDirExists();
 const getIt = await FileSystem.getContentUriAsync(fileUri);
  const options = {
    from: getIt,
    to: attachmentsDir + filename,
  };
  console.log('saving...')
  return FileSystem.copyAsync(options).then(() => {
    return attachmentsDir + filename;
  }).catch((error) => {
    console.error('error move', error)
    return false;
  })
};

export const getOfflineAttachments = async (fileUri) => {

  return FileSystem.getContentUriAsync(fileUri);
};

export const getAllOfflineAttachments = async () => {
  const files = [];
  await ensureDirExists();
  const dirInfo = await FileSystem.getInfoAsync(attachmentsDir);
  console.log('infoDIr', dirInfo)
  let dir = await FileSystem.readDirectoryAsync(
    attachmentsDir
  );
  dir.forEach((val) => {
    files.push(attachmentsDir + val)
  });

  return files;
};

export const deleteAttachment = async (uri) => {
  await FileSystem.deleteAsync(uri, {idempotent: true})
}

export const deleteAllAttachments = async () => {
  await FileSystem.deleteAsync(FileSystem.documentDirectory + "attachments/", {idempotent: true})
}