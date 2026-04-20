import { useMemo } from 'react';
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

function createSearchFormSchema(requiredMessage: string) {
  return z.object({
    q: z.string().trim().min(1, { message: requiredMessage }),
  });
}

export type SearchFormSchemaType = z.infer<ReturnType<typeof createSearchFormSchema>>;

export type SearchFormResult = {
  /** Optional stable identifier for the result item. */
  id?: number;
  /** Result title shown in the list. */
  title: string;
  /** Destination opened by the result action. */
  url: string;
  /** Short preview text shown under the result title. */
  preview: string;
};

export type SearchFormProps = {
  /** Called when the close action is triggered. */
  onClose: () => void;
  /** Submit handler for the search query form. */
  onSubmit: SubmitHandler<SearchFormSchemaType>;
  /** Disables the form while results are loading. */
  loading: boolean;
  /** Optional override for the submit button and input label text. */
  submitLabel?: string;
  /** Optional override for the search input placeholder text. */
  placeholderText?: string;
};

export type SearchResultsProps = {
  /** Search results rendered in the list. */
  items: SearchFormResult[];
};

export function SearchResult({ title, url, preview }: Readonly<SearchFormResult>) {
  const t = useMessages('searchForm');

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
          {t.readMore}
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
  const t = useMessages('searchForm');

  if (items.length === 0) {
    return (
      <div className={styles.message}>
        <p>{t.noResults}</p>
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
  const searchFormSchema = useMemo(() => createSearchFormSchema(t.required), [t.required]);

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
    resolver: zodResolver(searchFormSchema),
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
