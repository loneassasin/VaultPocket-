import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { getDatabase, onValue, ref } from "firebase/database";
import { Box, Button, Flex, Image, Text, View } from "native-base";
import { useContext, useEffect, useState } from "react";
import { ScrollView } from "react-native";
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

export const HomeScreen = () => {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState("");
  const [passwords, setPasswords] = useState({});
  const [isCopy, setIsCopy] = useState(false);

  const { currentTheme } = useContext(ThemeContext);

  const theme = currentTheme === "light" ? lightTheme : darkTheme;

  const fetchPasswords = async () => {
    const user = auth.currentUser;

    try {
      setIsLoading(true);
      const userRef = ref(database, `users/${user.uid}`);

      onValue(userRef, async (snapshot) => {
        const data = snapshot.val();
        console.log("dataa", data);
        setUser(data?.name);
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

  useEffect(() => {
    fetchPasswords();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {isLoading ? (
          <AppLoader />
        ) : (
          <Box mx={5}>
            <Flex
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              my={4}
              h={16}
            >
              <View flexDir={"row"}>
                <Box h="full" justifyContent="center">
                  <Image
                    source={require("./../assets/images/avatar.png")}
                    alt="Avatar"
                    w={10}
                    h={10}
                  />
                </Box>
                <Box h="full" justifyContent="center">
                  <Text color={theme.text}>Welcome</Text>
                  <Text color={theme.text} fontSize="lg" fontWeight="bold">
                    {user}
                  </Text>
                </Box>
              </View>
              <Button
                p={0}
                variant="unstyled"
                onPress={() => navigation.navigate("Keys")}
                h="full"
                justifyContent="center"
              >
                <Image
                  source={require("./../assets/images/search.png")}
                  alt="Search"
                  w={4}
                  h={4}
                  tintColor={theme.text}
                />
              </Button>
            </Flex>
            {passwords.length ? (
              <>
                <Flex
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={6}
                >
                  <Text fontWeight="extrabold" color={theme.text}>
                    Recently Used
                  </Text>
                  <Button
                    variant="unstyled"
                    m={0}
                    p={0}
                    onPress={() => navigation.navigate("Keys")}
                  >
                    <Text color={theme.text}>See More</Text>
                  </Button>
                </Flex>
                <Flex mt={3} h="75%">
                  {passwords.map((item) => (
                    <List
                      key={item.id.toString()}
                      item={item}
                      setIsCopy={setIsCopy}
                    />
                  ))}
                </Flex>
              </>
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
