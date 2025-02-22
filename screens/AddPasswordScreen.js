import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { doc, collection, addDoc, updateDoc } from "firebase/firestore";
import { Box, Button, Icon, Input, Slider, Switch, Text, useToast, VStack, HStack, IconButton, Modal, ScrollView, Pressable } from "native-base";
import { useCallback, useContext, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Clipboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { AppLoader } from "./../components";
import { auth, db } from "./../services/firebase";
import { ThemeContext, darkTheme, lightTheme } from "./../utils";
import { encryptData, decryptData, generateEncryptionKey } from "./../utils/encryption";
import { generatePassword } from "./../utils/handlers";

export const AddPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const toast = useToast();
  const { currentTheme } = useContext(ThemeContext);
  const theme = currentTheme === "light" ? lightTheme : darkTheme;

  const [isLoading, setIsLoading] = useState(false);
  const [siteName, setSiteName] = useState("");
  const [url, setURL] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  // Password generator options
  const [passwordLength, setPasswordLength] = useState(16);
  const [isIncludeNumbersEnabled, setIsIncludeNumbersEnabled] = useState(true);
  const [isIncludeUppercaseEnabled, setIsIncludeUppercaseEnabled] = useState(true);
  const [isIncludeLowercaseEnabled, setIsIncludeLowercaseEnabled] = useState(true);
  const [isIncludeSymbolsEnabled, setIsIncludeSymbolsEnabled] = useState(true);

  const currentUser = auth.currentUser;
  const encryptionKey = generateEncryptionKey(currentUser?.uid);

  useEffect(() => {
    const item = route.params?.item;
    if (item && isFocused) {
      setSiteName(item.siteName || "");
      setURL(item.url || "");
      setUsername(item.username || "");
      try {
        const decryptedPassword = item.password ? decryptData(item.password, encryptionKey) : "";
        setPassword(decryptedPassword);
      } catch (error) {
        console.error("Error decrypting password:", error);
        setPassword("");
      }
    } else if (!item && isFocused) {
      // Reset fields when entering the screen for a new password
      resetFields();
    }
  }, [route.params, encryptionKey]);

  const resetFields = () => {
    setSiteName("");
    setURL("");
    setUsername("");
    setPassword("");
    setShowPassword(false);
    // Reset password generator options to defaults
    setPasswordLength(16);
    setIsIncludeNumbersEnabled(true);
    setIsIncludeUppercaseEnabled(true);
    setIsIncludeLowercaseEnabled(true);
    setIsIncludeSymbolsEnabled(true);
  };

  const handleGeneratePassword = useCallback(async () => {
    const newPassword = generatePassword({
      length: passwordLength,
      numbers: isIncludeNumbersEnabled,
      uppercase: isIncludeUppercaseEnabled,
      lowercase: isIncludeLowercaseEnabled,
      symbols: isIncludeSymbolsEnabled,
    });
    
    setPassword(newPassword);
    setShowGenerator(false);
    
    try {
      await Clipboard.setString(newPassword);
      toast.show({
        title: "Success",
        description: "New password copied to clipboard",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  }, [passwordLength, isIncludeNumbersEnabled, isIncludeUppercaseEnabled, isIncludeLowercaseEnabled, isIncludeSymbolsEnabled]);

  const handleSave = async () => {
    if (!siteName || !username || !password) {
      toast.show({
        title: "Required Fields",
        description: "Please fill in all required fields",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    try {
      setIsLoading(true);
      const passwordData = {
        siteName,
        username,
        password: encryptData(password, encryptionKey),
        url: url || '',
        updatedAt: new Date(),
        userId: currentUser.uid,
      };

      if (route.params?.item) {
        const passwordRef = doc(db, 'users', currentUser.uid, 'passwords', route.params.item.id);
        await updateDoc(passwordRef, passwordData);
        toast.show({
          title: "Success",
          description: "Password updated successfully",
          status: "success",
          duration: 2000,
        });
        // Clear the route params before navigating back
        navigation.setParams({ item: null });
        navigation.goBack();
      } else {
        const passwordsRef = collection(db, 'users', currentUser.uid, 'passwords');
        await addDoc(passwordsRef, {
          ...passwordData,
          createdAt: new Date(),
        });
        toast.show({
          title: "Success",
          description: "Password saved successfully",
          status: "success",
          duration: 2000,
        });
        resetFields();
      }
    } catch (error) {
      console.error("Error saving password:", error);
      toast.show({
        title: "Error",
        description: "Failed to save password",
        status: "error",
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <AppLoader />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={currentTheme === "light" ? "dark" : "light"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <VStack space={4} p={4}>
            <HStack justifyContent="space-between" alignItems="center" mb={2}>
              <Text fontSize="2xl" bold color={theme.text}>
                {route.params?.item ? "Edit Password" : "Add New Password"}
              </Text>
              <IconButton
                icon={<Icon as={Ionicons} name="close" />}
                onPress={() => navigation.goBack()}
                variant="ghost"
                _icon={{ color: theme.textSecondary }}
              />
            </HStack>

            <VStack space={4}>
              <Input
                placeholder="Site Name *"
                value={siteName}
                onChangeText={setSiteName}
                size="lg"
                color={theme.text}
                bg={theme.inputBg}
                borderColor={theme.inputBorder}
                _focus={{
                  borderColor: theme.inputFocusBorder,
                  bg: theme.inputFocusBg,
                }}
                InputLeftElement={
                  <Icon as={Ionicons} name="globe-outline" size={5} ml={2} color={theme.textSecondary} />
                }
              />

              <Input
                placeholder="URL (optional)"
                value={url}
                onChangeText={setURL}
                size="lg"
                color={theme.text}
                bg={theme.inputBg}
                borderColor={theme.inputBorder}
                _focus={{
                  borderColor: theme.inputFocusBorder,
                  bg: theme.inputFocusBg,
                }}
                InputLeftElement={
                  <Icon as={Ionicons} name="link-outline" size={5} ml={2} color={theme.textSecondary} />
                }
              />

              <Input
                placeholder="Username *"
                value={username}
                onChangeText={setUsername}
                size="lg"
                color={theme.text}
                bg={theme.inputBg}
                borderColor={theme.inputBorder}
                _focus={{
                  borderColor: theme.inputFocusBorder,
                  bg: theme.inputFocusBg,
                }}
                InputLeftElement={
                  <Icon as={Ionicons} name="person-outline" size={5} ml={2} color={theme.textSecondary} />
                }
              />

              <Input
                placeholder="Password *"
                value={password}
                onChangeText={setPassword}
                type={showPassword ? "text" : "password"}
                size="lg"
                color={theme.text}
                bg={theme.inputBg}
                borderColor={theme.inputBorder}
                _focus={{
                  borderColor: theme.inputFocusBorder,
                  bg: theme.inputFocusBg,
                }}
                InputLeftElement={
                  <Icon as={Ionicons} name="lock-closed-outline" size={5} ml={2} color={theme.textSecondary} />
                }
                InputRightElement={
                  <HStack space={2} mr={2}>
                    <IconButton
                      icon={<Icon as={Ionicons} name={showPassword ? "eye-off-outline" : "eye-outline"} />}
                      onPress={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      _icon={{ color: theme.textSecondary }}
                    />
                    <IconButton
                      icon={<Icon as={Ionicons} name="refresh-outline" />}
                      onPress={() => setShowGenerator(true)}
                      variant="ghost"
                      _icon={{ color: theme.textSecondary }}
                    />
                  </HStack>
                }
              />
            </VStack>

            <Button
              onPress={handleSave}
              size="lg"
              bg={theme.primary}
              _pressed={{ bg: theme.primaryDark }}
              _text={{ color: theme.buttonText, fontWeight: "600" }}
              leftIcon={<Icon as={Ionicons} name="save-outline" color={theme.buttonText} />}
              mt={4}
            >
              {route.params?.item ? "Update Password" : "Save Password"}
            </Button>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal isOpen={showGenerator} onClose={() => setShowGenerator(false)} size="lg">
        <Modal.Content maxWidth="400px" bg={theme.modalBg}>
          <Modal.CloseButton _icon={{ color: theme.text }} />
          <Modal.Header bg={theme.modalBg} borderColor={theme.border}>
            <Text color={theme.text} fontSize="lg" bold>Password Generator</Text>
          </Modal.Header>
          <Modal.Body>
            <VStack space={4}>
              <Box bg={theme.primaryBg} p={4} rounded="md">
                <Text color={theme.text} fontSize="md" textAlign="center" fontFamily="monospace">
                  {password || "Generated password will appear here"}
                </Text>
              </Box>

              <VStack space={4}>
                <VStack space={2}>
                  <Text color={theme.text}>Length: {passwordLength}</Text>
                  <Slider
                    defaultValue={passwordLength}
                    onChange={(v) => setPasswordLength(Math.floor(v))}
                    minValue={8}
                    maxValue={32}
                    step={1}
                    size="lg"
                  >
                    <Slider.Track bg={theme.sliderTrack}>
                      <Slider.FilledTrack bg={theme.primary} />
                    </Slider.Track>
                    <Slider.Thumb bg={theme.primary} />
                  </Slider>
                </VStack>

                <HStack justifyContent="space-between" alignItems="center">
                  <Text color={theme.text}>Include Numbers</Text>
                  <Switch
                    isChecked={isIncludeNumbersEnabled}
                    onToggle={() => setIsIncludeNumbersEnabled(!isIncludeNumbersEnabled)}
                    onTrackColor={theme.primary}
                  />
                </HStack>

                <HStack justifyContent="space-between" alignItems="center">
                  <Text color={theme.text}>Include Uppercase</Text>
                  <Switch
                    isChecked={isIncludeUppercaseEnabled}
                    onToggle={() => setIsIncludeUppercaseEnabled(!isIncludeUppercaseEnabled)}
                    onTrackColor={theme.primary}
                  />
                </HStack>

                <HStack justifyContent="space-between" alignItems="center">
                  <Text color={theme.text}>Include Lowercase</Text>
                  <Switch
                    isChecked={isIncludeLowercaseEnabled}
                    onToggle={() => setIsIncludeLowercaseEnabled(!isIncludeLowercaseEnabled)}
                    onTrackColor={theme.primary}
                  />
                </HStack>

                <HStack justifyContent="space-between" alignItems="center">
                  <Text color={theme.text}>Include Symbols</Text>
                  <Switch
                    isChecked={isIncludeSymbolsEnabled}
                    onToggle={() => setIsIncludeSymbolsEnabled(!isIncludeSymbolsEnabled)}
                    onTrackColor={theme.primary}
                  />
                </HStack>
              </VStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer bg={theme.modalBg} borderColor={theme.border}>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                onPress={() => setShowGenerator(false)}
                _text={{ color: theme.text }}
              >
                Cancel
              </Button>
              <Button
                bg={theme.primary}
                _pressed={{ bg: theme.primaryDark }}
                onPress={handleGeneratePassword}
                leftIcon={<Icon as={Ionicons} name="refresh-outline" />}
                _text={{ color: theme.buttonText }}
              >
                Generate
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </SafeAreaView>
  );
};
