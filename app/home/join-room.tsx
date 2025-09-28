import { AnimatedCard } from "@/components/AnimatedComponents";
import { BorderRadius, Colors, Layout, Spacing, Typography } from "@/components/DesignSystem";
import { GameRoomCard } from "@/components/ModernCard";
import { ModernHeader } from "@/components/ModernHeader";
import { SearchInput } from "@/components/ModernInput";
import { getSocket } from "@/store/socket";
import { useUserStore } from "@/store/userStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Room = {
  room_id: string;
  room_size: number;
  max_players: number;
  room_name: string;
  theme: any;
  host: string;
};

const JoinRoom = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [query, setQuery] = useState("");
  const [visibleRooms, setVisibleRooms] = useState<Room[]>([]);
  const [deletingRooms, setDeletingRooms] = useState<Set<string>>(new Set());
  const username = useUserStore((state) => state.username);
  const colors = Colors;
  const socket = getSocket(username);
  const router = useRouter();

  useEffect(() => {
    const new_rooms = rooms.filter((item) =>
      item.room_id.toLowerCase().includes(query.trim().toLowerCase()) ||
      item.room_name.toLowerCase().includes(query.trim().toLowerCase()) ||
      item.host.toLowerCase().includes(query.trim().toLowerCase())
    );
    setVisibleRooms(new_rooms);
  }, [query, rooms]);

  useEffect(() => {
    socket.emit("rooms", {});
    socket.on("available-rooms", (data) => {
      setRooms(data.rooms);
    });

    socket.on("room_deleted", (data) => {
      // Remove the room from the list
      setRooms(prevRooms => prevRooms.filter(room => room.room_id !== data.room_id));
    });

    socket.on("notification", (data) => {
      // Handle delete success/failure notifications
      if (data.message.includes("deleted successfully")) {
        // Remove from deleting state
        setDeletingRooms(prev => {
          const newSet = new Set(prev);
          // Find the room that was deleted by checking which one was in deleting state
          for (const roomId of prev) {
            newSet.delete(roomId);
          }
          return newSet;
        });
      } else if (data.message.includes("delete")) {
        // Remove from deleting state on error
        setDeletingRooms(prev => {
          const newSet = new Set(prev);
          for (const roomId of prev) {
            newSet.delete(roomId);
          }
          return newSet;
        });
      }
    });

    return () => {
      socket.off("available-rooms");
      socket.off("room_deleted");
      socket.off("notification");
    };
  }, [socket]);

  const join = (id: string) => {
    socket.emit("join", {
      username: username,
      room: id,
      option: "join",
    });
  };

  const deleteRoom = (id: string) => {
    // Set loading state for this room
    setDeletingRooms(prev => new Set(prev).add(id));
    
    socket.emit("delete-room", {
      room: id,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.background, { backgroundColor: colors.background }]}>
        <ModernHeader
          title="Join Room"
          subtitle="Find and join existing game rooms"
          showBackButton={true}
          onBackPress={() => router.back()}
        />
        
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.searchSection}>
            <SearchInput
              placeholder="Search by room name, ID, or host..."
              value={query}
              onChangeText={setQuery}
              containerStyle={styles.searchContainer}
            />
          </View>

          <View style={styles.resultsSection}>
            {visibleRooms.length === 0 ? (
              <AnimatedCard
                style={styles.emptyState}
                direction="up"
                delay={200}
              >
                <MaterialCommunityIcons
                  name="magnify"
                  size={48}
                  color={colors.textTertiary}
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyTitle}>No rooms found</Text>
                <Text style={styles.emptySubtitle}>
                  Try adjusting your search terms or create a new room
                </Text>
              </AnimatedCard>
            ) : (
              <View style={styles.roomsList}>
                {visibleRooms.map((room, index) => (
                  <GameRoomCard
                    key={room.room_id}
                    roomName={room.room_name || "Unnamed Room"}
                    theme={typeof room.theme === 'string' ? room.theme : room.theme?.name || "Default"}
                    host={room.host}
                    roomId={room.room_id}
                    currentPlayers={room.room_size}
                    maxPlayers={room.max_players}
                    onJoin={() => join(room.room_id)}
                    onDelete={() => deleteRoom(room.room_id)}
                    isDeleting={deletingRooms.has(room.room_id)}
                    animated={true}
                    delay={index * 100}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default JoinRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Layout.spacing['5xl'],
  },
  searchSection: {
    paddingHorizontal: Layout.componentSpacing.contentPadding,
    paddingTop: Layout.componentSpacing.contentPadding,
    paddingBottom: Layout.componentSpacing.formFieldGap,
  },
  searchContainer: {
    marginBottom: 0,
  },
  resultsSection: {
    paddingHorizontal: Layout.componentSpacing.contentPadding,
  },
  roomsList: {
    gap: Layout.componentSpacing.cardGap,
  },
  emptyState: {
    alignItems: 'center',
    padding: Layout.spacing['4xl'],
    borderRadius: BorderRadius.lg,
    marginTop: Layout.componentSpacing.sectionGap,
  },
  emptyIcon: {
    marginBottom: Layout.componentSpacing.contentPadding,
  },
  emptyTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    marginBottom: Spacing.sm,
    textAlign: 'center',
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: Typography.sm,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.normal * Typography.sm,
    color: Colors.textSecondary,
  },
});
