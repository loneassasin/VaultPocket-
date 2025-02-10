import { SSRProvider } from "@react-aria/ssr";
import { NativeBaseProvider } from "native-base";
import { ThemeProvider } from "./utils";
import Navigator from "./navigation/MainNavigation";
import { LogBox } from "react-native";
LogBox.ignoreLogs([
  "We can not support a function callback. See Github Issues for details https://github.com/adobe/react-spectrum/issues/2320",
]);
export default function App() {
  return (
    <SSRProvider>
      <ThemeProvider>
        <NativeBaseProvider>
          <Navigator />
        </NativeBaseProvider>
      </ThemeProvider>
    </SSRProvider>
  );
}
