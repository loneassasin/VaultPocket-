import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { Box, Button, Image, Switch, Text } from "native-base";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { app, auth, db } from "./../services/firebase";
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
      const userRef = doc(db, 'users', currentUser.uid);

      const unsubscribe = onSnapshot(userRef, (doc) => {
        const data = doc.data();
        setUserData(data || {
          name: currentUser.displayName,
          email: currentUser.email
        });
        setIsLoading(false);
      }, (error) => {
        console.error("Profile Screen error:", error);
        setIsLoading(false);
      });

      return unsubscribe;
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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg={theme.background}>
        <ActivityIndicator size="large" color={theme.primary} />
      </Box>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={currentTheme === "light" ? "dark" : "light"} />
      <Box flex={1} p={4}>
        <Box alignItems="center" mb={6}>
          <Image
            source={require("./../assets/images/avatar.png")}
            alt="Profile"
            size="xl"
            borderRadius={100}
            mb={4}
          />
          <Text fontSize="xl" color={theme.text} bold>
            {userData?.name || "User"}
          </Text>
          <Text fontSize="md" color={theme.textSecondary}>
            {userData?.email || ""}
          </Text>
        </Box>

        <Box mb={6}>
          <Box flexDirection="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Text fontSize="md" color={theme.text}>Dark Mode</Text>
            <Switch
              isChecked={currentTheme === "dark"}
              onToggle={toggleTheme}
              colorScheme="emerald"
            />
          </Box>
        </Box>

        <Button
          onPress={handleSignOut}
          bg="red.600"
          _pressed={{ bg: "red.700" }}
          mb={4}
        >
          Sign Out
        </Button>
      </Box>
    </SafeAreaView>
  );
};
