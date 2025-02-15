import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { Box, Button, Flex, Icon, Text, useToast } from "native-base";
import { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { List } from "./../components";
import { auth, db } from "./../services/firebase";
import { ThemeContext, darkTheme, lightTheme } from "./../utils";
import { decryptData, generateEncryptionKey } from "./../utils/encryption";

export const KeysScreen = () => {
  const { currentTheme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [passwords, setPasswords] = useState([]);
  const [isCopy, setIsCopy] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState("");

  const theme = currentTheme === "light" ? lightTheme : darkTheme;

  useEffect(() => {
    if (auth.currentUser) {
      const key = generateEncryptionKey(auth.currentUser.uid);
      setEncryptionKey(key);
    }
  }, []);

  const fetchPasswords = useCallback(() => {
    const user = auth.currentUser;
    if (!user || !encryptionKey) {
      if (!user) navigation.replace('Login');
      return;
    }

    try {
      setIsLoading(true);
      const passwordsRef = collection(db, 'users', user.uid, 'passwords');
      const q = query(passwordsRef, orderBy('createdAt', 'desc'));

      return onSnapshot(q, (snapshot) => {
        const passwordsList = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          try {
            // Decrypt the password
            const decryptedPassword = decryptData(data.password, encryptionKey);
            if (decryptedPassword) {
              passwordsList.push({
                id: doc.id,
                siteName: data.siteName || '',
                username: data.username || '',
                password: decryptedPassword,
                url: data.url || '',
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
              });
            }
          } catch (error) {
            console.error("Error decrypting password:", error);
          }
        });
        setPasswords(passwordsList);
        setIsLoading(false);
      }, (error) => {
        console.error("Error fetching passwords:", error);
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Error setting up password listener:", error);
      setIsLoading(false);
    }
  }, [navigation, encryptionKey]);

  useEffect(() => {
    const unsubscribe = fetchPasswords();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [fetchPasswords]);

  const deletePassword = async (id) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        navigation.replace('Login');
        return;
      }

      setIsLoading(true);
      const passwordRef = doc(db, 'users', user.uid, 'passwords', id);
      await deleteDoc(passwordRef);

      toast.show({
        render: () => (
          <Box bg="#0E660C" px={4} py={2} rounded="md" mb={5}>
            <Text color="#ffffff">Password Deleted Successfully</Text>
          </Box>
        ),
      });
    } catch (error) {
      console.error("Error deleting password:", error);
      toast.show({
        render: () => (
          <Box bg="#730000" px={4} py={2} rounded="md" mb={5}>
            <Text color="#ffffff">Error deleting password</Text>
          </Box>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const editPassword = (item) => {
    navigation.navigate("AddPassword", { item });
  };

  if (isLoading) {
    return (
      <Flex flex={1} justify="center" align="center">
        <ActivityIndicator size="large" color={theme.text} />
      </Flex>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="auto" />
      <Box flex={1} bg={theme.background} safeArea>
        <Flex
          direction="row"
          justify="space-between"
          align="center"
          px={4}
          py={4}
        >
          <Text color={theme.text} fontSize="2xl" fontWeight="bold">
            Keys
          </Text>
        </Flex>

        {passwords.length === 0 ? (
          <Flex flex={1} justify="center" align="center">
            <Text color={theme.text} fontSize="lg">
              No passwords added yet
            </Text>
          </Flex>
        ) : (
          <FlatList
            data={passwords}
            renderItem={({ item }) => (
              <List
                item={item}
                setIsCopy={setIsCopy}
                editPassword={editPassword}
                deletePassword={deletePassword}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 15 }}
          />
        )}
      </Box>
    </SafeAreaView>
  );
};
