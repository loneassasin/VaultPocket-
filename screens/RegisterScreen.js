import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { doc, setDoc } from "firebase/firestore";
import { Box, Button, Icon, Input, Text, useToast, VStack, HStack, Pressable, IconButton, Heading, Progress } from "native-base";
import { useCallback, useContext, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const theme = useMemo(() => currentTheme === "light" ? lightTheme : darkTheme, [currentTheme]);

  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  }, [password]);

  const getPasswordStrengthColor = useCallback((strength) => {
    if (strength <= 25) return "red.500";
    if (strength <= 50) return "orange.500";
    if (strength <= 75) return "yellow.500";
    return "green.500";
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!name || !email || !password || !confirmPassword) {
      toast.show({
        title: "Error",
        description: "Please fill in all fields",
        status: "error"
      });
      return;
    }

    if (!validateEmail(email)) {
      toast.show({
        title: "Error",
        description: "Please enter a valid email address",
        status: "error"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.show({
        title: "Error",
        description: "Passwords do not match",
        status: "error"
      });
      return;
    }

    if (passwordStrength < 75) {
      toast.show({
        title: "Error",
        description: "Please use a stronger password",
        status: "error"
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await signUp(email, password);
      if (res.user) {
        // Create user profile in Firestore
        await setDoc(doc(db, "users", res.user.uid), {
          name,
          email,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        
        toast.show({
          title: "Success",
          description: "Account created successfully!",
          status: "success"
        });
        
        navigation.replace("Login");
      }
    } catch (error) {
      toast.show({
        title: "Error",
        description: error?.message || "Registration failed",
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Box flex={1} p={6} justifyContent="center">
          <VStack space={8}>
            <VStack space={2}>
              <Heading size="xl" color={theme.textColor}>
                Create Account
              </Heading>
              <Text fontSize="md" color={theme.textSecondary}>
                Sign up to secure your passwords
              </Text>
            </VStack>

            <VStack space={4}>
              <Input
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
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
                    name="person-outline"
                    size={5}
                    ml={2}
                    color={theme.textSecondary}
                  />
                }
              />

              <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
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

              <VStack space={2}>
                <Input
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  type={showPassword ? "text" : "password"}
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
                {password && (
                  <VStack space={1}>
                    <Progress
                      value={passwordStrength}
                      size="xs"
                      colorScheme={getPasswordStrengthColor(passwordStrength)}
                    />
                    <Text fontSize="xs" color={theme.textSecondary}>
                      Password strength: {passwordStrength <= 25 ? "Weak" : 
                        passwordStrength <= 50 ? "Fair" :
                        passwordStrength <= 75 ? "Good" : "Strong"}
                    </Text>
                  </VStack>
                )}
              </VStack>

              <Input
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                type={showConfirmPassword ? "text" : "password"}
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
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    icon={
                      <Icon
                        as={Ionicons}
                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
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
                Create Account
              </Button>
            </VStack>

            <HStack space={1} justifyContent="center">
              <Text color={theme.textSecondary}>
                Already have an account?
              </Text>
              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text color={theme.primary} fontWeight="bold">
                  Sign In
                </Text>
              </Pressable>
            </HStack>
          </VStack>
        </Box>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
