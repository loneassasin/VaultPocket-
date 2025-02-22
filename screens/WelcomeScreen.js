import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Box, Button, Icon, Text, VStack, HStack, Image, Heading, useTheme } from "native-base";
import { useContext, useMemo } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { ThemeContext, darkTheme, lightTheme } from "./../utils";

const { width } = Dimensions.get('window');

const AnimatedBox = Animated.createAnimatedComponent(Box);

export const WelcomeScreen = () => {
  const navigation = useNavigation();
  const { currentTheme } = useContext(ThemeContext);
  const theme = useMemo(() => currentTheme === "light" ? lightTheme : darkTheme, [currentTheme]);

  const features = [
    {
      icon: "lock-closed",
      title: "Secure Storage",
      description: "Your passwords are encrypted and stored securely"
    },
    {
      icon: "key",
      title: "Easy Access",
      description: "Quick and easy access to all your passwords"
    },
    {
      icon: "shield-checkmark",
      title: "Password Generator",
      description: "Generate strong, unique passwords"
    }
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={currentTheme === "light" ? "dark" : "light"} />
      <Box flex={1} px={6} py={4}>
        <VStack flex={1} space={8}>
          <AnimatedBox entering={FadeInDown.delay(200).duration(1000)}>
            <Image
              source={require("../assets/images/user.png")}
              alt="VaultPocket Logo"
              size="xl"
              resizeMode="contain"
              alignSelf="center"
            />
          </AnimatedBox>

          <AnimatedBox entering={FadeInDown.delay(400).duration(1000)}>
            <VStack space={2} alignItems="center">
              <HStack space={1} alignItems="center">
                <Heading size="2xl" color={theme.primary}>
                  Vault
                </Heading>
                <Heading size="2xl" color={theme.textColor}>
                  Pocket
                </Heading>
              </HStack>
              <Text fontSize="md" color={theme.textSecondary} textAlign="center">
                Your secure password manager
              </Text>
            </VStack>
          </AnimatedBox>

          <AnimatedBox entering={FadeInDown.delay(600).duration(1000)}>
            <Image
              source={require("./../assets/images/welcome.png")}
              alt="Welcome"
              width={width * 0.8}
              height={width * 0.6}
              resizeMode="contain"
              alignSelf="center"
            />
          </AnimatedBox>

          <AnimatedBox entering={FadeInDown.delay(800).duration(1000)}>
            <VStack space={4}>
              {features.map((feature, index) => (
                <HStack key={index} space={4} alignItems="center">
                  <Box
                    bg={theme.primary}
                    p={2}
                    rounded="lg"
                    opacity={0.9}
                  >
                    <Icon
                      as={Ionicons}
                      name={feature.icon}
                      size={6}
                      color="white"
                    />
                  </Box>
                  <VStack flex={1}>
                    <Text color={theme.textColor} bold fontSize="md">
                      {feature.title}
                    </Text>
                    <Text color={theme.textSecondary} fontSize="sm">
                      {feature.description}
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </AnimatedBox>

          <AnimatedBox entering={FadeInUp.delay(1000).duration(1000)}>
            <VStack space={4}>
              <Button
                size="lg"
                bg={theme.primary}
                _pressed={{ bg: theme.primaryDark }}
                onPress={() => navigation.navigate("Login")}
                leftIcon={<Icon as={Ionicons} name="log-in-outline" size="sm" />}
              >
                Sign In
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                borderColor={theme.primary}
                _pressed={{ bg: theme.cardBackground }}
                onPress={() => navigation.navigate("Register")}
                leftIcon={<Icon as={Ionicons} name="person-add-outline" size="sm" />}
              >
                <Text color={theme.primary}>Create Account</Text>
              </Button>
            </VStack>
          </AnimatedBox>
        </VStack>
      </Box>
    </SafeAreaView>
  );
};
