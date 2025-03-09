import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Box, Button, Icon, Input, Text, useToast, VStack, HStack, Pressable, IconButton, Image, Heading } from "native-base";
import { useCallback, useContext, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext, darkTheme, lightTheme } from "./../utils";
import { signIn } from "./../utils/handlers";

export const LoginScreen = () => {
  const { currentTheme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const theme = useMemo(() => currentTheme === "light" ? lightTheme : darkTheme, [currentTheme]);

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.show({
        title: "Error",
        description: "Please fill in all fields",
        status: "error"
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await signIn(email, password);
      if (res.user) {
        setEmail("");
        setPassword("");
        toast.show({
          title: "Success",
          description: "Welcome back!",
          status: "success"
        });
      }
    } catch (error) {
      toast.show({
        title: "Error",
        description: error?.message || "Login failed",
        status: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={currentTheme === "light" ? "dark" : "light"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Box flex={1} p={6} justifyContent="center">
          <VStack space={8} alignItems="center">
            <Image
              source={require('../assets/images/user.png')}
              alt="VaultPocket Logo"
              size="xl"
              resizeMode="contain"
            />
            
            <VStack space={2} alignItems="center">
              <Heading size="xl" color={theme.textColor}>
                Welcome Back
              </Heading>
              <Text fontSize="md" color={theme.textSecondary}>
                Sign in to access your passwords
              </Text>
            </VStack>

            <VStack space={4} w="100%">
              <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
                size="lg"
                bg={theme.cardBackground}
                color={theme.textColor}
                borderColor={theme.borderColor}
                _focus={{
                  borderColor: theme.primary,
                  bg: theme.cardBackground
                }}
                InputLeftElement={
                  <Icon
                    as={Ionicons}
                    name="mail-outline"
                    size={5}
                    ml={2}
                    color={theme.textSecondary}
                  />
                }
              />

              <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                type={showPassword ? "text" : "password"}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                size="lg"
                bg={theme.cardBackground}
                color={theme.textColor}
                borderColor={theme.borderColor}
                _focus={{
                  borderColor: theme.primary,
                  bg: theme.cardBackground
                }}
                InputLeftElement={
                  <Icon
                    as={Ionicons}
                    name="lock-closed-outline"
                    size={5}
                    ml={2}
                    color={theme.textSecondary}
                  />
                }
                InputRightElement={
                  <IconButton
                    variant="ghost"
                    onPress={() => setShowPassword(!showPassword)}
                    icon={
                      <Icon
                        as={Ionicons}
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={5}
                        color={theme.textSecondary}
                      />
                    }
                  />
                }
              />

              <Button
                size="lg"
                bg={theme.primary}
                _pressed={{ bg: theme.primaryDark }}
                isLoading={isLoading}
                onPress={handleSubmit}
              >
                Sign In
              </Button>
            </VStack>

            <HStack space={1}>
              <Text color={theme.textSecondary}>
                Don't have an account?
              </Text>
              <Pressable onPress={() => navigation.navigate("Register")}>
                <Text color={theme.primary} fontWeight="bold">
                  Sign Up
                </Text>
              </Pressable>
            </HStack>

            <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
              <Text color={theme.primary} fontWeight="bold">
                Forgot Password?
              </Text>
            </Pressable>
          </VStack>
        </Box>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
