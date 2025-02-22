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
      navigation.replace("Login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.show({
        title: "Error",
        description: "Failed to logout",
        status: "error"
      });
    }
  };

  const menuItems = [
    {
      icon: "key-outline",
      label: "Change Password",
      onPress: () => navigation.navigate("ChangePassword")
    },
    {
      icon: "shield-outline",
      label: "Security Settings",
      onPress: () => navigation.navigate("SecuritySettings")
    },
    {
      icon: "information-circle-outline",
      label: "About",
      onPress: () => navigation.navigate("About")
    }
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={currentTheme === "light" ? "dark" : "light"} />
      <Box flex={1} p={6}>
        <VStack space={6}>
          {/* Profile Header */}
          <HStack space={4} alignItems="center">
            <Avatar
              size="xl"
              bg={theme.primary}
              source={userData?.photoURL ? { uri: userData.photoURL } : null}
            >
              {userData?.name?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>
            <VStack flex={1}>
              {isEditMode ? (
                <HStack space={2} alignItems="center">
                  <Input
                    flex={1}
                    value={editedName}
                    onChangeText={setEditedName}
                    placeholder="Enter your name"
                    size="lg"
                    bg={theme.cardBackground}
                    color={theme.textColor}
                    borderColor={theme.borderColor}
                    _focus={{
                      borderColor: theme.primary,
                      bg: theme.cardBackground
                    }}
                  />
                  <IconButton
                    variant="solid"
                    bg={theme.primary}
                    icon={<Icon as={Ionicons} name="checkmark" size="sm" color="white" />}
                    onPress={handleUpdateProfile}
                    isLoading={isLoading}
                  />
                  <IconButton
                    variant="outline"
                    borderColor={theme.primary}
                    icon={<Icon as={Ionicons} name="close" size="sm" color={theme.primary} />}
                    onPress={() => {
                      setIsEditMode(false);
                      setEditedName(userData?.name || "");
                    }}
                  />
                </HStack>
              ) : (
                <HStack space={2} alignItems="center">
                  <Text fontSize="xl" bold color={theme.textColor}>
                    {userData?.name || "User"}
                  </Text>
                  <IconButton
                    variant="ghost"
                    icon={<Icon as={Ionicons} name="pencil" size="sm" color={theme.primary} />}
                    onPress={() => setIsEditMode(true)}
                  />
                </HStack>
              )}
              <Text fontSize="sm" color={theme.textSecondary}>
                {userData?.email || ""}
              </Text>
              {userData?.createdAt && (
                <Text fontSize="xs" color={theme.textSecondary}>
                  Member since {userData.createdAt.toDate().toLocaleDateString()}
                </Text>
              )}
            </VStack>
          </HStack>

          <Divider bg={theme.borderColor} />

          {/* Settings */}
          <VStack space={4}>
            <Text fontSize="lg" bold color={theme.textColor}>
              Settings
            </Text>

            <HStack space={4} alignItems="center" justifyContent="space-between">
              <HStack space={3} alignItems="center">
                <Icon
                  as={Ionicons}
                  name={currentTheme === "light" ? "sunny" : "moon"}
                  size={6}
                  color={theme.textColor}
                />
                <Text fontSize="md" color={theme.textColor}>
                  Dark Mode
                </Text>
              </HStack>
              <Switch
                isChecked={currentTheme === "dark"}
                onToggle={toggleTheme}
                colorScheme="primary"
              />
            </HStack>

            {menuItems.map((item, index) => (
              <Pressable
                key={index}
                onPress={item.onPress}
              >
                <HStack space={3} alignItems="center" py={2}>
                  <Icon
                    as={Ionicons}
                    name={item.icon}
                    size={6}
                    color={theme.textColor}
                  />
                  <Text flex={1} fontSize="md" color={theme.textColor}>
                    {item.label}
                  </Text>
                  <Icon
                    as={Ionicons}
                    name="chevron-forward"
                    size={5}
                    color={theme.textSecondary}
                  />
                </HStack>
              </Pressable>
            ))}
          </VStack>

          <Button
            size="lg"
            variant="outline"
            borderColor="red.500"
            _pressed={{ bg: theme.cardBackground }}
            onPress={() => setIsLogoutDialogOpen(true)}
            leftIcon={<Icon as={Ionicons} name="log-out-outline" size="sm" color="red.500" />}
          >
            <Text color="red.500">Sign Out</Text>
          </Button>
        </VStack>

        {/* Logout Confirmation Dialog */}
        <AlertDialog
          leastDestructiveRef={cancelRef}
          isOpen={isLogoutDialogOpen}
          onClose={() => setIsLogoutDialogOpen(false)}
        >
          <AlertDialog.Content bg={theme.cardBackground}>
            <AlertDialog.Header bg={theme.cardBackground} borderColor={theme.borderColor}>
              <Text color={theme.textColor} bold>Sign Out</Text>
            </AlertDialog.Header>
            <AlertDialog.Body bg={theme.cardBackground}>
              <Text color={theme.textColor}>
                Are you sure you want to sign out?
              </Text>
            </AlertDialog.Body>
            <AlertDialog.Footer bg={theme.cardBackground} borderColor={theme.borderColor}>
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
                  Sign Out
                </Button>
              </Button.Group>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </Box>
    </SafeAreaView>
  );
};
