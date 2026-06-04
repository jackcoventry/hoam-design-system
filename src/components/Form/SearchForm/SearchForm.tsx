import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod/mini';

import { Button } from '@/components/Button';
import { Stack } from '@/components/Layout';
import { Spinner } from '@/components/Loading';
import { useMessages } from '@/hooks/useMessages';

import formStyles from '@/components/Form/Form.module.css';
import styles from '@/components/Form/SearchForm/SearchForm.module.css';
import utils from '@/styles/Util.module.css';

function createSearchFormSchema(requiredMessage: string) {
  return z.object({
    q: z.string().check(z.trim(), z.minLength(1, requiredMessage)),
  });
}

export type SearchFormSchemaType = z.infer<ReturnType<typeof createSearchFormSchema>>;

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
  /** Shows a focus-only close button for standalone modal compositions. */
  showCloseButton?: boolean;
  /** Optional class applied to the search form wrapper. */
  className?: string;
};

export function SearchLoader() {
  return (
    <div className={styles.loader}>
      <Spinner />
    </div>
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
    showCloseButton = true,
    className,
  } = props;

  const {
    register,
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
  const queryErrorId = queryError ? `${inputId}-error` : undefined;

  return (
    <div className={clsx(styles.wrapper, className)}>
      <Stack>
        {showCloseButton ? (
          <Button
            className={clsx(styles.srClose, utils.focusableOnly)}
            onClick={onClose}
          >
            {tModal.close}
          </Button>
        ) : null}
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

          <input
            {...register('q')}
            id={inputId}
            type="search"
            placeholder={queryError || placeholderText}
            data-valid={queryError ? 'false' : 'true'}
            aria-invalid={queryError ? 'true' : 'false'}
            aria-describedby={queryErrorId}
            disabled={loading}
            className={formStyles.textField}
          />

          {queryError ? (
            <p
              id={queryErrorId}
              role="alert"
              className={formStyles.error}
            >
              {queryError}
            </p>
          ) : null}

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
