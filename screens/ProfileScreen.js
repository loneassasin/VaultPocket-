import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { signOut } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { Box, Button, Image, Switch, Text } from "native-base";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { app, auth, database } from "./../services/firebase";
import { ThemeContext, darkTheme, lightTheme } from "./../utils";
import { ActivityIndicator } from "react-native";

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const { currentTheme, toggleTheme } = useContext(ThemeContext);

  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const theme = currentTheme === "light" ? lightTheme : darkTheme;

  const fetchUser = async () => {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      navigation.replace('Login');
      return;
    }

    try {
      setIsLoading(true);
      const userRef = ref(database, `users/${currentUser.uid}`);

      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        setUserData(data || {
          name: currentUser.displayName,
          email: currentUser.email
        });
        setIsLoading(false);
      }, (error) => {
        console.error("Profile Screen error:", error);
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Profile Screen error:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigation.replace('Login');
      } else {
        fetchUser();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error("Logout error:", error);
    }
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
          <ActivityIndicator size={24} color={theme.text} />
        ) : (
          <Text
            textAlign="center"
            fontSize={"3xl"}
            fontWeight="bold"
            color={theme.text}
          >
            {userData?.name || auth.currentUser?.displayName || 'User'}
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
            {userData?.email || auth.currentUser?.email || ''}
          </Text>
        </Box>

        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          my={2.5}
          px={4}
          py={2}
          bgColor="#D9D9D9"
          borderRadius={12}
        >
          <Text fontSize={14}>Dark Mode</Text>
          <Switch
            size="lg"
            onToggle={toggleTheme}
            isChecked={currentTheme === "dark"}
          />
        </Box>

        <Box position="absolute" bottom={10} w="full">
          <Button
            w="full"
            py={4}
            bgColor="#166079"
            _pressed={{ bgColor: "#166079" }}
            onPress={handleLogout}
          >
            <Text color="#ffffff" fontSize={16} fontWeight="bold">
              Logout
            </Text>
          </Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
};
