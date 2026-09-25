// Bu dosya `pnpm sync:content` ile üretilir; elle düzenleme.

export type MoodId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';

export interface Mood {
  id: MoodId;
  emoji: string;
  accentColor: string;
}

export const moods: Mood[] = [
  { id: 'A', emoji: '🌿', accentColor: '#00c853' },
  { id: 'B', emoji: '🌊', accentColor: '#00b0ff' },
  { id: 'C', emoji: '🖤', accentColor: '#9e9e9e' },
  { id: 'D', emoji: '🌸', accentColor: '#f06292' },
  { id: 'E', emoji: '🌧️', accentColor: '#90a4ae' },
  { id: 'F', emoji: '🌪️', accentColor: '#5c6bc0' },
  { id: 'G', emoji: '🍂', accentColor: '#8d6e63' },
  { id: 'H', emoji: '🤲', accentColor: '#81d4fa' },
];

export const moodIds: MoodId[] = moods.map((m) => m.id);

export const moodById: Record<MoodId, Mood> = Object.fromEntries(
  moods.map((m) => [m.id, m]),
) as Record<MoodId, Mood>;
