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
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { Link, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";

export default function RenderFlashcard() {
  const db = useSQLiteContext();
  const [flashcards, setFlashcards] = useState<any>("");
  const [item, setItem] = useState("");
  const [definition, setDefinition] = useState("");
  const [cardTitle, setCardTitle] = useState(true);

  const { id } = useLocalSearchParams();

  useEffect(() => {
    getFlashcards();
  }, []);

  async function getFlashcards() {
    const result = await db.getAllAsync<any>(
      "SELECT * FROM cards WHERE set_id = ?",
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

                <DialogContent className="p-0" style={styles.cardContent}>
                  <Pressable
                    onPress={() => setCardTitle(!cardTitle)}
                    style={styles.cardContent}
                  >
                    <Text className="text-foreground block w-64 h-64">
                      {cardTitle ? f.item : f.definition}
                    </Text>
                  </Pressable>
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
            <Text>Add New Card</Text>
          </Button>
        </DialogTrigger>

        <DialogContent className="flex flex-column w-full max-w-64">
          <DialogHeader>
            <DialogTitle>Flashcard</DialogTitle>
          </DialogHeader>
          <View className="w-full flex flex-column max-w-64">
            <Label>Title</Label>
            <Input value={item} onChangeText={setItem} maxLength={40}></Input>
            <Label>Description</Label>
            <View className="flex-2 w-full w-2">
              <Input
                value={definition}
                onChangeText={setDefinition}
                maxLength={40}
              ></Input>
            </View>
          </View>
          <DialogFooter className="flex flex-row">
            <Button onTouchStart={addNewFlashcard}>
              <Text>Add</Text>
            </Button>
            <DialogClose asChild>
              <Button variant="outline">
                <Text>Close</Text>
              </Button>
            </DialogClose>
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
  cardContent: {
    flex: 1,
    padding: 40,
    marginTop: 20,
    justifyContent: "center",
    alignContent: "center",
  },
});
