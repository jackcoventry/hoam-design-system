import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@/components/Button/Button';
import QuantitySelector from '@/components/QuantitySelector/QuantitySelector';
import VariantSelector from '@/components/VariantSelector/VariantSelector';
import './ProductInfo.css';

type ProductInfoProps = {
  title: string;
  description?: string;
  productId: string;
  footnote: string;
  inStock: boolean;
};

interface IFormInput {
  color: string;
  size: string;
  quantity: number;
}

function ProductInfo({
  title,
  description,
  productId,
  footnote,
  inStock,
}: Readonly<ProductInfoProps>) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({
    defaultValues: {
      color: '',
      size: '',
      image: '',
      quantity: 1,
    },
    mode: 'all',
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
  };

  const colorOptions = [
    // TODO: move this
    { label: 'Red', value: 'red', displayValue: '#ff0000' },
    { label: 'Yellow', value: 'yellow', displayValue: '#ffff00' },
    { label: 'Green', value: 'green', displayValue: '#067c0eff' },
  ];

  const sizeOptions = [
    // TODO: move this
    { label: 'Small', value: 'small', displayValue: 'Small' },
    { label: 'Medium', value: 'medium', displayValue: 'Medium' },
    { label: 'Large', value: 'large', displayValue: 'Large' },
  ];

  const imageOptions = [
    // TODO: move this
    {
      label: 'Style 1',
      value: 'style1',
      displayValue: 'https://placehold.co/48x4?text=Vitamin+A+Supplement',
    },
    {
      label: 'Style 2',
      value: 'style2',
      displayValue: 'https://placehold.co/48x4?text=Vitamin+B+Supplement',
    },
    {
      label: 'Style 3',
      value: 'style3',
      displayValue: 'https://placehold.co/48x4?text=Vitamin+C+Supplement',
    },
  ];

  return (
    <div className="hoam-product-info">
      <h1 className="hoam-product-info__title">{title}</h1>
      {description && <p className="hoam-product-info__description">{description}</p>}

      {/* TODO: Use form for add to cart + controls */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="color"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <VariantSelector
              {...field}
              label="Color"
              name="color"
              options={colorOptions}
              variant="color"
            />
          )}
        />
        {errors?.color?.type === 'required' && <p role="alert">This is required</p>}

        <Controller
          name="size"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <VariantSelector
              {...field}
              label="Size"
              name="size"
              options={sizeOptions}
              variant="label"
            />
          )}
        />
        {errors?.size?.type === 'required' && <p role="alert">This is required</p>}

        <Controller
          name="image"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <VariantSelector
              {...field}
              label="Image"
              name="image"
              options={imageOptions}
              variant="image"
              orientation="horizontal"
            />
          )}
        />
        {errors?.image?.type === 'required' && <p role="alert">This is required</p>}

        <Controller
          name="quantity"
          control={control}
          render={({ field }) => (
            <>
              <label htmlFor="color">Quantity</label>
              <QuantitySelector
                {...field}
                max={13}
              />
            </>
          )}
        />
        <Button
          type="submit"
          disabled={!inStock}
        >
          Add to cart
        </Button>
      </form>
    </div>
  );
}

export default ProductInfo;
