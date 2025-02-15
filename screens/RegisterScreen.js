import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { doc, setDoc } from "firebase/firestore";
import { Box, Button, Flex, Input, Text, useToast } from "native-base";
import { useCallback, useContext, useState } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PasswordStrengthIndicator } from "./../components";
import { app, db } from "./../services/firebase";
import { ThemeContext, darkTheme, lightTheme } from "./../utils";
import { signUp } from "./../utils/handlers";

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

  const showToast = useCallback((message, type = "error") => {
    toast.show({
      render: () => (
        <Box
          bg={type === "success" ? "#0E660C" : "#730000"}
          px={4}
          py={2}
          rounded="md"
          mb={5}
        >
          <Text color="#ffffff">{message}</Text>
        </Box>
      ),
    });
  }, [toast]);

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      showToast("All Fields Must be Filled!");
      return;
    }

    setLoad(true);
    try {
      const res = await signUp(email, password);
      if (res.user) {
        const userDocRef = doc(db, 'users', res.user.uid);
        await setDoc(userDocRef, {
          email,
          name,
          id: res.user.uid,
          createdAt: new Date(),
        });

        setName("");
        setEmail("");
        setPassword("");
        showToast("Account Created Successfully", "success");
      }
    } catch (error) {
      showToast(error?.message || "Registration failed");
    } finally {
      setLoad(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="auto" />
      <Box flex={1} px={4} py={2} justifyContent="center">
        <Text fontSize={16} color={theme.text}>
          Create Account
        </Text>
        <Text color="#A9A9A9" fontSize={16} mt={2} mb={4}>
          Enter your information
        </Text>

        <Input
          placeholder="Name"
          mb={4}
          borderWidth={0}
          bgColor="#D9D9D9BF"
          py={4}
          fontSize={16}
          value={name}
          onChangeText={(text) => setName(text)}
          autoComplete="off"
          returnKeyType="next"
          _focus={{
            backgroundColor: "#D9D9D9BF",
            borderWidth: 0
          }}
        />

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

        <Box mb={4}>
          <Input
            placeholder="Master Password"
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
          <PasswordStrengthIndicator password={password} />
        </Box>

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
              Register
            </Text>
          )}
        </Button>

        <Flex flexDirection="row" justifyContent="center">
          <Text fontSize={16} color={theme.text}>
            Already have an account?{" "}
          </Text>
          <Button
            variant="link"
            p={0}
            m={0}
            onPress={() => navigation.navigate("Login")}
          >
            <Text fontSize={16} fontWeight="bold" color={theme.text}>
              Login
            </Text>
          </Button>
        </Flex>
      </Box>
    </SafeAreaView>
  );
};
