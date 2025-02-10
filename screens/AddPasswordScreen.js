// import { BlurView } from "expo-blur";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { getDatabase, push, ref, set, update } from "firebase/database";
import { Base64 } from "js-base64";
import {
  Actionsheet,
  Box,
  Button,
  Image,
  Input,
  Slider,
  Switch,
  Text,
  useDisclose,
  useToast,
} from "native-base";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppLoader } from "./../components";
import { app, auth } from "./../services/firebase";
import {
  ThemeContext,
  darkTheme,
  encryptedPassword,
  generatePassword,
  lightTheme,
} from "./../utils";

const database = getDatabase(app);

export const AddPasswordScreen = () => {
  const { isOpen, onOpen, onClose } = useDisclose();

  const { currentTheme } = useContext(ThemeContext);

  const navigation = useNavigation();

  const route = useRoute();
  const isFocused = useIsFocused();

  // const { item } = route.params;

  const toast = useToast();

  // const [data, setData] = useState(item ? item : null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});
  const [siteName, setSiteName] = useState("");
  const [url, setURL] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isIncludeNumbersEnabled, setIsIncludeNumbersEnabled] = useState(true);
  const [isIncludeUppercaseEnabled, setIsIncludeUppercaseEnabled] =
    useState(false);
  const [isIncludeLowercaseEnabled, setIsIncludeLowercaseEnabled] =
    useState(false);
  const [isIncludeSymbolsEnabled, setIsIncludeSymbolsEnabled] = useState(false);
  const [passwordLength, setPasswordLength] = useState(12);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const theme = currentTheme === "light" ? lightTheme : darkTheme;

  // const fetchUser = async () => {
  //   /* console.log(
  //     'await AsyncStorage.getItem("user")',
  //     await AsyncStorage.getItem("user")
  //   ); */

  //   const user = await AsyncStorage.getItem("user");
  //   return user ? JSON.parse(user) : null;
  // };

  // const fetchUserData = async () => {
  //   const fetchedUser = await fetchUser();
  //   if (fetchedUser) {
  //     setUser(fetchedUser);
  //   } else {
  //     // Handle the case when user is null or not found
  //   }
  // };

  useEffect(() => {
    if (route?.params?.item) {
      setSiteName(route?.params?.item?.siteName);
      setURL(route?.params?.item?.url);
      setUsername(route?.params?.item?.username);
      setPassword(Base64.decode(route?.params?.item?.password));
    }
  }, [isFocused]);
  useEffect(() => {
    handleGeneratePassword();
  }, [
    passwordLength,
    isIncludeNumbersEnabled,
    isIncludeUppercaseEnabled,
    isIncludeLowercaseEnabled,
    isIncludeSymbolsEnabled,
  ]);
  const handleCloseBottomSheet = () => {
    // Set the generated password on the password input
    setPassword(generatedPassword);
    onClose();
  };

  const handleGeneratePassword = () => {
    const password = generatePassword(
      passwordLength,
      isIncludeNumbersEnabled,
      isIncludeUppercaseEnabled,
      isIncludeLowercaseEnabled,
      isIncludeSymbolsEnabled
    );
    setGeneratedPassword(
      password.includes("undefined") ? "No-password-set" : password
    );
  };
  const handleSubmit = async () => {
    const user = auth.currentUser;
    setIsLoading(true);

    if (route?.params?.item?.id) {
      if (siteName && url && username && password) {
        try {
          update(
            ref(
              database,
              `users/${user.uid}/passwords/${route?.params?.item?.id}`
            ),
            {
              siteName,
              url,
              username,
              password: Base64.encode(password),
              icon: "",
            }
          ).then(() => {
            setSiteName("");
            setURL("");
            setUsername("");
            setPassword("");

            setIsLoading(false);

            navigation.navigate("Keys");

            toast.show({
              render: () => {
                return (
                  <Box
                    bg={currentTheme === "light" ? "#000000" : "#ffffff"}
                    px={12}
                    py={0.5}
                    rounded="md"
                    mb={5}
                    borderWidth={1}
                  >
                    <Text
                      color={currentTheme === "light" ? "#ffffff" : "#000000"}
                    >
                      Detail Updated Successfully
                    </Text>
                  </Box>
                );
              },
            });
          });
        } catch (error) {
          // console.error("add password screen error", error);
          setIsLoading(false);

          toast.show({
            render: () => {
              return (
                <Box
                  bg={currentTheme === "light" ? "#000000" : "#ffffff"}
                  px={12}
                  py={0.5}
                  rounded="md"
                  mb={5}
                  borderWidth={1}
                >
                  <Text
                    color={currentTheme === "light" ? "#ffffff" : "#000000"}
                  >
                    {error?.message}
                  </Text>
                </Box>
              );
            },
          });
        }
      } else {
        setIsLoading(false);

        toast.show({
          render: () => {
            return (
              <Box
                bg={currentTheme === "light" ? "#000000" : "#ffffff"}
                px={12}
                py={0.5}
                rounded="md"
                mb={5}
                borderWidth={1}
              >
                <Text color={currentTheme === "light" ? "#ffffff" : "#000000"}>
                  All Fields Must be Filled!
                </Text>
              </Box>
            );
          },
        });
      }
    } else {
      if (siteName && url && username && password) {
        try {
          const addPasswordRef = ref(database, `users/${user.uid}/passwords`);
          const newAddPasswordRef = push(addPasswordRef);

          await set(newAddPasswordRef, {
            siteName,
            url,
            username,
            password: Base64.encode(password),
            icon: "",
            id: newAddPasswordRef.key,
          });

          setSiteName("");
          setURL("");
          setUsername("");
          setPassword("");

          setIsLoading(false);

          // navigation.navigate("Keys");

          toast.show({
            render: () => {
              return (
                <Box
                  bg={currentTheme === "light" ? "#000000" : "#ffffff"}
                  px={12}
                  py={0.5}
                  rounded="md"
                  mb={5}
                  borderWidth={1}
                >
                  <Text
                    color={currentTheme === "light" ? "#ffffff" : "#000000"}
                  >
                    Password Saved Successfully
                  </Text>
                </Box>
              );
            },
          });
        } catch (error) {
          // console.error("add password screen error", error);
          setIsLoading(false);

          toast.show({
            render: () => {
              return (
                <Box
                  bg={currentTheme === "light" ? "#000000" : "#ffffff"}
                  px={12}
                  py={0.5}
                  rounded="md"
                  mb={5}
                  borderWidth={1}
                >
                  <Text
                    color={currentTheme === "light" ? "#ffffff" : "#000000"}
                  >
                    {error?.message}
                  </Text>
                </Box>
              );
            },
          });
        }
      } else {
        setIsLoading(false);

        toast.show({
          render: () => {
            return (
              <Box
                bg={currentTheme === "light" ? "#000000" : "#ffffff"}
                px={12}
                py={0.5}
                rounded="md"
                mb={5}
                borderWidth={1}
              >
                <Text color={currentTheme === "light" ? "#ffffff" : "#000000"}>
                  All Fields Must be Filled!
                </Text>
              </Box>
            );
          },
        });
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="auto" />

      {isLoading ? (
        <AppLoader />
      ) : (
        <>
          <Box m={5}>
            <Box>
              <Text textTransform="capitalize" fontSize={16} color={theme.text}>
                site name
              </Text>
              <Input
                borderWidth={0}
                borderRadius={6}
                bgColor="#D9D9D9BF"
                py={4}
                fontSize={16}
                // value={item.siteName ? item.siteName : siteName}
                value={siteName}
                onChangeText={setSiteName}
                placeholder="Enter site name"
              />
            </Box>
            <Box mt={2}>
              <Text textTransform="uppercase" fontSize={16} color={theme.text}>
                URL
              </Text>
              <Input
                borderWidth={0}
                borderRadius={6}
                bgColor="#D9D9D9BF"
                py={4}
                fontSize={16}
                // value={item.url ? item.url : url}
                value={url}
                onChangeText={setURL}
                placeholder="Enter URL"
              />
            </Box>
            <Box mt={2}>
              <Text textTransform="capitalize" fontSize={16} color={theme.text}>
                username/login
              </Text>
              <Input
                borderWidth={0}
                borderRadius={6}
                bgColor="#D9D9D9BF"
                py={4}
                fontSize={16}
                // value={item.username ? item.username : username}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username/login"
              />
            </Box>
            <Box mt={2}>
              <Text textTransform="capitalize" fontSize={16} color={theme.text}>
                password
              </Text>
              <Box flexDirection="row" alignItems="center" borderRadius={6}>
                <Input
                  type={showPassword ? "text" : "password"}
                  borderWidth={0}
                  bgColor="#D9D9D9BF"
                  py={4}
                  borderRadius={6}
                  fontSize={16}
                  // value={item.password ? item.password : password}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                />
                <Button
                  variant="unstyled"
                  h="full"
                  px={2}
                  onPress={() => setShowPassword(!showPassword)}
                  borderTopLeftRadius={0}
                  borderTopRightRadius={6}
                  borderBottomLeftRadius={0}
                  borderBottomRightRadius={6}
                  position={"absolute"}
                  right={5}
                  zIndex={11}
                >
                  {showPassword && (
                    <Image
                      source={require("./../assets/images/hidden.png")}
                      alt="Hidden"
                      size={4}
                    />
                  )}
                  {!showPassword && (
                    <Image
                      source={require("./../assets/images/eye.png")}
                      alt="Eye"
                      size={4}
                    />
                  )}
                </Button>
              </Box>
            </Box>
            <Text mt={4} color={theme.text}>
              Use complex passwords of great length, consisting of various
              symbols, numbers and letters. Do not use the same password on a
              large number of sites.
            </Text>
            <Button
              py={4}
              bgColor="#3B9966"
              mt={10}
              borderRadius={6}
              onPress={() => {
                onOpen();
                handleGeneratePassword();
              }}
            >
              <Text fontWeight="bold" color="#ffffff">
                Generate Password
              </Text>
            </Button>{" "}
            <Button
              py={4}
              borderRadius={6}
              m={0}
              onPress={() => handleSubmit()}
            >
              <Text fontWeight="bold" color="#ffffff">
                Save Password
              </Text>
            </Button>
          </Box>

          <Actionsheet isOpen={isOpen} onClose={() => handleCloseBottomSheet()}>
            {/* <BlurView
          style={{ flex: 1 }}
          intensity={120} // Adjust the intensity value as needed
          tint="dark" // Choose the tint color for the blur effect
        > */}
            <Actionsheet.Content bgColor={theme.background}>
              <Box w="100%" mt={6} px={4}>
                <Text mx={1} color={theme.text}>
                  Select at least one option
                </Text>
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  my={2}
                  px={4}
                  py={1}
                  bgColor="#D9D9D9"
                  borderRadius={12}
                >
                  <Text fontSize={14}>Numbers (0-9)</Text>
                  <Switch
                    size="md"
                    onTrackColor="#0E660C"
                    offTrackColor="#730000"
                    defaultIsChecked
                    // disabled
                    // value={isIncludeNumbersEnabled}
                    onChange={() => {
                      setIsIncludeNumbersEnabled(!isIncludeNumbersEnabled);
                    }}
                  />
                </Box>
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  my={2}
                  px={4}
                  py={1}
                  bgColor="#D9D9D9"
                  borderRadius={12}
                >
                  <Text fontSize={14}>Uppercase letters(A-Z)</Text>
                  <Switch
                    size="md"
                    onTrackColor="#0E660C"
                    offTrackColor="#730000"
                    // defaultIsChecked
                    // value={isIncludeUppercaseEnabled}
                    onChange={() => {
                      setIsIncludeUppercaseEnabled(!isIncludeUppercaseEnabled);
                    }}
                  />
                </Box>
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  my={2}
                  px={4}
                  py={1}
                  bgColor="#D9D9D9"
                  borderRadius={12}
                >
                  <Text fontSize={14}>Lowercase letters(a-z)</Text>
                  <Switch
                    size="md"
                    onTrackColor="#0E660C"
                    offTrackColor="#730000"
                    // defaultIsChecked
                    // value={isIncludeLowercaseEnabled}
                    onChange={() => {
                      setIsIncludeLowercaseEnabled(!isIncludeLowercaseEnabled);
                    }}
                  />
                </Box>
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  my={2}
                  px={4}
                  py={1}
                  bgColor="#D9D9D9"
                  borderRadius={12}
                >
                  <Text fontSize={14}>Include symbols($%*)</Text>
                  <Switch
                    size="md"
                    onTrackColor="#0E660C"
                    offTrackColor="#730000"
                    // value={isIncludeSymbolsEnabled}
                    onChange={() => {
                      setIsIncludeSymbolsEnabled(!isIncludeSymbolsEnabled);
                    }}
                  />
                </Box>
                <Box my={2} px={2} borderRadius={12}>
                  <Text fontSize={14} color={theme.text}>
                    Password Length: {passwordLength}
                  </Text>
                  <Box
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    my={2}
                  >
                    <Text color={theme.text}>8</Text>
                    <Slider
                      w={64}
                      height={0.5}
                      maxW={300}
                      defaultValue={10}
                      minValue={8}
                      maxValue={20}
                      accessibilityLabel="hello world"
                      step={2}
                      mx={2}
                      value={passwordLength}
                      onChange={(value) => {
                        setPasswordLength(value);
                      }}
                    >
                      <Slider.Track bgColor="#0891B2">
                        <Slider.FilledTrack />
                      </Slider.Track>
                      <Slider.Thumb bgColor="#ffffff" shadow={4} />
                    </Slider>
                    <Text color={theme.text}>20</Text>
                  </Box>
                </Box>
                <Box
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  bgColor="#0891B2"
                  p={4}
                  borderRadius={10}
                  mb={16}
                >
                  <Text
                    color="#ffffff"
                    fontSize={16}
                    textAlign="center"
                    fontWeight="bold"
                  >
                    {generatedPassword}
                  </Text>
                  <Button p={0} mx={4}>
                    <Image
                      source={require("./../assets/images/copy.png")}
                      alt="Copy"
                      size={4}
                      tintColor="#ffffff"
                    />
                  </Button>
                  <Button
                    p={0}
                    mr={-10}
                    onPress={() => handleGeneratePassword()}
                  >
                    <Image
                      source={require("./../assets/images/fast-forward.png")}
                      alt="Fast Forward"
                      size={4}
                      tintColor="#ffffff"
                    />
                  </Button>
                </Box>
              </Box>
            </Actionsheet.Content>
            {/* </BlurView> */}
          </Actionsheet>
        </>
      )}
    </SafeAreaView>
  );
};
