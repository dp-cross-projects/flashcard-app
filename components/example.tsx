import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function RenderSet() {
  const db = useSQLiteContext();
  const [text, setText] = useState<any>("");
  const [value, setValue] = useState<any>("");
  const [data, setData] = useState<any>("");

  // useEffect(() => {

  // }, []);

  async function getOne() {
    const result = await db.getFirstAsync(
      "SELECT * from test WHERE id = ?",
      text,
    );
    console.log(text);
    console.log(result);
    setData(result);
  }

  async function getData() {
    const result = await db.getAllAsync<any>("SELECT * from test");
    console.log(result);
  }

  async function addData() {
    const result = await db.execAsync(
      ` 
        INSERT INTO test (value, intValue) VALUES ('test1', 123);
        INSERT INTO test (value, intValue) VALUES ('test2', 456);
        INSERT INTO test (value, intValue) VALUES ('test3', 789);`,
    );
  }

  async function updateOne() {
    const result = await db.runAsync(
      ` 
      UPDATE test
      SET value = ?
      WHERE id = ?
      `,
      value,
      text,
    );
    console.log(value);
  }

  async function clearData() {
    await db.runAsync("DELETE FROM test");
  }

  return (
    <View style={styles.container}>
      <Text>This is a new other Set</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText} onPress={getData}>
          Get All
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={getOne}>
        <Text style={styles.buttonText}>Get One</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={addData}>
        <Text style={styles.buttonText}>Insert</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={clearData}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>

      <Text>ID</Text>
      <TextInput onChangeText={setText} value={text} style={styles.button} />

      <Text>VALUE</Text>
      <TextInput onChangeText={setValue} value={value} style={styles.button} />
      <TouchableOpacity style={styles.button} onPress={updateOne}>
        <Text style={styles.buttonText}>update Value</Text>
      </TouchableOpacity>
      <Text>Results</Text>
      <Text style={styles.buttonText}>{data.value}</Text>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "cyan",
  },
  image: {
    height: 200,
    width: 200,
  },
  button: {
    backgroundColor: "blue",
    padding: 7,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
  },
});

// <SafeAreaProvider>
//   <SafeAreaView>
//     {/* Title */}
//     <View>
//       <Text style={styles.title}>Flashcards App</Text>
//     </View>

//     <View>
//       <Text>Cards are here</Text>
//       <SQLiteProvider
//         databaseName="test.db"
//         assetSource={{ assetId: require("../assets/test.db") }}
//       ></SQLiteProvider>
//     </View>

//     <View>
//       <TouchableOpacity style={styles.button} onPress={addNewCard}>
//         <Text style={styles.buttonText}>Press Me</Text>
//       </TouchableOpacity>
//     </View>
//   </SafeAreaView>
// </SafeAreaProvider>
