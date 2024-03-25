/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Button,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from 'react-native-vision-camera';

const RATIO = 0.625;

function App(): React.JSX.Element {
  const camera = useRef<Camera>(null);

  const [cameraPosition, setCameraPosition] = useState<'back' | 'front'>(
    'back',
  );

  const {hasPermission, requestPermission} = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const device = useCameraDevice(cameraPosition);

  const [picture, setPicture] = useState<string | undefined>();

  const takePhoto = useCallback(async () => {
    if (!camera.current) {
      return;
    }
    const photo = await camera.current?.takePhoto({
      flash: 'off',
      enableShutterSound: false,
    });

    console.log(photo?.path);

    setPicture(photo?.path);
  }, []);

  const format = useCameraFormat(device, [
    {
      photoAspectRatio: RATIO,
      videoAspectRatio: RATIO,
    },
  ]);

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      {hasPermission ? (
        <View style={styles.sectionsContainer}>
          <View style={styles.section}>
            {device && (
              <Camera
                style={{flex: 1}}
                device={device}
                format={Platform.OS === 'android' ? format : undefined}
                enableZoomGesture
                photo
                ref={camera}
                orientation="portrait"
                exposure={0}
                photoQualityBalance={
                  Platform.OS === 'android' ? 'speed' : 'balanced'
                }
                isActive
              />
            )}
          </View>
          <View style={styles.section}>
            {picture && (
              <Image style={{flex: 1}} source={{uri: `file://${picture}`}} />
            )}
          </View>
        </View>
      ) : null}

      <View>
        <Button title="Take Photo" onPress={takePhoto} />
        <Button
          title="Switch Camera"
          onPress={() =>
            setCameraPosition(prev => (prev === 'back' ? 'front' : 'back'))
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    paddingHorizontal: 10,
    marginHorizontal: 'auto',
    gap: 10,
    flex: 1,
  },
  sectionsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  section: {
    flex: 1,
    aspectRatio: RATIO,
    backgroundColor: 'black',
    borderRadius: 10,
  },
});

export default App;
