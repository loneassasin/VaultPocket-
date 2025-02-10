import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Box, Button, Flex, Image, Input, Text, useToast } from "native-base";
import { useContext, useState } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext, darkTheme, lightTheme } from "./../utils";
import { signIn } from "./../utils/handlers";

export const LoginScreen = () => {
  const { currentTheme } = useContext(ThemeContext);

  const navigation = useNavigation();

  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [load, setLoad] = useState(false);

  const theme = currentTheme === "light" ? lightTheme : darkTheme;

  const handleSubmit = async () => {
    if (email && password) {
      setLoad(true);
      try {
        const res = await signIn(email, password);
        if (res.user) {
          setEmail("");
          setPassword("");
          setLoad(false);
        }
      } catch (error) {
        if (error) {
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
          Hey, hello👋
        </Text>
        <Text color="#A9A9A9" fontSize={16} mt={2} mb={4}>
          Enter your login information
        </Text>
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
        <Box flexDirection="row" alignItems="center" borderRadius={6} mb={1}>
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
        <Button
          variant="link"
          p={0}
          mb={4}
          alignSelf="flex-end"
          borderRadius={6}
          onPress={() => navigation.navigate("Tab")}
        >
          <Text
            fontSize={10}
            fontWeight="bold"
            color={currentTheme === "light" ? "#1E3D59" : "#ffffff"}
          >
            Forgot Master Password
          </Text>
        </Button>
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
            Login
          </Button>
        )}

        <Flex flexDirection="row" mt={4}>
          <Text fontSize={20} color={theme.text}>
            Don't have an account?{" "}
          </Text>
          <Button
            variant="link"
            p={0}
            m={0}
            color="#166079"
            onPress={() => navigation.navigate("Register")}
          >
            <Text fontSize="lg" fontWeight="bold" color={theme.text}>
              Register
            </Text>
          </Button>
        </Flex>
      </Flex>
    </SafeAreaView>
  );
};
