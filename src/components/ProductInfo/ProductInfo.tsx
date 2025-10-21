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
      quantity: 1,
    },
    mode: 'all',
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
  };

  const options = [
    { label: 'Red', value: '#ff0000', name: 'color', type: 'color' },
    { label: 'Yellow', value: '#ffff00', name: 'color', type: 'color' },
    {
      label: 'Vitamin D Supplement',
      value: 'https://placehold.co/48x4?text=Vitamin+D+Supplement',
      name: 'color',
      type: 'image',
    },
    { label: 'Green', value: '#067c0eff', name: 'color', type: 'color' },
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
            <>
              <label htmlFor="color">Variant</label>
              <VariantSelector
                {...field}
                name="color"
                options={options}
              />
            </>
          )}
        />
        {errors?.color?.type === 'required' && <p role="alert">This is required</p>}
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
