import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { signOut } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import { Box, Button, Image, Switch, Text } from "native-base";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { app, auth } from "./../services/firebase";
import { ThemeContext, darkTheme, lightTheme } from "./../utils";
import { ActivityIndicator } from "react-native";

// const auth = getAuth(app);
const database = getDatabase(app);

export const ProfileScreen = () => {
  const navigation = useNavigation();

  const { currentTheme, toggleTheme } = useContext(ThemeContext);

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});

  const theme = currentTheme === "light" ? lightTheme : darkTheme;

  const fetchUser = async () => {
    const user = auth.currentUser;

    try {
      setIsLoading(true);
      const userRef = ref(database, `users/${user.uid}`);

      onValue(userRef, async (snapshot) => {
        const data = snapshot.val();

        setUser(data);

        setIsLoading(false);
      });
    } catch (error) {
      console.error("Keys Screen error", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out successfully:");
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="auto" />
      <Box mx={5} h="full" position="relative">
        <Box mt={12} justifyContent="center" alignItems="center">
          <Image
            source={require("./../assets/images/avatar.png")}
            alt="Avatar"
            size={20}
            borderRadius="full"
          />
        </Box>
        {isLoading ? (
          <ActivityIndicator size={24} color={"black"} />
        ) : (
          <Text
            textAlign="center"
            fontSize={"3xl"}
            fontWeight="bold"
            color={theme.text}
          >
            {user.name}
          </Text>
        )}

        <Box
          justifyContent="space-between"
          alignItems="center"
          px={4}
          py={1}
          bgColor="#D9D9D9"
          borderRadius={12}
        >
          <Text fontSize={24} fontWeight="bold">
            66%
          </Text>
          <Text fontSize={14}>Password Safety Score</Text>
        </Box>
        <Box my={2.5} px={4} py={2} bgColor="#D9D9D9" borderRadius={12}>
          <Text fontSize={14}>Username</Text>
          <Text fontSize={14} opacity={0.5}>
            {user.email}
          </Text>
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          px={4}
          bgColor="#D9D9D9"
          borderRadius={12}
          py={2}
        >
          <Text fontSize={14}>Dark Mode</Text>
          <Switch
            size="md"
            h={8}
            onTrackColor="#0E660C"
            offTrackColor="#730000"
            value={currentTheme === "dark"}
            onValueChange={toggleTheme}
          />
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
          px={4}
          py={3}
          bgColor="#D9D9D9"
          borderRadius={12}
        >
          <Text fontSize={14}>Change Master Password</Text>
          <Image
            source={require("./../assets/images/chevron.png")}
            alt="Chevron"
            size={4}
          />
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          px={4}
          py={3}
          mt={2}
          bgColor="#D9D9D9"
          borderRadius={12}
        >
          <Text fontSize={14}>Clear Clipboard</Text>
          <Box flexDirection="row" alignItems="center">
            <Text color={"#000000"} opacity={0.5}>
              30 Seconds
            </Text>
            <Image
              source={require("./../assets/images/chevron.png")}
              alt="Chevron"
              size={4}
            />
          </Box>
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          my={1}
          px={4}
          py={3}
          mt={2}
          bgColor="#D9D9D9"
          borderRadius={12}
        >
          <Text fontSize={14}>Auto logout</Text>
          <Box flexDirection="row" alignItems="center">
            <Text color={"#000000"} opacity={0.5}>
              Never
            </Text>
            <Image
              source={require("./../assets/images/chevron.png")}
              alt="Chevron"
              size={4}
            />
          </Box>
        </Box>
        <Box w="full" position="absolute" bottom={24} left={0}>
          <Button
            bgColor="#C30E0E"
            onPress={
              handleLogout
              // async () => {
              // signOut(auth).then(async () => {
              //   await AsyncStorage.removeItem("user").then(() =>
              //     navigation.navigate("Login")
              //   );
              // });
              // }
            }
            borderRadius={12}
          >
            <Box flexDirection="row" alignItems="center">
              <Image
                source={require("./../assets/images/logout.png")}
                alt="Log out"
                size={7}
                mx={1}
              />
              <Text fontSize={32} color="#ffffff">
                Log Out
              </Text>
            </Box>
          </Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
};
