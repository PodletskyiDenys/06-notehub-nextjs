'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';

const NotesPage = () => {
  const page = 1;
  const search = '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: ({ queryKey }) =>
      fetchNotes(queryKey[1] as number, queryKey[2] as string),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading notes</p>;

  return (
    <div>
      <h1>Notes</h1>
      {data?.notes.map((note) => (
        <div key={note.id}>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
};

export default NotesPage;
