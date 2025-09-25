import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Welcome</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    backgroundColor: "#000",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
  },
});
