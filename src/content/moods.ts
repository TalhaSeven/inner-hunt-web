// Bu dosya `pnpm sync:content` ile üretilir; elle düzenleme.

export type MoodId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';

export interface Mood {
  id: MoodId;
  accentColor: string;
}

export const moods: Mood[] = [
  { id: 'A', accentColor: '#00c853' },
  { id: 'B', accentColor: '#00b0ff' },
  { id: 'C', accentColor: '#9e9e9e' },
  { id: 'D', accentColor: '#f06292' },
  { id: 'E', accentColor: '#90a4ae' },
  { id: 'F', accentColor: '#5c6bc0' },
  { id: 'G', accentColor: '#8d6e63' },
  { id: 'H', accentColor: '#81d4fa' },
];

export const moodIds: MoodId[] = moods.map((m) => m.id);

export const moodById: Record<MoodId, Mood> = Object.fromEntries(
  moods.map((m) => [m.id, m]),
) as Record<MoodId, Mood>;
