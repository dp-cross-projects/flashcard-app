import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import "../global.css";

// The is the main function and executes when the application start.
export default function RootLayout() {
  return (
    <>
      {/* We start the SQL Provide by giving a database name and 
    the script to create the database tables if is the first
    time runnning the application */}
      <SQLiteProvider
        databaseName="flashcards.db"
        onInit={async (db) =>
          await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS sets (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS cards (id INTEGER PRIMARY KEY NOT NULL, item TEXT NOT NULL, definition TEXT NOT NULL, set_id INTEGER NOT NULL);
        `)
        }
        options={{ useNewConnection: false }}
      >
        {/* Init the Stack for Expo Router */}
        <Stack screenOptions={{ headerShown: false }} />

        {/* We init the Portal Host for React Native Reusables
        to work correctly */}
        <PortalHost />
      </SQLiteProvider>
    </>
  );
}
