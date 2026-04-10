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

// This function renders the RenderFlashcard component
export default function RenderFlashcard() {
  // Call the SQLite Context to connect to database
  // and use the Expo SQLite functions
  const db = useSQLiteContext();

  // State "flashcards" works for rendering when changes are made
  const [flashcards, setFlashcards] = useState<any>("");

  // State "item" and "definition" are used to save the input and create
  // a new card on database calling
  const [item, setItem] = useState("");
  const [definition, setDefinition] = useState("");

  // State "cardTitle" works for rendering the card content
  const [cardTitle, setCardTitle] = useState(true);

  // This parameter is used to filter the cards under the set relation
  const { id } = useLocalSearchParams();

  // Effect to render the Flashcards when the state change
  useEffect(() => {
    getFlashcards();
  }, []);

  // Execute a query on database to get all the cards
  async function getFlashcards() {
    const result = await db.getAllAsync<any>(
      "SELECT * FROM cards WHERE set_id = ?",
      id.toString(),
    );
    setFlashcards(result);
  }

  // Execute a query to create a new Card using the item and definition
  // states as parameter, then call to render the cards
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

  // Exequte a query to delete a Card. id parameter is required.
  // After delete the card, call to render the cards
  async function deleteCard(id: any) {
    await db.runAsync("DELETE FROM cards where id = ?", id);
    getFlashcards();
  }

  // Return to render the component
  return (
    <>
      {/* Main container */}
      <View style={styles.container}>
        {/* SCREEN TITLE */}
        <View className="flex flex-row">
          {/* Back to Set screen button */}
          <Link href="/" className="w-14 flex-initial p-2">
            <Icon as={CircleArrowLeft} className="p-2"></Icon>
          </Link>

          {/* Title text */}
          <Text variant="h2" className="w-64 flex-2">
            Flashcards{" "}
          </Text>
        </View>

        {/* Flashcard list container */}
        <View>
          {/* If there are flashcards, then render them. If not,
        a Text is rendered */}
          {flashcards.length > 0 ? (
            // Maps the cards rendering a button with the
            // "item" value as Text
            flashcards.map((f: any) => (
              // Container to hold the card list and delete button
              <View className="flex flex-row" key={f.id}>
                {/* We use a Dialog to render the flashcard.
                The trigger button is listed in the set screen */}
                <Dialog className="flex-1">
                  {/* Button to execute the Dialog */}
                  <DialogTrigger asChild>
                    <TouchableOpacity>
                      <Card className="w-full max-w-sm">
                        <CardHeader className="flex-row">
                          <View className="flex-1 gap-1.5">
                            {/* The card name is rendered here */}
                            <CardTitle>{f.item}</CardTitle>
                          </View>
                        </CardHeader>
                      </Card>
                    </TouchableOpacity>
                  </DialogTrigger>

                  {/* The card is rendered here */}
                  <DialogContent className="p-0" style={styles.cardContent}>
                    {/* This Pressable toggle the item and definition from
                    the card */}
                    <Pressable
                      onPress={() => setCardTitle(!cardTitle)}
                      style={styles.cardContent}
                    >
                      {/* This Text toggle as Pressable triggers */}
                      <Text className="text-foreground block w-64 h-64 text-lg text-center font-semibold">
                        {cardTitle ? f.item : f.definition}
                      </Text>
                    </Pressable>
                  </DialogContent>
                </Dialog>

                {/* Renders the delete button using the id as parameter */}
                <Button
                  onPress={() => {
                    deleteCard(f.id);
                  }}
                  variant="destructive"
                  className="flex-2"
                >
                  <Icon as={Trash2}></Icon>
                </Button>
              </View>
            ))
          ) : (
            // This text will be rendered if not cards are available
            <Text>There are not flashcards</Text>
          )}
        </View>
      </View>

      {/* This Dialog will be triggered with a button at the bottom of screen */}
      <Dialog>
        <DialogTrigger asChild>
          {/* Dialog trigger button */}
          <Button>
            <Text>Add New Card</Text>
          </Button>
        </DialogTrigger>

        {/* This dialog contents the input to create a new card */}
        <DialogContent className="flex flex-col w-full max-w-80">
          {/* Dialog card title */}
          <DialogHeader>
            <DialogTitle>Flashcard</DialogTitle>
          </DialogHeader>

          {/* Dialog Content */}
          <View className="w-full  max-w-64">
            <Label>Title</Label>

            {/* This input set the item state as the content changes */}
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

            {/* This input set the definition state as the content changes */}
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

          {/* Dialog Footer */}
          <DialogFooter className="flex flex-row">
            {/* This button calls the addNewFlashcard function to create the new card */}
            <Button onTouchStart={addNewFlashcard}>
              <Text>Add</Text>
            </Button>

            {/* Dialog close button */}
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

// Styles used for main container and flashcard container
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
