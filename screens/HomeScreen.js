import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { collection, query, onSnapshot, orderBy, doc } from "firebase/firestore";
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
  const [userData, setUserData] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const theme = useMemo(() => currentTheme === "light" ? lightTheme : darkTheme, [currentTheme]);

  useEffect(() => {
    if (auth.currentUser) {
      const key = generateEncryptionKey(auth.currentUser.uid);
      setEncryptionKey(key);

      // Fetch user data
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setUserData(doc.data());
        }
      });

      return () => unsubscribe();
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

  const togglePasswordVisibility = useCallback((id) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  const renderItem = ({ item }) => (
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
              <HStack space={2} alignItems="center">
                <IconButton
                  icon={<Icon as={Ionicons} name={visiblePasswords[item.id] ? "eye-off-outline" : "eye-outline"} size="sm" color={theme.textSecondary} />}
                  onPress={(e) => {
                    e.stopPropagation();
                    togglePasswordVisibility(item.id);
                  }}
                  variant="ghost"
                  _pressed={{ bg: theme.primaryBg }}
                />
                <Menu
                  trigger={triggerProps => (
                    <IconButton
                      {...triggerProps}
                      icon={<Icon as={MaterialIcons} name="more-vert" size="sm" color={theme.textSecondary} />}
                      variant="ghost"
                      _pressed={{ bg: theme.listItemHover }}
                    />
                  )}
                  bg={theme.cardBg}
                  borderColor={theme.border}
                  borderWidth={1}
                >
                  <Menu.Item
                    onPress={() => {
                      Clipboard.setString(item.decryptedPassword);
                      toast.show({
                        title: "Password Copied",
                        status: "success",
                        duration: 2000
                      });
                    }}
                    _text={{ color: theme.text }}
                    _pressed={{ bg: theme.listItemHover }}
                  >
                    Copy Password
                  </Menu.Item>
                  <Menu.Item
                    onPress={() => {
                      Clipboard.setString(item.username);
                      toast.show({
                        title: "Username Copied",
                        status: "success",
                        duration: 2000
                      });
                    }}
                    _text={{ color: theme.text }}
                    _pressed={{ bg: theme.listItemHover }}
                  >
                    Copy Username
                  </Menu.Item>
                  <Menu.Item
                    onPress={() => navigation.navigate("AddPassword", { item })}
                    _text={{ color: theme.text }}
                    _pressed={{ bg: theme.listItemHover }}
                  >
                    Edit
                  </Menu.Item>
                </Menu>
              </HStack>
            </HStack>
            
            <Text color={theme.textSecondary} fontSize="sm" numberOfLines={1}>
              {item.username}
            </Text>

            <Text color={theme.textSecondary} fontSize="sm" numberOfLines={1}>
              {visiblePasswords[item.id] ? item.decryptedPassword : "••••••••"}
            </Text>
            
          </VStack>
        </HStack>
      </Box>
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={currentTheme === "dark" ? "light" : "dark"} />
      <Box flex={1} px={4} pt={4}>
        <HStack space={2} mb={6} alignItems="center" justifyContent="space-between">
          <VStack>
            <Text color={theme.textSecondary} fontSize="md">
              Welcome back
            </Text>
            <Text color={theme.text} fontSize="3xl" fontWeight="bold">
              {userData?.name ? `${userData.name.charAt(0).toUpperCase() + userData.name.slice(1)}` : 'Dashboard'}
            </Text>
          </VStack>
          <IconButton
            onPress={() => navigation.navigate("AddPassword")}
            icon={<Icon as={Ionicons} name="add" size="lg" color="white" />}
            bg={theme.primary}
            _pressed={{ bg: theme.primaryDark }}
            borderRadius="2xl"
            p={3}
            shadow={3}
          />
        </HStack>

        <HStack space={3} mb={6} alignItems="center">
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
              borderWidth: 2,
            }}
            fontSize="md"
            py={3}
            px={4}
            borderRadius="xl"
            InputLeftElement={
              <Icon
                as={Ionicons}
                name="search-outline"
                size={5}
                ml={4}
                color={theme.textSecondary}
              />
            }
            InputRightElement={
              searchQuery ? (
                <IconButton
                  icon={<Icon as={Ionicons} name="close-circle" size="sm" />}
                  onPress={() => setSearchQuery("")}
                  variant="ghost"
                  _icon={{ color: theme.textSecondary }}
                  mr={2}
                />
              ) : null
            }
          />
          <Menu
            trigger={triggerProps => (
              <IconButton
                {...triggerProps}
                icon={<Icon as={MaterialIcons} name="sort" size="md" color={theme.textSecondary} />}
                variant="ghost"
                _pressed={{ bg: theme.listItemHover }}
                borderRadius="xl"
                p={3}
              />
            )}
            bg={theme.cardBg}
            borderColor={theme.border}
            borderWidth={1}
          >
            <Menu.Item
              onPress={() => { setSortBy("createdAt"); setSortOrder("desc"); }}
              _text={{ color: theme.text }}
              _pressed={{ bg: theme.listItemHover }}
            >
              Newest First
            </Menu.Item>
            <Menu.Item
              onPress={() => { setSortBy("createdAt"); setSortOrder("asc"); }}
              _text={{ color: theme.text }}
              _pressed={{ bg: theme.listItemHover }}
            >
              Oldest First
            </Menu.Item>
            <Menu.Item
              onPress={() => { setSortBy("siteName"); setSortOrder("asc"); }}
              _text={{ color: theme.text }}
              _pressed={{ bg: theme.listItemHover }}
            >
              Site Name (A-Z)
            </Menu.Item>
            <Menu.Item
              onPress={() => { setSortBy("siteName"); setSortOrder("desc"); }}
              _text={{ color: theme.text }}
              _pressed={{ bg: theme.listItemHover }}
            >
              Site Name (Z-A)
            </Menu.Item>
          </Menu>
        </HStack>

        {isLoading ? (
          <Box flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator size="large" color={theme.primary} />
          </Box>
        ) : filteredPasswords.length === 0 ? (
          <Box flex={1} justifyContent="center" alignItems="center">
            <Icon
              as={Ionicons}
              name="lock-closed-outline"
              size={16}
              color={theme.textMuted}
              mb={6}
            />
            <Text color={theme.text} fontSize="xl" fontWeight="semibold" textAlign="center" mb={2}>
              {searchQuery ? "No matches found" : "No passwords yet"}
            </Text>
            <Text color={theme.textSecondary} fontSize="md" textAlign="center">
              {searchQuery
                ? "Try a different search term"
                : "Add your first password to get started"}
            </Text>
          </Box>
        ) : (
          <FlatList
            data={filteredPasswords}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ItemSeparatorComponent={() => <Box h={3} />}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={theme.primary}
              />
            }
          />
        )}
      </Box>
    </SafeAreaView>
  );
};
