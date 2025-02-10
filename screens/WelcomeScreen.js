import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Box, Flex, Image, Text } from "native-base";
import { useContext } from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext, darkTheme, lightTheme } from "./../utils";

export const WelcomeScreen = () => {
  const navigation = useNavigation();

  const { currentTheme } = useContext(ThemeContext);

  const theme = currentTheme === "light" ? lightTheme : darkTheme;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="auto" />
      <Flex>
        <Box h="50%" mx={4} py={8}>
          <Image
            w="full"
            source={require("./../assets/images/welcome.png")}
            alt="Welcome"
            borderRadius={10}
          />
        </Box>
        <Box h="50%">
          <Flex flexDirection="row" justifyContent="center" alignItems="center">
            <Text color="#166079" fontSize={24} fontWeight="bold">
              vault
            </Text>
            <Text
              color={currentTheme === "light" ? "#474A48" : "#ffffff"}
              fontSize={24}
              fontWeight="bold"
            >
              pocket
            </Text>
          </Flex>
          <Flex
            h="60%"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={{
                backgroundColor: "#166079",
                borderRadius: 7,
                paddingHorizontal: "11%",
                paddingVertical: 10,
                marginRight: 8,
              }}
            >
              <Text style={{ color: "#ffffff" }}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              style={{
                backgroundColor: "#474A48",
                borderRadius: 7,
                paddingHorizontal: "11%",
                paddingVertical: 10,
                marginLeft: 8,
              }}
            >
              <Text style={{ color: "#ffffff" }}>Register</Text>
            </TouchableOpacity>
          </Flex>
        </Box>
      </Flex>
    </SafeAreaView>
  );
};
