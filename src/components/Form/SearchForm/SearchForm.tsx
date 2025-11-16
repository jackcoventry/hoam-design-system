import { Button } from '@/components/Button/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';

const SearchFormSchema = z.object({
  q: z.string(),
});

type SearchFormSchemaType = z.infer<typeof SearchFormSchema>;

function SearchForm() {
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

  const [submitting, setSubmitting] = useState<boolean>(false);

  const onSubmit: SubmitHandler<SearchFormSchemaType> = (data) => {
    setSubmitting(true);

    // TODO: temporary, to mimic server response.
    setTimeout(() => {
      setSubmitting(false);
    }, 2000);
  };
  return (
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
            className="hoam-search-form__input"
            data-valid={errors?.q ? 'false' : 'true'}
            disabled={submitting}
          />
        )}
      />

      <Button
        type="submit"
        className="hoam-search-form__button"
        variant="secondary"
      >
        {submitting ? 'Searching...' : 'Search'}
      </Button>
    </form>
  );
}

export default SearchForm;
