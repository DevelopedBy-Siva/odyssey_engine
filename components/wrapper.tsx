import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";

type GradientWrapperProps = {
  children: ReactNode;
};

const GradientWrapper: React.FC<GradientWrapperProps> = ({ children }) => {
  return (
    <LinearGradient
      colors={["#000", "#000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.96, y: 0.27 }}
      style={styles.container}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GradientWrapper;
