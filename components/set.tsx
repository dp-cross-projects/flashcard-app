import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function RenderSets() {
  const db = useSQLiteContext();
  const [text, setText] = useState<any>("");
  const [value, setValue] = useState<any>("");
  const [data, setData] = useState<any>("");

  // useEffect(() => {

  // }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sets</Text>
      <View></View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 40,
  },
});
