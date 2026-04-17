import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';

import { Button } from '@/components/Button';
import { Stack } from '@/components/Layout';
import { Spinner } from '@/components/Loading';
import { Pagination } from '@/components/Pagination';
import { useMessages } from '@/hooks/useMessages';

import formStyles from '@/components/Form/Form.module.css';
import styles from '@/components/Form/SearchForm/SearchForm.module.css';
import utils from '@/styles/Util.module.css';

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
  onClose: () => void;
  onSubmit: SubmitHandler<SearchFormSchemaType>;
  loading: boolean;
  submitLabel?: string;
  placeholderText?: string;
};

export type SearchResultsProps = {
  items: SearchFormResult[];
};

export function SearchResult({ title, url, preview }: Readonly<SearchFormResult>) {
  return (
    <div className={styles.result}>
      <Stack>
        <h4 className={styles.resultTitle}>{title}</h4>
        <p className={styles.resultPreview}>{preview}</p>
        <Button
          as="a"
          href={url}
          size="small"
          className={styles.resultButton}
        >
          Read more
        </Button>
      </Stack>
    </div>
  );
}

export function SearchLoader() {
  return (
    <div className={styles.loader}>
      <Spinner />
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
    <>
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
      <div className={styles.pagination}>
        <Pagination currentPage={1} />
      </div>
    </>
  );
}

export function SearchForm(props: Readonly<SearchFormProps>) {
  const tModal = useMessages('modal');
  const t = useMessages('searchForm');

  const {
    onClose,
    onSubmit,
    loading,
    submitLabel = t.submitLabel,
    placeholderText = t.placeholderText,
  } = props;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormSchemaType>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: {
      q: '',
    },
    mode: 'onSubmit',
  });

  const queryError = errors.q?.message;
  const inputId = 'hoam-search-form-input';

  return (
    <div className={styles.wrapper}>
      <Stack>
        <Button
          className={clsx(styles.srClose, utils.focusableOnly)}
          onClick={onClose}
        >
          {tModal.close}
        </Button>
        <form
          className={styles.root}
          onSubmit={(event) => {
            void handleSubmit(onSubmit)(event);
          }}
        >
          <label
            htmlFor={inputId}
            className={utils.srOnly}
          >
            {submitLabel}
          </label>

          <Controller
            name="q"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                id={inputId}
                type="search"
                placeholder={queryError || placeholderText}
                data-valid={queryError ? 'false' : 'true'}
                aria-invalid={queryError ? 'true' : 'false'}
                disabled={loading}
                className={formStyles.textField}
              />
            )}
          />

          <Button
            type="submit"
            className={styles.button}
            variant="secondary"
            disabled={loading}
          >
            {submitLabel}
          </Button>
        </form>
      </Stack>
    </div>
  );
}
