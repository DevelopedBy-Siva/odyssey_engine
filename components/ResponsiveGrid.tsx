import { Layout } from "@/components/DesignSystem";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: number;
  spacing?: number;
  breakpoint?: 'mobile' | 'tablet' | 'desktop' | 'large' | 'xlarge';
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = 2,
  spacing = Layout.componentSpacing.cardGap,
  breakpoint = 'mobile',
}) => {
  const screenWidth = Dimensions.get('window').width;
  const currentBreakpoint = Layout.responsive.getBreakpoint(screenWidth);
  
  // Determine number of columns based on breakpoint
  const getColumns = () => {
    if (currentBreakpoint === 'mobile') return Math.min(columns, 2);
    if (currentBreakpoint === 'tablet') return Math.min(columns, 3);
    if (currentBreakpoint === 'desktop') return Math.min(columns, 4);
    return Math.min(columns, 6);
  };

  const numColumns = getColumns();

  return (
    <View style={[styles.grid, { gap: spacing }]}>
      {React.Children.map(children, (child, index) => (
        <View 
          key={index} 
          style={[
            styles.gridItem, 
            { 
              width: `${(100 / numColumns) - (spacing * (numColumns - 1) / (screenWidth * numColumns))}%`,
              marginBottom: spacing 
            }
          ]}
        >
          {child}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    // Width is calculated dynamically based on columns
  },
});

export default ResponsiveGrid;
