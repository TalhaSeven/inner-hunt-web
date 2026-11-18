import { moodIcons } from "@/content/mood-icons";
import { moodById, type MoodId } from "@/content/moods";

export default function MoodIcon({ id, className }: { id: MoodId; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ color: moodById[id].accentColor }}
      dangerouslySetInnerHTML={{ __html: moodIcons[id] }}
    />
  );
}
