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
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { Link, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { CircleArrowLeft, Trash2 } from "lucide-react-native";
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
    getFlashcards();
  }

  async function clearData(id: any) {
    await db.runAsync("DELETE FROM cards where id = ?", id);
    getFlashcards();
  }

  return (
    <>
      <View style={styles.container}>
        <View className="flex flex-row">
          <Link href="/" className="w-14 flex-initial p-2">
            <Icon as={CircleArrowLeft} className="p-2"></Icon>
          </Link>
          <Text variant="h2" className="w-64 flex-2">
            Flashcards{" "}
          </Text>
        </View>
        <View>
          {flashcards.length > 0 ? (
            flashcards.map((f: any) => (
              <View className="flex flex-row" key={f.id}>
                <Dialog className="flex-1">
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
                      <Text className="text-foreground block w-64 h-64 text-lg text-center font-semibold">
                        {cardTitle ? f.item : f.definition}
                      </Text>
                    </Pressable>
                  </DialogContent>
                </Dialog>
                <Button
                  onPress={() => {
                    clearData(f.id);
                  }}
                  variant="destructive"
                  className="flex-2"
                >
                  <Icon as={Trash2}></Icon>
                </Button>
              </View>
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

        <DialogContent className="flex flex-col w-full max-w-80">
          <DialogHeader>
            <DialogTitle>Flashcard</DialogTitle>
          </DialogHeader>

          <View className="w-full  max-w-64">
            <Label>Title</Label>
            <View className="grow">
              <Input
                value={item}
                onChangeText={setItem}
                multiline={true}
                scrollEnabled={false}
                textAlignVertical="top"
                className="w-full max-w-24"
              ></Input>
            </View>
            <Label>Description</Label>
            <View className="grow">
              <Input
                value={definition}
                onChangeText={setDefinition}
                multiline={true}
                scrollEnabled={false}
                textAlignVertical="top"
                className="w-full max-w-24"
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
