import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Link, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function RenderFlashcard() {
  const db = useSQLiteContext();
  const [flashcards, setFlashcards] = useState<any>("");
  const [item, setItem] = useState("");
  const [definition, setDefinition] = useState("");

  const { id } = useLocalSearchParams();

  useEffect(() => {
    getFlashcards();
  }, []);

  async function getFlashcards() {
    const result = await db.getAllAsync<any>(
      "SELECT * FROM cards WHERE id = ?",
      id.toString(),
    );

    setFlashcards(result);
  }

  async function addNewFlashcard() {
    await db.runAsync(
      ` 
          INSERT INTO cards (item, definition, set_id) VALUES (?, ?, ?);
        `,
      item,
      definition,
      id.toString(),
    );
  }

  async function clearData() {
    await db.runAsync("DELETE FROM cards");
  }

  return (
    <>
      <View style={styles.container}>
        <View>
          <Text variant="h2">
            Flashcards{" "}
            <Link href="/">
              <Text>X</Text>
            </Link>
          </Text>
        </View>
        <View>
          {flashcards.length > 0 ? (
            flashcards.map((f: any) => (
              <Dialog key={f.id}>
                <DialogTrigger asChild>
                  <TouchableOpacity>
                    <Card className="w-full max-w-sm">
                      <CardHeader className="flex-row">
                        <View className="flex-1 gap-1.5">
                          <CardTitle>{f.item}</CardTitle>
                        </View>
                      </CardHeader>
                    </Card>
                  </TouchableOpacity>
                </DialogTrigger>

                <DialogContent>
                  <Text>{f.item}</Text>
                  <Text>{f.definition}</Text>
                  <DialogClose asChild>
                    <Button variant="outline">
                      <Text>Close</Text>
                    </Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            ))
          ) : (
            <Text>There are not flashcards</Text>
          )}
        </View>
      </View>

      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Text>Add New Set</Text>
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Item Name</DialogTitle>
          </DialogHeader>
          <View>
            <Input value={item} onChangeText={setItem}></Input>
            <Input value={definition} onChangeText={setDefinition}></Input>
          </View>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">
                <Text>Close</Text>
              </Button>
            </DialogClose>
            <Button onTouchStart={addNewFlashcard}>
              <Text>Add</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <TouchableOpacity onPress={clearData}>
        <Text>Clear</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    marginTop: 20,
  },
});
