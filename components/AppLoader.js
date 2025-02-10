import { deleteApp } from "firebase/app";
import LottieView from "lottie-react-native";
import { Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

export const AppLoader = () => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <LottieView
        source={require("./../assets/images/loading.json")}
        autoPlay
        loop
        //duration={40000}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    zIndex: 1,
  },
});
