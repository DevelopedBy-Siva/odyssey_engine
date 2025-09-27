import { getSocket } from "@/store/socket";
import { useUserStore } from "@/store/userStore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Room = {
  room_size: number;
  room_id: string;
};

const JoinRoom = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [query, setQuery] = useState("");
  const [visibleRooms, setVisibleRooms] = useState<Room[]>([]);
  const username = useUserStore((state) => state.username);
  const socket = getSocket(username);

  useEffect(() => {
    const new_rooms = rooms.filter((item) =>
      item.room_id.toLowerCase().includes(query.trim().toLowerCase())
    );
    setVisibleRooms(new_rooms);
  }, [query, rooms]);

  useEffect(() => {
    socket.emit("rooms", {});
    socket.on("available-rooms", (data) => {
      setRooms(data.rooms);
    });

    return () => {
      socket.off("available-rooms");
    };
  }, []);

  const join = (id: string) => {
    socket.emit("join", {
      username: username,
      room: id,
      option: "join",
    });
  };

  return (
    <View
      style={{ paddingTop: 20, paddingBottom: 20, backgroundColor: "#000" }}
    >
      <TextInput
        selectionColor="#484848ff"
        placeholderTextColor="#484848ff"
        style={style.searchInput}
        placeholder="Search room id..."
        keyboardType="default"
        value={query}
        onChangeText={setQuery}
      />

      {visibleRooms.length === 0 ? (
        <Text style={{ color: "#8a8a8aff", textAlign: "center", fontSize: 14 }}>
          No rooms found
        </Text>
      ) : (
        <FlatList
          data={visibleRooms}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => (
            <View style={style.room}>
              <Text
                style={{ fontSize: 28, fontWeight: "500", color: "#dac3fb" }}
              >
                {item.room_size} / 4
              </Text>
              <View style={style.row}>
                <TouchableOpacity
                  onPress={() => join(item.room_id)}
                  style={style.joinBtn}
                >
                  <Text style={{ fontSize: 14 }}>Join</Text>
                </TouchableOpacity>
                <Text
                  style={{
                    marginTop: 10,
                    textAlign: "right",
                    color: "#8a8a8aff",
                    fontSize: 11,
                  }}
                >
                  ID: {item.room_id}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default JoinRoom;

const style = StyleSheet.create({
  view: {
    flex: 1,
    gap: 10,
  },
  room: {
    padding: 15,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 0.2,
    borderBottomColor: "#8a8a8aff",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 5,
  },
  joinBtn: {
    backgroundColor: "#fff",
    padding: 4,
    borderRadius: 10,
    width: 60,
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchInput: {
    marginTop: 30,
    marginBottom: 30,
    width: "100%",
    borderWidth: 1,
    padding: 20,
    borderRadius: 10,
    borderColor: "#484848ff",
    color: "#989898ff",
  },
});
