import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { signOut } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Box, Button, Icon, Text, VStack, HStack, Avatar, useToast, IconButton, Divider, Menu, Pressable, AlertDialog, Input, Switch } from "native-base";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { app, auth, db } from "./../services/firebase";
import { ThemeContext, darkTheme, lightTheme } from "./../utils";

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const { currentTheme, toggleTheme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const cancelRef = useRef(null);

  const theme = useMemo(() => currentTheme === "light" ? lightTheme : darkTheme, [currentTheme]);

  const fetchUser = useCallback(async () => {
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
          email: currentUser.email,
          createdAt: new Date()
        });
        setEditedName(data?.name || currentUser.displayName || "");
        setIsLoading(false);
      }, (error) => {
        console.error("Profile Screen error:", error);
        setIsLoading(false);
        toast.show({
          title: "Error",
          description: "Failed to fetch profile data",
          status: "error"
        });
      });

      return unsubscribe;
    } catch (error) {
      console.error("Profile Screen error:", error);
      setIsLoading(false);
      toast.show({
        title: "Error",
        description: "Failed to fetch profile data",
        status: "error"
      });
    }
  }, [navigation, toast]);

  useEffect(() => {
    let unsubscribe;
    const initFetch = async () => {
      unsubscribe = await fetchUser();
    };
    
    initFetch();
    
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [fetchUser]);

  const handleUpdateProfile = async () => {
    if (!editedName.trim()) {
      toast.show({
        title: "Error",
        description: "Name cannot be empty",
        status: "error"
      });
      return;
    }

    try {
      setIsLoading(true);
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        name: editedName.trim(),
        updatedAt: new Date()
      });
      
      setIsEditMode(false);
      toast.show({
        title: "Success",
        description: "Profile updated successfully",
        status: "success"
      });
    } catch (error) {
      console.error("Update profile error:", error);
      toast.show({
        title: "Error",
        description: "Failed to update profile",
        status: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error("Logout error:", error);
      toast.show({
        title: "Error",
        description: "Failed to logout",
        status: "error"
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={currentTheme === "dark" ? "light" : "dark"} />
      <Box flex={1} px={4} pt={4}>
        <HStack space={2} mb={6} alignItems="center" justifyContent="space-between">
          <VStack>
            <Text color={theme.textSecondary} fontSize="sm" mb={1}>
              Your Profile
            </Text>
            <Text color={theme.text} fontSize="3xl" fontWeight="bold">
              Settings
            </Text>
          </VStack>
        </HStack>

        <VStack space={6}>
          <Box
            bg={theme.listItemBg}
            borderColor={theme.listItemBorder}
            borderWidth={1}
            borderRadius="xl"
            p={6}
            shadow={1}
          >
            <VStack space={4}>
              <HStack space={4} alignItems="center">
                <Avatar
                  bg={theme.primary}
                  size="lg"
                >
                  {userData?.name?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
                <VStack flex={1}>
                  {isEditMode ? (
                    <Input
                      value={editedName}
                      onChangeText={setEditedName}
                      fontSize="lg"
                      fontWeight="bold"
                      bg={theme.inputBg}
                      borderColor={theme.inputBorder}
                      _focus={{
                        borderColor: theme.inputFocusBorder,
                        bg: theme.inputFocusBg,
                        borderWidth: 2,
                      }}
                      py={2}
                      px={3}
                      borderRadius="lg"
                    />
                  ) : (
                    <Text color={theme.text} fontSize="lg" fontWeight="bold">
                      {userData?.name || "User"}
                    </Text>
                  )}
                  <Text color={theme.textSecondary} fontSize="sm">
                    {userData?.email}
                  </Text>
                </VStack>
                <IconButton
                  icon={
                    <Icon
                      as={MaterialIcons}
                      name={isEditMode ? "check" : "edit"}
                      size="sm"
                      color={theme.primary}
                    />
                  }
                  variant="ghost"
                  _pressed={{ bg: theme.listItemHover }}
                  onPress={() => {
                    if (isEditMode) {
                      handleUpdateProfile();
                    } else {
                      setIsEditMode(true);
                    }
                  }}
                />
              </HStack>
            </VStack>
          </Box>

          <Box
            bg={theme.listItemBg}
            borderColor={theme.listItemBorder}
            borderWidth={1}
            borderRadius="xl"
            p={6}
            shadow={1}
          >
            <VStack space={4}>
              <Text color={theme.text} fontSize="lg" fontWeight="bold">
                Preferences
              </Text>
              
              <HStack alignItems="center" justifyContent="space-between">
                <HStack space={3} alignItems="center">
                  <Icon
                    as={MaterialIcons}
                    name={currentTheme === "dark" ? "dark-mode" : "light-mode"}
                    size="md"
                    color={theme.text}
                  />
                  <Text color={theme.text} fontSize="md">
                    Dark Mode
                  </Text>
                </HStack>
                <Switch
                  isChecked={currentTheme === "dark"}
                  onToggle={toggleTheme}
                  colorScheme="primary"
                />
              </HStack>
            </VStack>
          </Box>

          <Box
            bg={theme.listItemBg}
            borderColor={theme.listItemBorder}
            borderWidth={1}
            borderRadius="xl"
            p={6}
            shadow={1}
          >
            <VStack space={4}>
              <Text color={theme.text} fontSize="lg" fontWeight="bold">
                Account
              </Text>
              
              <Button
                onPress={() => setIsLogoutDialogOpen(true)}
                variant="ghost"
                _text={{ color: "red.500" }}
                leftIcon={<Icon as={MaterialIcons} name="logout" size="sm" color="red.500" />}
                justifyContent="flex-start"
                px={0}
              >
                Logout
              </Button>
            </VStack>
          </Box>
        </VStack>

        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isLogoutDialogOpen}
          onClose={() => setIsLogoutDialogOpen(false)}
        >
          <AlertDialog.Content bg={theme.cardBg}>
            <AlertDialog.Header bg={theme.cardBg} borderColor={theme.border}>
              <Text color={theme.text} fontSize="lg" fontWeight="bold">
                Logout
              </Text>
            </AlertDialog.Header>
            <AlertDialog.Body bg={theme.cardBg}>
              <Text color={theme.text}>
                Are you sure you want to logout?
              </Text>
            </AlertDialog.Body>
            <AlertDialog.Footer bg={theme.cardBg} borderColor={theme.border}>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="coolGray"
                  onPress={() => setIsLogoutDialogOpen(false)}
                  ref={cancelRef}
                >
                  Cancel
                </Button>
                <Button
                  bg="red.500"
                  _pressed={{ bg: "red.600" }}
                  onPress={handleLogout}
                >
                  Logout
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Box>
    </SafeAreaView>
  );
};
