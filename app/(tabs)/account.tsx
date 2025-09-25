import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import { showToastable } from "react-native-toastable";

const Account = () => {
  const route = useRouter();

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("username");
      route.replace("/login");
    } catch (ex) {
      showToastable({
        message: "Failed to logout. Try again.",
        status: "danger",
      });
    }
  };
  return (
    <View>
      <Text>Account</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({});
