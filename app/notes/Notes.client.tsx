'use client';

import { useState } from 'react';
import css from './Notes.module.css';
import { useDebounce } from 'use-debounce';

import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import NoteList from '@/components/NoteList/NoteList';
import Loader from '@/components/Loader/Loader';
// import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

import { fetchNotes } from '@/lib/api';

import { useQuery, keepPreviousData } from '@tanstack/react-query';

import type { FetchNotesResponse } from '@/lib/api';

interface NotesClientProps {
  initialData: FetchNotesResponse;
}

export default function NotesClient({ initialData }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedSearchValue] = useDebounce(searchValue, 1000);

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ['notes', debouncedSearchValue, currentPage],
    queryFn: () => fetchNotes(currentPage, debouncedSearchValue),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    initialData:
      debouncedSearchValue === '' && currentPage === 1
        ? initialData
        : undefined,
  });
  console.log(data);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleSearch = (searchValue: string) => {
    setSearchValue(searchValue);
    setCurrentPage(1);
  };

  const totalPages = data?.totalPages ?? 0;
  return (
    <>
      <div className={css.app}>
        <div className={css.toolbar}>
          {/* <SearchBox onChange={handleSearch} /> */}
          {isSuccess && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
          <button className={css.button} onClick={handleOpenModal}>
            Create note +
          </button>
        </div>
        {isFetching && <Loader />}
        {/* {isError && <ErrorMessage />} */}
        {data && isSuccess && data.notes.length > 0 ? (
          <NoteList notes={data.notes} />
        ) : (
          <p className={css.noResults}>Nothing found for your request.</p>
        )}
        {isModalOpen && (
          <Modal onClose={handleCloseModal}>
            <NoteForm onClose={handleCloseModal} />
          </Modal>
        )}
      </div>
    </>
  );
}
