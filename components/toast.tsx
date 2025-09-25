import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toastable from "react-native-toastable";

const Toast = () => {
  const { top } = useSafeAreaInsets();
  return (
    <Toastable
      offset={top}
      renderContent={({ message, status }) => {
        const { color, icon } = getStatusColor(status);
        return (
          <View style={styles.toastContainer}>
            <View style={styles.messageContainer}>
              <MaterialIcons name={icon as any} size={24} color={color} />
              <Text style={styles.toastMessage}>{message}</Text>
            </View>
          </View>
        );
      }}
    />
  );
};

export default Toast;

const getStatusColor = (status: any) => {
  switch (status) {
    case "danger":
      return { color: "#ffc42eff", icon: "error" };
    case "success":
      return { color: "#15dc03ff", icon: "check-circle" };
    default:
      return { color: "#fff", icon: "error" };
  }
};

const styles = StyleSheet.create({
  toastContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    backgroundColor: "#2f2f2fff",
    borderRadius: 12,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 12,
  },

  toastMessage: {
    color: "white",
    fontSize: 14,
    flex: 1,
  },
});
