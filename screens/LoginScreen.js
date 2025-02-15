import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Box, Button, Flex, Image, Input, Text, useToast } from "native-base";
import { useCallback, useContext, useMemo, useState } from "react";
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

  const showToast = useCallback((message) => {
    toast.show({
      render: () => (
        <Box bg={theme.toastBg} px={4} py={2} rounded="md" mb={5}>
          <Text color={theme.toastText}>{message}</Text>
        </Box>
      ),
    });
  }, [toast, theme]);

  const handleSubmit = async () => {
    if (!email || !password) {
      showToast("All Fields Must be Filled!");
      return;
    }

    setLoad(true);
    try {
      const res = await signIn(email, password);
      if (res.user) {
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      showToast(error?.message || "Login failed");
    } finally {
      setLoad(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="auto" />
      <Box flex={1} px={4} py={2} justifyContent="center">
        <Text fontSize={16} color={theme.text} mb={2}>Hey, hello👋</Text>
        <Text color="#A9A9A9" fontSize={16} mb={4}>
          Enter your login information
        </Text>
        
        <Input
          placeholder="Email"
          mb={4}
          borderWidth={0}
          bgColor="#D9D9D9BF"
          py={4}
          fontSize={16}
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="off"
          returnKeyType="next"
          _focus={{
            backgroundColor: "#D9D9D9BF",
            borderWidth: 0
          }}
        />






<Input
          placeholder="Password"
          mb={4}
          borderWidth={0}
          bgColor="#D9D9D9BF"
          py={4}
          fontSize={16}
          value={password}
          onChangeText={(text) => setPassword(text)}
          type={showPassword ? "text" : "password"}
          autoComplete="off"
          returnKeyType="done"
          _focus={{
            backgroundColor: "#D9D9D9BF",
            borderWidth: 0
          }}
          InputRightElement={
            <Button
              size="xs"
              rounded="none"
              w="1/6"
              h="full"
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          }
        />
        <Button
          w="full"
          bgColor="#0E660C"
          py={4}
          borderRadius={6}
          onPress={handleSubmit}
          isDisabled={load}
          mb={4}
        >
          {load ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text fontWeight="bold" color="#ffffff">
              Login
            </Text>
          )}
        </Button>

        <Flex flexDirection="row" justifyContent="center">
          <Text fontSize={16} color={theme.text}>
            Don't have an account?{" "}
          </Text>
          <Button
            variant="link"
            p={0}
            m={0}
            onPress={() => navigation.navigate("Register")}
          >
            <Text fontSize={16} fontWeight="bold" color={theme.text}>
              Register
            </Text>
          </Button>
        </Flex>
      </Box>
    </SafeAreaView>
  );
};
