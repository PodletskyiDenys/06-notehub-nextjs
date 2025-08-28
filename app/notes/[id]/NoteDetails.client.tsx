'use client';
import css from './NoteDetails.module.css';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { fetchNoteById } from '@/lib/api';
import Link from 'next/link';

type RouteParams = { id: string };

export default function NoteDetailsClient() {
  const { id } = useParams<RouteParams>();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
    enabled: !!id,
    staleTime: 60_000,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError || !note) return <p>Something went wrong.</p>;

  return (
    <>
      {note && (
        <div className={css.container}>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>{note.createdAt}</p>
          </div>
          <Link href="/notes" className={css.backLink}>
            ← Back
          </Link>
        </div>
      )}
    </>
  );
}
