import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { Box, Button, Flex, Icon, Text, useToast, Input, HStack, VStack, Pressable, Divider, IconButton, Progress } from "native-base";
import { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from "./../services/firebase";
import { ThemeContext, darkTheme, lightTheme } from "./../utils";
import { decryptData, generateEncryptionKey } from "./../utils/encryption";

const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

const getStrengthColor = (strength) => {
  switch (strength) {
    case 1: return "error.500";
    case 2: return "error.400";
    case 3: return "warning.500";
    case 4: return "success.400";
    case 5: return "success.500";
    default: return "error.500";
  }
};

export const PasswordsScreen = () => {
  const { currentTheme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const toast = useToast();
  const theme = currentTheme === "light" ? lightTheme : darkTheme;

  const [isLoading, setIsLoading] = useState(false);
  const [passwords, setPasswords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const currentUser = auth.currentUser;
  const encryptionKey = generateEncryptionKey(currentUser?.uid);

  useEffect(() => {
    if (!currentUser) return;

    setIsLoading(true);
    const passwordsRef = collection(db, 'users', currentUser.uid, 'passwords');
    const q = query(passwordsRef, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const passwordsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPasswords(passwordsList);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, isFocused]);

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'passwords', id));
      toast.show({
        title: "Success",
        description: "Password deleted successfully",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error deleting password:", error);
      toast.show({
        title: "Error",
        description: "Failed to delete password",
        status: "error",
        duration: 2000,
      });
    }
  }, [currentUser, toast]);

  const filteredPasswords = passwords.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.siteName.toLowerCase().includes(searchLower) ||
      item.username.toLowerCase().includes(searchLower) ||
      (item.url && item.url.toLowerCase().includes(searchLower))
    );
  });

  const renderItem = ({ item }) => {
    let decryptedPassword = "";
    try {
      decryptedPassword = decryptData(item.password, encryptionKey);
    } catch (error) {
      console.error("Error decrypting password:", error);
    }

    const strength = calculatePasswordStrength(decryptedPassword);

    return (
      <Pressable
        onPress={() => navigation.navigate("AddPassword", { item })}
        mb={3}
      >
        <Box
          bg={theme.listItemBg}
          borderColor={theme.listItemBorder}
          borderWidth={1}
          borderRadius="xl"
          p={4}
          shadow={1}
          _pressed={{ bg: theme.listItemHover }}
        >
          <HStack space={4} alignItems="center">
            <Box
              bg={theme.primaryBg}
              p={3}
              borderRadius="lg"
            >
              <Icon
                as={Ionicons}
                name={item.url ? "globe-outline" : "lock-closed-outline"}
                size={6}
                color={theme.primary}
              />
            </Box>
            
            <VStack space={2} flex={1}>
              <HStack justifyContent="space-between" alignItems="center">
                <Text color={theme.text} fontSize="lg" fontWeight="bold" numberOfLines={1} flex={1}>
                  {item.siteName}
                </Text>
                <IconButton
                  icon={<Icon as={Ionicons} name="trash-outline" size="sm" color={theme.error.light} />}
                  onPress={() => handleDelete(item.id)}
                  variant="ghost"
                  _pressed={{ bg: theme.error.light + "20" }}
                />
              </HStack>
              
              <Text color={theme.textSecondary} fontSize="sm" numberOfLines={1}>
                {item.username}
              </Text>
              
              <HStack space={2} alignItems="center">
                <Progress
                  value={strength * 20}
                  size="xs"
                  flex={1}
                  bg={theme.sliderTrack}
                  _filledTrack={{ bg: getStrengthColor(strength) }}
                />
                <Text fontSize="xs" color={theme.textMuted}>
                  {strength === 5 ? "Strong" : strength >= 3 ? "Medium" : "Weak"}
                </Text>
              </HStack>
            </VStack>
          </HStack>
        </Box>
      </Pressable>
    );
  };

  if (isLoading) {
    return (
      <Flex flex={1} justify="center" align="center">
        <ActivityIndicator size="large" color={theme.primary} />
      </Flex>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={currentTheme === "dark" ? "light" : "dark"} />
      <Box flex={1} px={4} pt={4}>
        <HStack space={2} mb={4} alignItems="center" justifyContent="space-between">
          <Text color={theme.text} fontSize="2xl" fontWeight="bold">
            Passwords
          </Text>
          <IconButton
            onPress={() => navigation.navigate("AddPassword")}
            icon={<Icon as={Ionicons} name="add" size="md" color="white" />}
            bg={theme.primary}
            _pressed={{ bg: theme.primaryDark }}
            borderRadius="full"
            p={2}
          />
        </HStack>

        <HStack space={2} mb={4} alignItems="center">
          <Input
            flex={1}
            placeholder="Search passwords..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            bg={theme.inputBg}
            borderColor={theme.inputBorder}
            _focus={{
              borderColor: theme.inputFocusBorder,
              bg: theme.inputFocusBg,
            }}
            fontSize="md"
            py={2}
            px={4}
            InputLeftElement={
              <Icon
                as={Ionicons}
                name="search-outline"
                size={5}
                ml={2}
                color={theme.textSecondary}
              />
            }
            InputRightElement={
              searchQuery ? (
                <IconButton
                  icon={<Icon as={Ionicons} name="close-circle" />}
                  onPress={() => setSearchQuery("")}
                  variant="ghost"
                  _icon={{ color: theme.textSecondary }}
                  mr={1}
                />
              ) : null
            }
          />
        </HStack>

        {filteredPasswords.length === 0 ? (
          <Flex flex={1} justify="center" align="center">
            <Icon
              as={Ionicons}
              name="lock-closed-outline"
              size={12}
              color={theme.textMuted}
              mb={4}
            />
            <Text color={theme.textMuted} fontSize="lg" textAlign="center">
              {searchQuery
                ? "No passwords match your search"
                : "No passwords saved yet"}
            </Text>
          </Flex>
        ) : (
          <FlatList
            data={filteredPasswords}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </Box>
    </SafeAreaView>
  );
};
