import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { View } from "react-native";

function Flashcard({ className, ...props }: React.ComponentProps<typeof View>) {
  return (
    <TextClassContext.Provider value="text-card-foreground">
      <View
        className={cn(
          "bg-card border-border flex flex-col gap-6 rounded-xl border shadow-sm shadow-black/5 h-auto",
          className,
        )}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function FlashCardContent({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return <View className={cn("p-2 h-auto", className)} {...props} />;
}

export { Flashcard, FlashCardContent };
