import * as MediaLibrary from 'expo-media-library';
import * as Camera from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';

/// Compress a selected image against local parameters.
export async function compressSelectedImage(imagePickerResult) {
  try {
    var resize = {};
    if (imagePickerResult.height >= imagePickerResult.width) {
      resize.height = 2048;
    } else {
      resize.width = 2048;
    }
    let resizedResult = await ImageManipulator.manipulateAsync(
      imagePickerResult.uri,
      [{ resize }],
      { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
    );
    return resizedResult;
  } catch (error) {
    console.warn(error);
    return false;
  }
}

/// Asks for photo library permission
export async function askPhotoLibraryPermission() {
  const perm1 = await Camera.requestPermissionsAsync();
  const perm2 = await MediaLibrary.requestPermissionsAsync();
  return perm1.status === 'granted' && perm2.status === 'granted';
}

/// Asks for camera permission
export async function askCameraPermission() {
  const perm1 = await Camera.requestPermissionsAsync();
  const perm2 = await MediaLibrary.requestPermissionsAsync();
  return perm1.status === 'granted' && perm2.status === 'granted';
}