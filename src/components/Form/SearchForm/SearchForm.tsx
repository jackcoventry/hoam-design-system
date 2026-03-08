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

export type SearchFormResult = {
  id?: number;
  title: string;
  url: string;
  preview: string;
};

type SearchFormProps = {
  onSubmit: SubmitHandler<SearchFormSchemaType>;
  loading: boolean;
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
      <span className="hoam-loader" />
    </div>
  );
}

export function SearchResults({ items }: Readonly<SearchResultsProps>) {
  if (items.length === 0) {
    return (
      <div className="hoam-search-form__message">
        <p>No results!</p>
      </div>
    );
  }

  return (
    <ol className="hoam-search-form__results">
      {items.map((item, index) => (
        <li key={item.id ?? `${item.url}-${index}`}>
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

function SearchForm({ onSubmit, loading }: Readonly<SearchFormProps>) {
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

  const queryError = errors.q?.message;
  const inputId = 'hoam-search-form-input';

  return (
    <div className="hoam-search-form__wrapper">
      <form
        className="hoam-search-form"
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e);
        }}
      >
        <label
          htmlFor={inputId}
          className="sr-only"
        >
          Search
        </label>

        <Controller
          name="q"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id={inputId}
              type="search"
              placeholder={queryError || 'Enter keywords...'}
              className="hoam-text-field"
              data-valid={queryError ? 'false' : 'true'}
              aria-invalid={queryError ? 'true' : 'false'}
              disabled={loading}
            />
          )}
        />

        <Button
          type="submit"
          className="hoam-search-form__button"
          variant="secondary"
          disabled={loading}
        >
          Search
        </Button>
      </form>
    </div>
  );
}

export default SearchForm;
