import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { Box, Fab, Icon, Input, VStack, HStack, Text, useToast, Pressable, Menu, IconButton, Divider, Spinner } from "native-base";
import { useCallback, useContext, useEffect, useState, useMemo } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Clipboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { auth, db } from "./../services/firebase";
import { ThemeContext, darkTheme, lightTheme } from "./../utils";
import { decryptData, generateEncryptionKey } from "./../utils/encryption";

export const HomeScreen = () => {
  const { currentTheme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [passwords, setPasswords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [encryptionKey, setEncryptionKey] = useState("");
  
  const theme = useMemo(() => currentTheme === "light" ? lightTheme : darkTheme, [currentTheme]);

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
      const q = query(passwordsRef, orderBy(sortBy, sortOrder));
      
      return onSnapshot(q, (snapshot) => {
        const passwordsList = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          try {
            const decryptedPassword = decryptData(data.password, encryptionKey);
            if (decryptedPassword) {
              passwordsList.push({
                id: doc.id,
                siteName: data.siteName || '',
                url: data.url || '',
                username: data.username || '',
                password: data.password,
                decryptedPassword,
                category: data.category || 'Uncategorized',
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
              });
            }
          } catch (error) {
            console.error('Error decrypting password:', error);
          }
        });
        setPasswords(passwordsList);
        setIsLoading(false);
        setRefreshing(false);
      });
    } catch (error) {
      console.error('Error fetching passwords:', error);
      setIsLoading(false);
      setRefreshing(false);
      toast.show({
        title: "Error",
        description: "Failed to fetch passwords",
        status: "error"
      });
    }
  }, [encryptionKey, sortBy, sortOrder, navigation, toast]);

  useEffect(() => {
    const unsubscribe = fetchPasswords();
    return () => unsubscribe && unsubscribe();
  }, [fetchPasswords]);

  const filteredPasswords = useMemo(() => {
    return passwords.filter(item => 
      item.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [passwords, searchQuery]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPasswords();
  }, [fetchPasswords]);

  const renderItem = useCallback(({ item }) => (
    <Pressable
      onPress={() => navigation.navigate('AddPassword', { item })}
      mb={2}
      bg={theme.cardBackground}
      rounded="lg"
      shadow={1}
      p={4}
    >
      <HStack space={4} alignItems="center" justifyContent="space-between">
        <VStack flex={1}>
          <Text color={theme.textColor} bold fontSize="md">
            {item.siteName}
          </Text>
          <Text color={theme.textSecondary} fontSize="sm">
            {item.username}
          </Text>
          {item.url && (
            <Text color={theme.textSecondary} fontSize="xs" numberOfLines={1}>
              {item.url}
            </Text>
          )}
        </VStack>
        <HStack space={2}>
          <IconButton
            variant="ghost"
            colorScheme="primary"
            icon={<Icon as={Ionicons} name="copy-outline" />}
            onPress={() => {
              Clipboard.setString(item.decryptedPassword);
              toast.show({
                title: "Password Copied",
                status: "success",
                duration: 2000
              });
            }}
          />
          <Menu
            trigger={triggerProps => (
              <IconButton
                {...triggerProps}
                variant="ghost"
                colorScheme="primary"
                icon={<Icon as={MaterialIcons} name="more-vert" />}
              />
            )}
          >
            <Menu.Item onPress={() => navigation.navigate('AddPassword', { item })}>
              Edit
            </Menu.Item>
            <Menu.Item onPress={() => handleDelete(item.id)}>
              Delete
            </Menu.Item>
          </Menu>
        </HStack>
      </HStack>
    </Pressable>
  ), [theme, navigation, toast]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={currentTheme === "light" ? "dark" : "light"} />
      <Box flex={1} px={4}>
        <VStack space={4} mb={4}>
          <Input
            placeholder="Search passwords..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            bg={theme.cardBackground}
            color={theme.textColor}
            borderColor={theme.borderColor}
            InputLeftElement={
              <Icon
                as={Ionicons}
                name="search-outline"
                size={5}
                ml={2}
                color={theme.textSecondary}
              />
            }
          />
          <HStack justifyContent="space-between" alignItems="center">
            <Menu
              trigger={triggerProps => (
                <Pressable {...triggerProps} flexDirection="row" alignItems="center">
                  <Text color={theme.textColor} mr={1}>Sort by</Text>
                  <Icon as={MaterialIcons} name="sort" color={theme.textColor} />
                </Pressable>
              )}
            >
              <Menu.Item onPress={() => { setSortBy("createdAt"); setSortOrder("desc"); }}>
                Newest First
              </Menu.Item>
              <Menu.Item onPress={() => { setSortBy("createdAt"); setSortOrder("asc"); }}>
                Oldest First
              </Menu.Item>
              <Menu.Item onPress={() => { setSortBy("siteName"); setSortOrder("asc"); }}>
                Site Name (A-Z)
              </Menu.Item>
              <Menu.Item onPress={() => { setSortBy("siteName"); setSortOrder("desc"); }}>
                Site Name (Z-A)
              </Menu.Item>
            </Menu>
            <Text color={theme.textSecondary}>
              {filteredPasswords.length} passwords
            </Text>
          </HStack>
        </VStack>

        {isLoading ? (
          <Box flex={1} justifyContent="center" alignItems="center">
            <Spinner size="lg" color={theme.primary} />
          </Box>
        ) : (
          <FlatList
            data={filteredPasswords}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={theme.primary}
              />
            }
            ListEmptyComponent={
              <Box flex={1} justifyContent="center" alignItems="center" py={10}>
                <Icon
                  as={Ionicons}
                  name="lock-closed-outline"
                  size={12}
                  color={theme.textSecondary}
                  mb={4}
                />
                <Text color={theme.textColor} fontSize="lg" bold>
                  No passwords found
                </Text>
                <Text color={theme.textSecondary} textAlign="center">
                  {searchQuery ? "Try a different search term" : "Add your first password"}
                </Text>
              </Box>
            }
          />
        )}

        <Fab
          renderInPortal={false}
          shadow={2}
          size="lg"
          icon={<Icon color="white" as={Ionicons} name="add" size="lg" />}
          onPress={() => navigation.navigate('AddPassword')}
          bg={theme.primary}
        />
      </Box>
    </SafeAreaView>
  );
};
