import { Box, Text, useToast } from "native-base";

export const Toast = ({ data }) => {
  const toast = useToast();

  return toast.show({
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
          <Text color={currentTheme === "light" ? "#ffffff" : "#000000"}>
            {data}
          </Text>
        </Box>
      );
    },
  });
};
