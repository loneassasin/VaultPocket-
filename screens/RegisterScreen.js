import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { getDatabase, ref, set } from "firebase/database";
import { Box, Button, Flex, Image, Input, Text, useToast } from "native-base";
import { useContext, useState } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PasswordStrengthIndicator } from "./../components";
import { app } from "./../services/firebase";
import { ThemeContext, darkTheme, lightTheme } from "./../utils";
import { signUp } from "./../utils/handlers";

const database = getDatabase(app);

export const RegisterScreen = () => {
  const { currentTheme } = useContext(ThemeContext);

  const navigation = useNavigation();

  const toast = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [load, setLoad] = useState(false);

  const theme = currentTheme === "light" ? lightTheme : darkTheme;

  const handleSubmit = async () => {
    if (name && email && password) {
      setLoad(true);
      try {
        const res = await signUp(email, password);

        if (res.user) {
          const userRef = ref(database, `users/${res.user.uid}`);
          set(userRef, {
            email,
            name,
            id: userRef.key,
          }).then(() => {
            setName("");
            setEmail("");
            setPassword("");
            setLoad(false);

            // navigation.navigate("Login");

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
                      Account Created Successfully
                    </Text>
                  </Box>
                );
              },
            });
          });
        }
      } catch (error) {
        setLoad(false);

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
                  {error?.message}
                </Text>
              </Box>
            );
          },
        });
      }
    } else {
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
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="auto" />
      <Flex
        h="full"
        w={64}
        mx="auto"
        justifyContent="center"
        alignItems="center"
      >
        <Text fontSize={16} color={theme.text}>
          Let's get started
        </Text>
        <Text color="#A9A9A9" fontSize={16} mt={2} mb={4}>
          Enter your register information
        </Text>
        <Input
          placeholder="Name"
          mb={4}
          borderWidth={0}
          borderBottomWidth={1}
          borderBottomColor={theme.text}
          borderRadius={0}
          color={theme.text}
          placeholderTextColor={theme.lightgrey}
          fontSize={16}
          value={name}
          onChangeText={setName}
        />
        <Input
          placeholder="Email"
          mb={4}
          borderWidth={0}
          borderBottomWidth={1}
          borderBottomColor={theme.text}
          borderRadius={0}
          color={theme.text}
          placeholderTextColor={theme.lightgrey}
          fontSize={16}
          value={email}
          onChangeText={setEmail}
        />
        <Box flexDirection="row" alignItems="center" borderRadius={6}>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Master Password"
            borderWidth={0}
            borderBottomWidth={1}
            borderBottomColor={theme.text}
            borderRadius={0}
            color={theme.text}
            placeholderTextColor={theme.lightgrey}
            fontSize={16}
            value={password}
            onChangeText={setPassword}
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
                tintColor={theme.text}
              />
            )}
            {!showPassword && (
              <Image
                source={require("./../assets/images/eye.png")}
                alt="Eye"
                size={4}
                tintColor={theme.text}
              />
            )}
          </Button>
        </Box>
        <PasswordStrengthIndicator password={password} />
        {load ? (
          <ActivityIndicator size={"small"} color={"black"} />
        ) : (
          <Button
            w="full"
            fontSize={20}
            fontWeight="bold"
            borderRadius={6}
            onPress={() => handleSubmit()}
          >
            Create account
          </Button>
        )}
        <Flex flexDirection="row" mt={4}>
          <Text fontSize={20} color={theme.text}>
            Already have an account?{" "}
          </Text>
          <Button
            variant="link"
            p={0}
            m={0}
            color="#166079"
            onPress={() => navigation.navigate("Login")}
          >
            <Text fontSize="lg" fontWeight="bold" color={theme.text}>
              Login
            </Text>
          </Button>
        </Flex>
      </Flex>
    </SafeAreaView>
  );
};
