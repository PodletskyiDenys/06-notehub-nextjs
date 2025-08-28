import axios from 'axios';
import type { Note, NoteTag } from '../types/note';
// import type { ReactNode } from 'react';

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface NewNote {
  title: string;
  content: string;
  tag: NoteTag;
}

const getAuthHeader = () => ({
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
});

export const fetchNotes = async (page: number = 1, search: string = '') => {
  const params: Record<string, string | number> = { page };
  if (search.trim() !== '') {
    params.search = search.trim();
  }

  try {
    const res = await axios.get<FetchNotesResponse>('/notes', {
      params,
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    throw new Error('Could not fetch the list of notes.');
  }
};

export const fetchNoteById = async (noteId: string | number) => {
  const res = await axios.get<Note>(`/notes/${noteId}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const createNote = async (newNote: NewNote) => {
  const res = await axios.post<Note>('/notes', newNote, {
    headers: getAuthHeader(),
  });
  return res.data;
};

export const deleteNote = async (noteId: string | number) => {
  const res = await axios.delete<Note>(`/notes/${noteId}`, {
    headers: getAuthHeader(),
  });
  return res.data;
};
