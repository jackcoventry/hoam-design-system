import { Button } from '@/components/Button/Button';
import '@/components/Common/Loader.css';
import styles from '@/components/Form/SearchForm/SearchForm.module.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';

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

export type SearchFormProps = {
  onSubmit: SubmitHandler<SearchFormSchemaType>;
  loading: boolean;
};

export type SearchResultsProps = {
  items: SearchFormResult[];
};

export function SearchResult({ title, url, preview }: Readonly<SearchFormResult>) {
  return (
    <div className={styles.result}>
      <h4 className={styles.resultTitle}>{title}</h4>
      <p className={styles.resultPreview}>{preview}</p>
      <a
        href={url}
        className={styles.resultLink}
      >
        Read more
      </a>
    </div>
  );
}

export function SearchLoader() {
  // TODO: Address utilty classes like hoam-loader
  return (
    <div className={styles.loader}>
      <span className="hoam-loader" />
    </div>
  );
}

export function SearchResults({ items }: Readonly<SearchResultsProps>) {
  if (items.length === 0) {
    return (
      <div className={styles.message}>
        <p>No results!</p>
      </div>
    );
  }

  return (
    <ol className={styles.results}>
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

export function SearchForm({ onSubmit, loading }: Readonly<SearchFormProps>) {
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
    <div className={styles.wrapper}>
      <form
        className={styles.root}
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event);
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
          className={styles.button}
          variant="secondary"
          disabled={loading}
        >
          Search
        </Button>
      </form>
    </div>
  );
}
