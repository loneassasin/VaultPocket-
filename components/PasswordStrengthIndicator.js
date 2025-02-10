import { Box, Text, View } from "native-base";
import { useContext } from "react";
import zxcvbn from "zxcvbn";
import { ThemeContext, darkTheme, lightTheme } from "./../utils";

export const PasswordStrengthIndicator = ({ password }) => {
  const strength = zxcvbn(password).score;
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const strengthColors = [
    "#FF0000",
    "#FF4500",
    "#FFA500",
    "#32CD32",
    "#00FF00",
  ];
  const indicatorWidth = `${(strength + 1) * 20}%`;
  const indicatorColor = strengthColors[strength];

  const { currentTheme } = useContext(ThemeContext);

  const theme = currentTheme === "light" ? lightTheme : darkTheme;

  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      w="full"
      mt={2}
      mb={4}
    >
      {/*<Text>Password Strength: {strengthLabels[strength]}</Text> */}
      <Box w="75%" h={2} p={0.5}>
        <View
          style={{
            height: "100%",
            width: indicatorWidth,
            backgroundColor: indicatorColor,
          }}
        />
      </Box>
      <Box w="25%" h="full">
        <Text color={theme.text} fontSize={12} mx={1} opacity={0.5}>
          Strength
        </Text>
      </Box>
    </Box>
  );
};
