import { Suspense } from 'react';
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';

export default async function NotePage() {
  let notesData;
  try {
    notesData = await fetchNotes(1, '');
  } catch (error) {
    console.error(error);
    notesData = { notes: [], totalPages: 0 };
  }

  return (
    <Suspense fallback={<p>Loading notes...</p>}>
      <NotesClient initialData={notesData} />
    </Suspense>
  );
}
