import {
  DefaultTheme,
  NavigationContainer,
  useFocusEffect,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, TVFocusGuideView, Text, View } from 'react-native';

const RootStack = createNativeStackNavigator();

const NavigationFocusTest = () => {
  const theme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: 'transparent',
      },
    }),
    [],
  );

  return (
    <NavigationContainer theme={theme}>
      <View
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
        }}
      >
        <RootStack.Navigator
          screenOptions={{
            headerShown: false,
            // Enabling this still focuses the main screen when menu is opened, you just don't see it
            freezeOnBlur: false,
          }}
        >
          <RootStack.Screen component={MainStackScreen} name="MainStack" />
          <RootStack.Screen
            component={MenuStackScreen}
            name="MenuStack"
            options={{
              headerShown: false,
              presentation: 'transparentModal',
              animation: 'fade',
            }}
          />
        </RootStack.Navigator>
      </View>
    </NavigationContainer>
  );
};

export default NavigationFocusTest;

const MainStackScreen = () => {
  const navigation = useNavigation();

  const isFocused = useIsFocused();

  return (
    <View
      accessible={isFocused}
      importantForAccessibility={isFocused ? 'yes' : 'no-hide-descendants'}
      style={{
        flex: 1,
        opacity: isFocused ? 1 : 0.5,
        padding: 20,
        backgroundColor: 'black',
      }}
    >
      <CustomButton
        focusable={isFocused}
        onFocus={() => console.log('main button focused')}
        onPress={() => {
          navigation.navigate('MenuStack');
        }}
      >
        Open a modal
      </CustomButton>
    </View>
  );
};

const MenuStack = createNativeStackNavigator();

const MenuStackScreen = () => {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <MenuStack.Navigator>
        <MenuStack.Screen
          component={MenuScreen}
          getId={() => `MenuScreen${Math.random()}`}
          name="MenuScreen"
          options={{
            headerShown: false,
            animation: 'none',
          }}
        />
      </MenuStack.Navigator>
    </View>
  );
};

const MenuScreen = () => {
  const firstButtonRef = useRef(null);
  const focusGuideRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();

  // useEffect(() => {
  //   firstButtonRef.current?.requestTVFocus();
  // }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //    // Disabling this will cause the focus to go to the main screen when going back
  //     focusGuideRef.current?.requestTVFocus();
  //   }, []),
  // );

  return (
    <TVFocusGuideView
      ref={focusGuideRef}
      // Enabling this breaks focus on tvOS
      autoFocus={true}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
      }}
      trapFocusDown={true}
      trapFocusLeft={true}
      trapFocusRight={true}
      trapFocusUp={true}
    >
      <Text style={{ backgroundColor: 'white' }}>{route.key}</Text>
      <CustomButton
        ref={firstButtonRef}
        onPress={() => {
          navigation.navigate('MenuScreen');
        }}
      >
        Button 1
      </CustomButton>
      <CustomButton
        onPress={() => {
          navigation.navigate('MenuScreen');
        }}
      >
        Button 2
      </CustomButton>
    </TVFocusGuideView>
  );
};

const CustomButton = ({ children, onFocus, ...props }) => {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      {...props}
      style={{
        backgroundColor: 'blue',
        borderWidth: 5,
        borderColor: focused ? 'white' : 'transparent',
        padding: 20,
      }}
      onBlur={() => setFocused(false)}
      onFocus={(e) => {
        setFocused(true);

        onFocus?.(e);
      }}
    >
      <Text
        style={{
          color: 'white',
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
};
