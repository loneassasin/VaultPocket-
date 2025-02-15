import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { doc, collection, addDoc, updateDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
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
import { useCallback, useContext, useEffect, useState, useMemo } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppLoader } from "./../components";
import { auth, db } from "./../services/firebase";
import {
  ThemeContext,
  darkTheme,
  encryptedPassword,
  generatePassword,
  lightTheme,
} from "./../utils";

//const db = getFirestore(app);

export const AddPasswordScreen = () => {
  const { isOpen, onOpen, onClose } = useDisclose();
  const { currentTheme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [siteName, setSiteName] = useState("");
  const [url, setURL] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isIncludeNumbersEnabled, setIsIncludeNumbersEnabled] = useState(true);
  const [isIncludeUppercaseEnabled, setIsIncludeUppercaseEnabled] = useState(false);
  const [isIncludeLowercaseEnabled, setIsIncludeLowercaseEnabled] = useState(false);
  const [isIncludeSymbolsEnabled, setIsIncludeSymbolsEnabled] = useState(false);
  const [passwordLength, setPasswordLength] = useState(12);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const theme = currentTheme === "light" ? lightTheme : darkTheme;

  // Memoize password options to prevent unnecessary re-renders
  const passwordOptions = useMemo(() => ({
    length: passwordLength,
    numbers: isIncludeNumbersEnabled,
    uppercase: isIncludeUppercaseEnabled,
    lowercase: isIncludeLowercaseEnabled,
    symbols: isIncludeSymbolsEnabled
  }), [
    passwordLength,
    isIncludeNumbersEnabled,
    isIncludeUppercaseEnabled,
    isIncludeLowercaseEnabled,
    isIncludeSymbolsEnabled
  ]);

  // Debounced password generation
  const handleGeneratePassword = useCallback(() => {
    const newPassword = generatePassword(passwordOptions);
    setGeneratedPassword(newPassword);
  }, [passwordOptions]);

  // Load existing password data
  useEffect(() => {
    if (!isFocused) return;

    const item = route?.params?.item;
    if (item) {
      setSiteName(item.siteName || "");
      setURL(item.url || "");
      setUsername(item.username || "");
      setPassword(item.password ? Base64.decode(item.password) : "");
    }
  }, [isFocused]);

  // Generate password when options change
  useEffect(() => {
    const timeoutId = setTimeout(handleGeneratePassword, 300);
    return () => clearTimeout(timeoutId);
  }, [handleGeneratePassword]);

  const handleSavePassword = async () => {
    if (!siteName || !username || !password) {
      toast.show({
        render: () => (
          <Box bg="#730000" px={4} py={2} rounded="md" mb={5}>
            <Text color="#ffffff">All Fields Must be Filled!</Text>
          </Box>
        ),
      });
      return;
    }

    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        navigation.replace('Login');
        return;
      }

      const passwordData = {
        siteName,
        username,
        password: Base64.encode(password),
        url: url || '',
        updatedAt: new Date(),
      };

      if (route.params?.item) {
        // Update existing password
        const passwordRef = doc(db, 'users', user.uid, 'passwords', route.params.item.id);
        await updateDoc(passwordRef, passwordData);
      } else {
        // Add new password
        const passwordsRef = collection(db, 'users', user.uid, 'passwords');
        await addDoc(passwordsRef, {
          ...passwordData,
          createdAt: new Date(),
        });
      }

      setSiteName("");
      setURL("");
      setUsername("");
      setPassword("");
      
      toast.show({
        render: () => (
          <Box bg="#0E660C" px={4} py={2} rounded="md" mb={5}>
            <Text color="#ffffff">
              {route.params?.item ? "Password Updated Successfully" : "Password Added Successfully"}
            </Text>
          </Box>
        ),
      });
      
      navigation.goBack();
    } catch (error) {
      console.error("Error saving password:", error);
      toast.show({
        render: () => (
          <Box bg="#730000" px={4} py={2} rounded="md" mb={5}>
            <Text color="#ffffff">{error.message || "Error saving password"}</Text>
          </Box>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseBottomSheet = () => {
    // Set the generated password on the password input
    setPassword(generatedPassword);
    onClose();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="auto" />
      {isLoading ? (
        <AppLoader />
      ) : (
        <Box flex={1} px={4} py={2}>
          <Box mb={4}>
            <Text mx={1} color={theme.text}>
              Site Name
            </Text>
            <Input
              borderWidth={0}
              bgColor="#D9D9D9BF"
              py={4}
              fontSize={16}
              value={siteName}
              onChangeText={(text) => setSiteName(text)}
              placeholder="Enter site name"
              placeholderTextColor={theme.lightgrey}
              _focus={{
                backgroundColor: "#D9D9D9BF",
                borderWidth: 0
              }}
              autoComplete="off"
              returnKeyType="next"
            />
          </Box>

          <Box mb={4}>
            <Text mx={1} color={theme.text}>
              URL
            </Text>
            <Input
              borderWidth={0}
              bgColor="#D9D9D9BF"
              py={4}
              fontSize={16}
              value={url}
              onChangeText={(text) => setURL(text)}
              placeholder="Enter URL"
              placeholderTextColor={theme.lightgrey}
              _focus={{
                backgroundColor: "#D9D9D9BF",
                borderWidth: 0
              }}
              autoComplete="off"
              returnKeyType="next"
              keyboardType="url"
            />
          </Box>

          <Box mb={4}>
            <Text mx={1} color={theme.text}>
              Username/Login
            </Text>
            <Input
              borderWidth={0}
              bgColor="#D9D9D9BF"
              py={4}
              fontSize={16}
              value={username}
              onChangeText={(text) => setUsername(text)}
              placeholder="Enter username/login"
              placeholderTextColor={theme.lightgrey}
              _focus={{
                backgroundColor: "#D9D9D9BF",
                borderWidth: 0
              }}
              autoComplete="off"
              returnKeyType="next"
            />
          </Box>

          <Box mb={4}>
            <Text mx={1} color={theme.text}>
              Password
            </Text>
            <Box flexDirection="row" alignItems="center">
              <Input
                flex={1}
                borderWidth={0}
                bgColor="#D9D9D9BF"
                py={4}
                borderRadius={6}
                fontSize={16}
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholder="Enter password"
                placeholderTextColor={theme.lightgrey}
                type={showPassword ? "text" : "password"}
                _focus={{
                  backgroundColor: "#D9D9D9BF",
                  borderWidth: 0
                }}
                autoComplete="off"
                returnKeyType="done"
              />
              <Button
                variant="unstyled"
                h="full"
                px={2}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </Box>
          </Box>

          <Button
            w="full"
            bgColor="#0E660C"
            py={4}
            borderRadius={6}
            onPress={handleSavePassword}
            isDisabled={isLoading}
          >
            <Text fontWeight="bold" color="#ffffff">
              Save Password
            </Text>
          </Button>
        </Box>
      )}
      <Actionsheet isOpen={isOpen} onClose={() => handleCloseBottomSheet()}>
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
      </Actionsheet>
    </SafeAreaView>
  );
};
