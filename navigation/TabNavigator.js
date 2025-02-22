import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "native-base";
import { useContext } from "react";
import { Ionicons } from '@expo/vector-icons';
import {
  AddPasswordScreen,
  HomeScreen,
  PasswordsScreen,
  ProfileScreen,
} from "./../screens";
import { ThemeContext, darkTheme, lightTheme } from "./../utils";

const { Navigator, Screen } = createBottomTabNavigator();

export const TabNavigator = () => {
  const { currentTheme } = useContext(ThemeContext);
  const theme = currentTheme === "light" ? lightTheme : darkTheme;

  return (
    <Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: theme.tabBarBg,
          borderTopColor: theme.tabBarBorder,
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon as={Ionicons} name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Screen
        name="Passwords"
        component={PasswordsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon as={Ionicons} name="key-outline" size={size} color={color} />
          ),
        }}
      />
      <Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon as={Ionicons} name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Screen
        name="AddPassword"
        component={AddPasswordScreen}
        options={{
          tabBarButton: () => null, // This hides the tab bar button
        }}
      />
    </Navigator>
  );
};
