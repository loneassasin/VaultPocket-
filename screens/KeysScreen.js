import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import {
  Box,
  Flex,
  Image,
  Input,
  ScrollView,
  Text,
  useToast,
  View,
} from "native-base";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppLoader, List } from "./../components";
import { app, auth } from "./../services/firebase";
import { ThemeContext, darkTheme, lightTheme } from "./../utils";

const DATA = [
  {
    id: 1,
    icon: require("./../assets/images/netflix.png"),
    siteName: "netflix",
    username: "admin@netflix.com",
    password: "123456",
  },
  {
    id: 2,
    icon: require("./../assets/images/amazon.png"),
    siteName: "amazon",
    username: "admin@amazon.com",
    password: "123456",
  },
  {
    id: 3,
    icon: require("./../assets/images/gmail.png"),
    siteName: "gmail",
    username: "admin@gmail.com",
    password: "123456",
  },
  {
    id: 4,
    icon: require("./../assets/images/vk.png"),
    siteName: "vk",
    username: "admin@vk.com",
    password: "123456",
  },
  {
    id: 5,
    icon: require("./../assets/images/udemy.png"),
    siteName: "udemy",
    username: "admin@udemy.com",
    password: "123456",
  },
  {
    id: 6,
    icon: require("./../assets/images/slack.png"),
    siteName: "slack",
    username: "admin@slack.com",
    password: "123456",
  },
];

const database = getDatabase(app);

export const KeysScreen = () => {
  const { currentTheme } = useContext(ThemeContext);

  const navigation = useNavigation();

  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [userID, setUserID] = useState("");
  const [passwords, setPasswords] = useState({});
  const [isCopy, setIsCopy] = useState(false);
  const [search, setSearch] = useState("");
  const theme = currentTheme === "light" ? lightTheme : darkTheme;

  const fetchPasswords = async () => {
    const user = auth.currentUser;

    try {
      setIsLoading(true);
      const userRef = ref(database, `users/${user.uid}`);

      onValue(userRef, async (snapshot) => {
        const data = snapshot.val();

        // setUserID(user.uid);
        if (data?.passwords) {
          const passwordData = Object.values(data?.passwords);
          setPasswords(passwordData);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error("Keys Screen error", error);
      setIsLoading(false);
    }
  };

  const deletePassword = (id) => {
    const user = auth.currentUser;
    setIsLoading(true);
    const passwordRef = ref(database, `users/${user?.uid}/passwords/${id}`);
    remove(passwordRef);
    fetchPasswords();
  };

  const editPassword = (item) => {
    navigation.navigate("AddPassword", { item });
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="auto" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box mx={5}>
          <Flex my={4} h={16}>
            <Text color={theme.text}>Passwords</Text>
            <Flex
              flexDirection="row"
              alignItems="center"
              my={2}
              px={4}
              py={2}
              bgColor="#D9D9D9"
              borderRadius={12}
            >
              <Image
                source={require("./../assets/images/search.png")}
                alt="Search"
                w={5}
                h={5}
                ml={1}
              />
              <Input
                borderWidth={0}
                mx={2}
                // p={0.5}
                // py={2}
                fontSize={16}
                placeholder="Search by site name..."
                placeholderTextColor="#000000"
                color="#000000"
                bgColor="#D9D9D9"
                value={search}
                onChangeText={(i) => setSearch(i)}
              />
            </Flex>
          </Flex>
          {isLoading ? (
            <AppLoader />
          ) : passwords.length ? (
            <Flex mt={6}>
              {passwords
                .filter((i) => {
                  if (i.siteName === "") {
                    return;
                  } else {
                    return i?.siteName
                      .toLowerCase()
                      .includes(search.toLowerCase());
                  }
                })
                .map((item) => (
                  <List
                    key={item.id.toString()}
                    item={item}
                    setIsCopy={setIsCopy}
                    toast={toast}
                    deletePassword={deletePassword}
                    editPassword={editPassword}
                  />
                ))}
            </Flex>
          ) : (
            <Box my={"1/4"} justifyContent="center" alignItems="center">
              <Text color={theme.text}>
                Add your first password to experience the magic
              </Text>
              <Flex
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                my={2}
              >
                <Text color="#166079" fontSize={24} fontWeight="bold">
                  vault
                </Text>
                <Text
                  color={currentTheme === "light" ? "#474A48" : "#ffffff"}
                  fontSize={24}
                  fontWeight="bold"
                >
                  pocket
                </Text>
              </Flex>
              <Image
                source={require("./../assets/images/avatar_girl.png")}
                alt="Avatar Girl"
                size={56}
              />
            </Box>
          )}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};
