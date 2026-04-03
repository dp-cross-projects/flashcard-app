import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "expo-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function RenderSets() {
  const db = useSQLiteContext();
  const [sets, setSets] = useState<any>("");
  const [topic, setTopic] = useState("");

  useEffect(() => {
    getSets();
  }, []);

  async function getSets() {
    const result = await db.getAllAsync<any>("SELECT * from sets");
    setSets(result);
  }

  async function addNewSet() {
    await db.runAsync(
      ` 
          INSERT INTO sets (name) VALUES (?);
        `,
      topic,
    );
    getSets();
  }

  async function clearData() {
    await db.runAsync("DELETE FROM sets");
  }

  return (
    <View style={styles.container}>
      <Text variant="h2">Sets</Text>

      {sets.length > 0 ? (
        sets.map((s: any) => (
          <TouchableOpacity key={s.id}>
            <Link href={`/flashcard/${s.id}`}>
              <Card className="w-full max-w-sm">
                <CardHeader className="flex-row">
                  <View className="flex-1 gap-1.5">
                    <CardTitle>{s.name}</CardTitle>
                  </View>
                </CardHeader>
              </Card>
            </Link>
          </TouchableOpacity>
        ))
      ) : (
        <Text>There are not sets</Text>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Text>Add New Set</Text>
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Topic Name</DialogTitle>
          </DialogHeader>
          <View>
            <Input value={topic} onChangeText={setTopic}></Input>
          </View>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">
                <Text>Close</Text>
              </Button>
            </DialogClose>
            <Button onTouchStart={addNewSet}>
              <Text>Add</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <TouchableOpacity onPress={clearData}>
        <Text>Clear</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    marginTop: 20,
  },
});
