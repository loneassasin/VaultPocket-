import { useRoute } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { Base64 } from "js-base64";
import {
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Menu,
  Pressable,
  Text,
  View,
  useToast,
} from "native-base";
import { useContext, useState } from "react";
import { ThemeContext, darkTheme, lightTheme } from "./../utils";

export const List = ({ item, setIsCopy, editPassword, deletePassword }) => {
  const route = useRoute();

  const toast = useToast();

  const { currentTheme } = useContext(ThemeContext);

  const [showPassword, setShowPassword] = useState(false);

  const theme = currentTheme === "light" ? lightTheme : darkTheme;

  const copyToClipboard = async (text) => {
    await Clipboard.setString(text);
    // Optionally, you can show a toast or perform any other action after copying
    console.log("Text copied to clipboard:", text);
  };

  return (
    <Flex
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      h={16}
      mt={1.5}
      mb={2.5}
      px={1}
      bgColor="#D9D9D9"
      borderRadius={12}
    >
      <Box
        h={12}
        justifyContent="center"
        paddingX={1.5}
        paddingY={1.5}
        bgColor="white"
        borderRadius="full"
      >
        <Image
          source={require("./../assets/images/user.png")}
          alt="User"
          w={8}
          h={8}
        />
      </Box>
      <Box
        w={route.name === "Keys" ? "3/5" : "4/6"}
        h="full"
        m={2}
        justifyContent="center"
      >
        <Text fontSize="sm" fontWeight="bold" textTransform="capitalize">
          {item.siteName}
        </Text>
        <Text fontSize="xs">{item.username}</Text>
        <Flex flexDirection="row" alignItems="center">
          <Text fontSize="xs">
            {showPassword ? Base64.decode(item.password) : "*********"}
          </Text>
          <Button
            variant="unstyled"
            p={0}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword && (
              <Image
                source={require("./../assets/images/hidden.png")}
                alt="Hidden"
                w={3}
                h={3}
                mx={1}
              />
            )}
            {!showPassword && (
              <Image
                source={require("./../assets/images/eye.png")}
                alt="Eye"
                w={3}
                h={3}
                mx={1}
              />
            )}
          </Button>
        </Flex>
      </Box>
      <Flex
        h="full"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
      >
        <Button
          variant="unstyled"
          p={0}
          onPress={() => {
            setIsCopy(true);
            copyToClipboard(Base64.decode(item.password));

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
                      Copied to clipboard
                    </Text>
                  </Box>
                );
              },
            });
          }}
        >
          <Image
            source={require("./../assets/images/copy.png")}
            alt="Copy"
            w={6}
            h={6}
          />
        </Button>
        {route.name === "Keys" && (
          <Menu
            placement="left top"
            w="190"
            borderRadius={16}
            bgColor={currentTheme === "light" ? "#000000" : "#ffffff"}
            trigger={(triggerProps) => {
              return (
                <Pressable
                  accessibilityLabel="More options menu"
                  {...triggerProps}
                >
                  <Image
                    source={require("./../assets/images/dots.png")}
                    alt="Dots"
                    size={5}
                  />
                </Pressable>
              );
            }}
          >
            <Menu.Item onPress={() => editPassword(item)}>
              <View
                w={"100%"}
                alignItems={"center"}
                justifyContent={"space-between"}
                flexDir={"row"}
              >
                <Text
                  fontWeight={"bold"}
                  color={currentTheme === "light" ? "#ffffff" : "#000000"}
                >
                  Edit{" "}
                </Text>
                <Image
                  source={require("./../assets/images/edit.png")}
                  alt="Edit"
                  size={4}
                />
              </View>
            </Menu.Item>
            <Divider
              w="100%"
              color={currentTheme === "light" ? "#ffffff" : "#000000"}
            />
            <Menu.Item onPress={() => deletePassword(item.id)}>
              <View
                w={"100%"}
                alignItems={"center"}
                justifyContent={"space-between"}
                flexDir={"row"}
              >
                <Text
                  fontWeight={"bold"}
                  // w="50%"
                  color={currentTheme === "light" ? "#ffffff" : "#000000"}
                >
                  Delete{" "}
                </Text>
                <Image
                  source={require("./../assets/images/trash-can.png")}
                  alt="Trash Can"
                  size={4}
                />
              </View>
            </Menu.Item>
          </Menu>
        )}
      </Flex>
    </Flex>
  );
};
