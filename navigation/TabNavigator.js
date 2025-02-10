import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "native-base";
import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import {
  AddPasswordScreen,
  HomeScreen,
  KeysScreen,
  ProfileScreen,
} from "./../screens";
import { ThemeContext, darkTheme, lightTheme } from "./../utils";

const TabButton = ({ label, iconName, isActive, choosenTheme }) => (
  <View style={styles.tabButtonContainer}>
    <Image
      source={iconName}
      alt={label}
      tintColor={choosenTheme.text}
      style={
        iconName === require("./../assets/images/add_circle.png")
          ? styles.tabIconForAddPassword
          : styles.tabIconSizeForAll
      }
    />
    {isActive && <View style={styles.activeIndicator} />}
  </View>
);

const { Navigator, Screen } = createBottomTabNavigator();

export const TabNavigator = () => {
  const { currentTheme } = useContext(ThemeContext);

  const theme = currentTheme === "light" ? lightTheme : darkTheme;

  return (
    <Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          // height: 50,
          position: "absolute",
          bottom: 10,
          marginHorizontal: 20,
          borderRadius: 10,
          backgroundColor: theme.background,
          shadowColor: theme.text,
        },
      }}
    >
      <Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabButton
              label="Home"
              iconName={require("./../assets/images/home.png")}
              isActive={focused}
              choosenTheme={theme}
            />
          ),
        }}
      />
      <Screen
        name="Keys"
        component={KeysScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabButton
              label="Keys"
              iconName={require("./../assets/images/access_key.png")}
              isActive={focused}
              choosenTheme={theme}
            />
          ),
        }}
      />
      <Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabButton
              label="Profile"
              iconName={require("./../assets/images/profile.png")}
              isActive={focused}
              choosenTheme={theme}
            />
          ),
        }}
      />
      <Screen
        name="AddPassword"
        component={AddPasswordScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabButton
              label="Add Password"
              iconName={require("./../assets/images/add_circle.png")}
              isActive={focused}
              choosenTheme={theme}
            />
          ),
        }}
      />
    </Navigator>
  );
};

const styles = StyleSheet.create({
  tabButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconSizeForAll: {
    width: 20,
    height: 20,
  },
  tabIconForAddPassword: {
    width: 35,
    height: 35,
  },
  activeIndicator: {
    width: 3,
    height: 3,
    borderRadius: 5,
    backgroundColor: "#C96B6B",
    marginTop: 2,
  },
});
