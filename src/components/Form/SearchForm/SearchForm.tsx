import { Button } from '@/components/Button/Button';
import '@/components/Common/Fields.css';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import './SearchForm.css';

const SearchFormSchema = z.object({
  q: z.string().trim().min(1, { message: 'Required' }),
});

export type SearchFormSchemaType = z.infer<typeof SearchFormSchema>;

type SearchFormProps = {
  onSubmit: SubmitHandler<SearchFormSchemaType>;
  onClose: () => void;
  data: SearchFormResult[];
  loading: boolean;
  error: Error;
};

export type SearchFormResult = {
  id: number;
  title: string;
  url: string;
  preview: string;
};

type SearchResultsProps = {
  items: SearchFormResult[];
};

function SearchResults({ items }: Readonly<SearchResultsProps>) {
  if (items.length === 0) return <p>No results</p>;
  return (
    <div>
      {items.map((item) => (
        <p key={item.id}>{item.title}</p>
      ))}
    </div>
  );
}

function SearchForm({ onSubmit, onClose, data, loading, error }: Readonly<SearchFormProps>) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SearchFormSchemaType>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: {
      q: '',
    },
    mode: 'all',
  });

  const handleReset = () => {
    reset();
    onClose?.();
  };

  return (
    <div>
      <form
        className="hoam-search-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="q"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              placeholder={errors?.q?.message}
              className="hoam-text-field"
              data-valid={errors?.q ? 'false' : 'true'}
              disabled={loading}
            />
          )}
        />

        <Button
          type="submit"
          className="hoam-search-form__button"
          variant="secondary"
        >
          Search
        </Button>
        <Button
          type="button"
          onClick={handleReset}
        >
          Close
        </Button>
      </form>
      {loading && !error ? <p>Loading</p> : null}
      {data && !error && !loading ? <SearchResults items={data} /> : null}
    </div>
  );
}

export default SearchForm;
