import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import "../global.css";

export default function RootLayout() {
  return (
    <>
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
        <Stack screenOptions={{ headerShown: false }} />
        <PortalHost />
      </SQLiteProvider>
    </>
  );
}
