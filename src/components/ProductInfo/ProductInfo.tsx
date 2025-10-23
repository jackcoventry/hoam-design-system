import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@/components/Button/Button';
import QuantitySelector from '@/components/QuantitySelector/QuantitySelector';
import VariantSelector from '@/components/VariantSelector/VariantSelector';
import { Select } from '../Form/Select/Select';
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
  tshirt: string;
  quantity: number;
}

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

const tshirtOptions = [
  {
    label: 'Small',
    value: 'm-s',
    displayValue: 'Small',
    category: 'Men',
  },
  {
    label: 'Medium',
    value: 'm-m',
    displayValue: 'Medium',
    category: 'Men',
  },
  {
    label: 'Large',
    value: 'm-l',
    displayValue: 'Large',
    category: 'Men',
  },
  {
    label: 'Small',
    value: 'w-s',
    displayValue: 'Small',
    category: 'Women',
  },
  {
    label: 'Medium',
    value: 'w-m',
    displayValue: 'Medium - Out of Stock',
    category: 'Women',
    disabled: true,
  },
  {
    label: 'Large',
    value: 'l-m',
    displayValue: 'Large',
    category: 'Women',
  },
];

const tshirtOptionsByCategory = Object.values(
  tshirtOptions.reduce(
    (acc, option) => {
      if (!acc[option.category]) {
        acc[option.category] = { name: option.category, options: [] };
      }
      acc[option.category].options.push(option);
      return acc;
    },
    {} as Record<string, { name: string; options: typeof tshirtOptions }>
  )
);

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
      color: colorOptions[0].value,
      size: sizeOptions[0].value,
      image: imageOptions[0].value,
      tshirt: 'm-s',
      quantity: 1,
    },
    mode: 'all',
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
  };

  return (
    <div className="hoam-product-info">
      <h1 className="hoam-product-info__title">{title}</h1>
      {description && <p className="hoam-product-info__description">{description}</p>}

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

        <Controller
          name="tshirt"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              label="T-Shirt Size"
              {...field}
            >
              <Select.Placeholder>Select size</Select.Placeholder>
              {tshirtOptionsByCategory?.map((category) => (
                <Select.OptGroup
                  key={category.name}
                  label={category.name}
                >
                  {category.options.map((option) => (
                    <Select.Option
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.displayValue}
                    </Select.Option>
                  ))}
                </Select.OptGroup>
              ))}
            </Select>
          )}
        />

        {errors?.tshirt?.type === 'required' && <p role="alert">This is required</p>}

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
