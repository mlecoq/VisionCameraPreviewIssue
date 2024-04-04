/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Button, Image, Platform, StyleSheet, Text, View} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from 'react-native-vision-camera';
import {Dimensions} from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

const RATIO = 0.625;

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Platform.select<number>({
  android:
    Dimensions.get('screen').height - StaticSafeAreaInsets.safeAreaInsetsBottom,
  ios: Dimensions.get('window').height,
}) as number;

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

    console.log(photo?.path, photo?.width, photo?.height);

    setPicture(photo?.path);
  }, []);

  const screenAspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
  const format = useCameraFormat(device, [
    {fps: 60},
    {videoAspectRatio: screenAspectRatio},
    {videoResolution: 'max'},
    {photoAspectRatio: screenAspectRatio},
    {photoResolution: 'max'},
  ]);

  console.log(JSON.stringify(device, (k, v) => (k === 'formats' ? [] : v), 2));

  return (
    <View style={styles.backgroundStyle}>
      {hasPermission ? (
        <View style={styles.sectionsContainer}>
          <View style={styles.section}>
            {device && (
              <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                format={format}
                enableZoomGesture={false}
                photo
                ref={camera}
                orientation="portrait"
                exposure={0}
                photoQualityBalance="quality"
                zoom={1}
                isActive
                photoHdr={false}
              />
            )}
            <Text style={{color: 'white'}}>PREVIEW</Text>
          </View>
          <View style={styles.section}>
            {picture && (
              <Image
                style={StyleSheet.absoluteFill}
                resizeMode="contain"
                source={{uri: `file://${picture}`}}
              />
            )}
            <Text style={{color: 'white'}}>CAPTURE</Text>
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
    </View>
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
    justifyContent: 'flex-end',
  },
});

export default App;
