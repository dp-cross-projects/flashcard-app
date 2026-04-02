import RenderSet from "@/components/set";
import { SQLiteProvider } from "expo-sqlite";

export default function Index() {
  return (
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
      <RenderSet />
    </SQLiteProvider>
  );
}
