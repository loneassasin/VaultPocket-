// import { createNativeStackNavigator,card } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { LoginScreen, RegisterScreen, WelcomeScreen } from "./../screens";
import { app } from "./../services/firebase";
import { TabNavigator } from "./TabNavigator";

const { Navigator, Screen } = createStackNavigator();

const auth = getAuth(app);

const AppNavigator = () => {
  // const [authState, setAuthState] = useState(false);
  // const [user, setUser] = useState({});

  // useEffect(() => {
  // const unsubscribe = onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     // User is signed in
  //     console.log("User is signed in:", user.uid);
  //     setAuthState(user);
  //   } else {
  //     // User is signed out
  //     console.log("User is signed out");
  //   }
  // });

  // // Clean up the subscription when the component unmounts
  // return () => unsubscribe();
  // }, []);

  // const fetchUser = async () => {
  //   /* console.log(
  //     'await AsyncStorage.getItem("user")',
  //     await AsyncStorage.getItem("user")
  //   ); */

  //   const user = await AsyncStorage.getItem("user");
  //   return user ? JSON.parse(user) : null;
  // };

  // const fetchUserData = async () => {
  //   const fetchedUser = await fetchUser();
  //   if (fetchedUser) {
  //     setUser(fetchedUser);
  //   } else {
  //     // Handle the case when user is null or not found
  //   }
  // };

  // useEffect(() => {
  //   fetchUserData();
  // }, []);

  return (
    <Navigator screenOptions={{ headerShown: false }}>
      {/* {user ? ( */}
      {/* <Screen name="Tab" component={TabNavigator} /> */}
      {/* ) : ( */}
      {/* <> */}

      <Screen name="Tab" component={TabNavigator} />
      {/* </> */}
      {/* )} */}
    </Navigator>
  );
};

const AuthNavigator = () => {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      {/* {user ? ( */}
      {/* <Screen name="Tab" component={TabNavigator} /> */}
      {/* ) : ( */}
      {/* <> */}
      <Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        }}
      />
      <Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
        }}
      />
    </Navigator>
  );
};

export { AppNavigator, AuthNavigator };
