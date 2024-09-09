import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Button, Image } from 'react-native';
import { useCameraPermissions, CameraType, CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
// import * as ImageManipulator from 'expo-image-manipulator';
import { useRouter } from 'expo-router'; 
import { useImgContext } from '../../hooks/providers/imageContext';

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const { setCapturedImage: setGlobalImage } = useImgContext();
  const router = useRouter(); 
  const cameraRef = useRef<any>(null);

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: true,
          exif: false,
        });

        // const resizedPhoto = await ImageManipulator.manipulateAsync(
        //   photo.uri,
        //   [{ resize: { width: 1920 } }],
        //   { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        // );

        setCapturedImage(photo.uri);
        setGlobalImage(photo.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture: ' + error.message);
      }
    }
  };

  const toggleCameraType = () => {
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      // Use router.push() to navigate 
      router.push({
        pathname: '/recipe', 
      });
    } else {
      Alert.alert('Error', 'Please take a photo first.');
    }
  };
  const retakePhoto = () => {
    setCapturedImage(null);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  if (capturedImage) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: capturedImage }} style={styles.preview} />
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.roundButton} onPress={retakePhoto}>
            <Ionicons name="refresh" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={confirmPhoto}>
            <Ionicons name="checkmark" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        onCameraReady={onCameraReady}
      >
        <View style={styles.overlay}>
          <Text style={styles.hint}>
            Hint: Make sure all fridge products are visible
          </Text>
        </View>
      </CameraView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.roundButton} onPress={toggleCameraType}>
          <Ionicons name="camera-reverse-outline" size={28} color="white" /> 
        </TouchableOpacity>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
      </View>

      {capturedImage && ( 
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.preview} />
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.actionButton} onPress={retakePhoto}>
              <Ionicons name="refresh" size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={confirmPhoto}>
              <Ionicons name="checkmark-circle-outline" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black', // Black background for M5 feel
    },
    camera: {
      flex: 1,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingTop: 40, // More spacing for M5 
      paddingHorizontal: 20, // Padding for better alignment 
    },
    hint: {
      color: 'white',
      fontSize: 18,
      backgroundColor: 'rgba(0, 0, 0, 0.7)', 
      padding: 15, 
      borderRadius: 10, 
      textAlign: 'center', 
      lineHeight: 24, // Improved readability 
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 40, // More bottom spacing for M5
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center', 
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    roundButton: {
      width: 56, // Larger buttons for M5
      height: 56,
      borderRadius: 28, 
      backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 16,
    },
    captureButton: {
      width: 72, // Larger capture button
      height: 72,
      borderRadius: 36, 
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
    },
    captureButtonInner: {
      width: 60, 
      height: 60, 
      borderRadius: 30, 
      backgroundColor: 'black',
    },
    // Styles for the preview container and buttons
    previewContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'black', 
    },
    preview: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    bottomBar: {
      position: 'absolute', 
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-around', 
      alignItems: 'center',
      backgroundColor: 'transparent',
      paddingVertical: 20,
    },
    actionButton: {
      width: 56, 
      height: 56, 
      borderRadius: 28, 
      backgroundColor: 'rgba(255, 255, 255, 0.2)', 
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  