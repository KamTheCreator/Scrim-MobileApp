import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, AppState, View, Text, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';

const WebViewScreen = () => {
  const WEBVIEW_REF = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const handleBackButton = () => {
      if (WEBVIEW_REF.current && canGoBack) {
        WEBVIEW_REF.current.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      backHandler.remove();
    };
  }, [canGoBack]);

  const onNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        setIsConnected(false);
        Alert.alert(
          'No Internet Connection',
          'Please check your internet connection and try again.',
          [{ text: 'OK' }]
        );
      } else {
        setIsConnected(true);
      }

      if (!state.isConnected && WEBVIEW_REF.current) {
        // If there's no internet connection, navigate back in the WebView
        WEBVIEW_REF.current.goBack();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isConnected ? (
        <WebView
          source={{ uri: 'https://strimafrica.com' }}
          ref={WEBVIEW_REF}
          onNavigationStateChange={onNavigationStateChange}
        />
      ) : (
        <Text style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>No internet connection</Text>
      )}
    </View>
  );
};

export default WebViewScreen;