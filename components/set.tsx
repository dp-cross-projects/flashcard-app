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
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { Input } from "./ui/input";

// This function renders the RenderSet component
export default function RenderSets() {
  // Call the SQLite Context to connect to database
  // and use the Expo SQLite functions
  const db = useSQLiteContext();

  // State "sets" works for rendering when changes are made
  const [sets, setSets] = useState<any>("");

  // State "topic" is use to save the input and create
  // a new topic on database calling
  const [topic, setTopic] = useState("");

  // Effect to render the Sets when the state change
  useEffect(() => {
    getSets();
  }, []);

  // Execute a query on database to get all the sets
  async function getSets() {
    const result = await db.getAllAsync<any>("SELECT * from sets");
    setSets(result);
  }

  // Execute a query to create a new Set using the topic state as parameter,
  // then call to render the sets
  async function addNewSet() {
    await db.runAsync(
      ` 
          INSERT INTO sets (name) VALUES (?);
        `,
      topic,
    );
    getSets();
  }

  // Exequte a query to delete a Set. id parameter is required.
  // After delete the set, call to render the sets
  async function deleteSet(id: any) {
    await db.runAsync("DELETE FROM sets where id = ?", id);
    getSets();
  }

  // Return to render the component
  return (
    <>
      {/* Main container */}
      <View style={styles.container}>
        {/* SCREEN TITLE */}
        <Text variant="h2">Sets</Text>

        {/* If there are sets, then render them. If not,
        a Text is rendered */}
        {sets.length > 0 ? (
          // Maps the sets rendering a button with the
          // "name" value as Text
          sets.map((s: any) => (
            <View className="flex flex-row w-full" key={s.id}>
              <TouchableOpacity className="flex-1">
                {/* The button will have a link to send the
                user to Flashcard screen using the id as value */}
                <Link href={`/set/${s.id}`}>
                  <Card className="w-full max-w-sm">
                    <CardHeader className="flex-row">
                      <View className="flex-1 gap-1.5">
                        {/* The set name is rendered here */}
                        <CardTitle>{s.name}</CardTitle>
                      </View>
                    </CardHeader>
                  </Card>
                </Link>
              </TouchableOpacity>

              {/* Renders the delete button using the id as parameter */}
              <Button
                onPress={() => {
                  deleteSet(s.id);
                }}
                variant="destructive"
                className="flex-2"
              >
                <Icon as={Trash2}></Icon>
              </Button>
            </View>
          ))
        ) : (
          // This text will be rendered if not sets are available
          <Text>There are not sets</Text>
        )}
      </View>

      {/* This Dialog will be triggered with a button at the bottom of screen */}
      <Dialog>
        <DialogTrigger asChild>
          {/* Dialog trigger button */}
          <Button>
            <Text>Add New Set</Text>
          </Button>
        </DialogTrigger>

        {/* This dialog contents the input to create a new set */}
        <DialogContent className="flex flex-column">
          {/* Dialog card title */}
          <DialogHeader>
            <DialogTitle>Topic Name</DialogTitle>
          </DialogHeader>

          {/* Dialog Content */}
          <View>
            {/* This input set the topic state as the content changes */}
            <Input value={topic} onChangeText={setTopic} maxLength={30}></Input>
          </View>

          {/* Dialog Footer */}
          <DialogFooter className="flex flex-row">
            {/* This button calls the addNewSet function to create the new set */}
            <Button onTouchStart={addNewSet}>
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

// Styles used for main container
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    marginTop: 20,
  },
});
