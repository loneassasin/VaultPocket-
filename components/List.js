import { Box, Button, Flex, Icon, Text, useToast } from "native-base";
import { useContext, useState } from "react";
import * as Clipboard from "expo-clipboard";
import { ThemeContext, darkTheme, lightTheme } from "../utils";

export const List = ({ item, setIsCopy, editPassword, deletePassword }) => {
  const { currentTheme } = useContext(ThemeContext);
  const toast = useToast();
  const theme = currentTheme === "light" ? lightTheme : darkTheme;
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await Clipboard.setStringAsync(text);
      setIsCopy(true);
      toast.show({
        render: () => (
          <Box bg="#0E660C" px={4} py={2} rounded="md" mb={5}>
            <Text color="#ffffff">Copied to clipboard!</Text>
          </Box>
        ),
      });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.show({
        render: () => (
          <Box bg="#730000" px={4} py={2} rounded="md" mb={5}>
            <Text color="#ffffff">Failed to copy to clipboard</Text>
          </Box>
        ),
      });
    }
  };

  return (
    <Box
      bg={theme.cardBg || '#ffffff'}
      rounded="lg"
      shadow={2}
      mb={4}
      p={4}
    >
      <Flex direction="row" justify="space-between" align="center">
        <Box flex={1}>
          <Text color={theme.text} fontSize="lg" fontWeight="bold" mb={1}>
            {item.siteName || 'Untitled'}
          </Text>
          {item.url && (
            <Text color={theme.textSecondary || theme.text} fontSize="sm" mb={1}>
              {item.url}
            </Text>
          )}
          <Text color={theme.textSecondary || theme.text} fontSize="sm" mb={1}>
            {item.username}
          </Text>
          <Flex direction="row" align="center">
            <Text color={theme.textSecondary || theme.text} fontSize="sm">
              Password: {showPassword ? item.password : '••••••••'}
            </Text>
            <Button
              variant="ghost"
              onPress={() => setShowPassword(!showPassword)}
              _pressed={{ bg: 'transparent' }}
              p={1}
            >
              <Icon
                size="sm"
                color={theme.text}
                as={<Text>{showPassword ? '👁️' : '👁'}</Text>}
              />
            </Button>
          </Flex>
        </Box>
        <Flex direction="row" align="center">
          <Button
            variant="ghost"
            onPress={() => copyToClipboard(item.password)}
            _pressed={{ bg: 'transparent' }}
            p={2}
          >
            <Icon
              size="sm"
              color={theme.text}
              as={<Text>📋</Text>}
            />
          </Button>
          {editPassword && (
            <Button
              variant="ghost"
              onPress={() => editPassword(item)}
              _pressed={{ bg: 'transparent' }}
              p={2}
            >
              <Icon
                size="sm"
                color={theme.text}
                as={<Text>✏️</Text>}
              />
            </Button>
          )}
          {deletePassword && (
            <Button
              variant="ghost"
              onPress={() => deletePassword(item.id)}
              _pressed={{ bg: 'transparent' }}
              p={2}
            >
              <Icon
                size="sm"
                color={theme.text}
                as={<Text>🗑️</Text>}
              />
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};
