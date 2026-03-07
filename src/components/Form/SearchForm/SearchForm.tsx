import { Button } from '@/components/Button/Button';
import '@/components/Common/Fields.css';
import '@/components/Common/Loader.css';
import { zodResolver } from '@hookform/resolvers/zod';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import './SearchForm.css';

const SearchFormSchema = z.object({
  q: z.string().trim().min(1, { message: 'Required' }),
});

export type SearchFormSchemaType = z.infer<typeof SearchFormSchema>;

type SearchFormProps = {
  onSubmit: SubmitHandler<SearchFormSchemaType>;
  data: SearchFormResult[];
  loading: boolean;
  error: Error;
};

export type SearchFormResult = {
  id?: number;
  title: string;
  url: string;
  preview: string;
};

type SearchResultsProps = {
  items: SearchFormResult[];
};

function SearchResult({ title, url, preview }: Readonly<SearchFormResult>) {
  return (
    <div className="hoam-search-result">
      <h4 className="hoam-search-result__title">{title}</h4>
      <p className="hoam-search-result__preview">{preview}</p>
      <a
        href={url}
        className="hoam-search-result__link"
      >
        Read more
      </a>
    </div>
  );
}

export function SearchLoader() {
  return (
    <div className="hoam-search-form__loader">
      <span className="hoam-loader"></span>
    </div>
  );
}

export function SearchResults({ items }: Readonly<SearchResultsProps>) {
  if (items.length === 0)
    return (
      <div className="hoam-search-form__message">
        <p>No results!</p>
      </div>
    );
  return (
    <ol className="hoam-search-form__results">
      {items.map((item) => (
        <li key={item.id}>
          <SearchResult
            title={item.title}
            preview={item.preview}
            url={item.url}
          />
        </li>
      ))}
    </ol>
  );
}

function SearchForm({ onSubmit, data, loading, error }: Readonly<SearchFormProps>) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormSchemaType>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: {
      q: '',
    },
    mode: 'all',
  });

  return (
    <div className="hoam-search-form__wrapper">
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
              placeholder={errors?.q?.message || 'Enter keywords...'}
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
      </form>
    </div>
  );
}

export default SearchForm;
