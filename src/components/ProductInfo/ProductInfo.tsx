import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import Accordion, { AccordionItem } from '@/components/Accordion/Accordion';
import { Button } from '@/components/Button/Button';
import FieldWrapper from '@/components/Form/FieldWrapper/FieldWrapper';
import { Select } from '@/components/Form/Select/Select';
import QuantitySelector from '@/components/QuantitySelector/QuantitySelector';
import VariantSelector from '@/components/VariantSelector/VariantSelector';

import './ProductInfo.css';

type ProductOption = {
  label: string;
  value: string;
  displayValue: string;
  category?: string;
  disabled?: boolean;
};

type ProductInfoProps = {
  title: string;
  description?: string;
  productId: string;
  price: { amount: number; saleAmount: number; currency: string };
  inStock: boolean;
  data: {
    options: {
      color: ProductOption[];
      size: ProductOption[];
      image: ProductOption[];
      tshirt: ProductOption[];
    };
  };
};

interface IFormInput {
  color: string;
  size: string;
  tshirt: string;
  quantity: number;
}

function ProductInfo({
  title,
  description,
  productId,
  inStock,
  price,
  data,
}: Readonly<ProductInfoProps>) {
  const colorOptions = data.options.color;
  const sizeOptions = data.options.size;
  const imageOptions = data.options.image;
  const tshirtOptions = data.options.tshirt;
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

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({
    defaultValues: {
      color: colorOptions[0].value,
      size: sizeOptions[0].value,
      image: imageOptions[0].value,
      tshirt: data.options.tshirt[0].value,
      quantity: 1,
    },
    mode: 'all',
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
  };

  const priceString = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: price.currency,
  }).format(price.amount);

  const salePriceString = price.saleAmount
    ? new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: price.currency,
      }).format(price.saleAmount)
    : undefined;

  return (
    <div className="hoam-product-info">
      <div className="hoam-product-info__content">
        <h1 className="hoam-product-info__title">{title}</h1>
        <h2 className="hoam-product-info__price">
          {salePriceString ? (
            <>
              {salePriceString}{' '}
              <span className="hoam-product-info__price-previous">{priceString}</span>
            </>
          ) : (
            priceString
          )}
        </h2>
        {description && <p className="hoam-product-info__description">{description}</p>}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="hoam-form"
      >
        <FieldWrapper error={errors?.color?.type === 'required' ? 'This is required' : undefined}>
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
        </FieldWrapper>

        <FieldWrapper error={errors?.size?.type === 'required' ? 'This is required' : undefined}>
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
        </FieldWrapper>

        <FieldWrapper error={errors?.image?.type === 'required' ? 'This is required' : undefined}>
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
        </FieldWrapper>

        <FieldWrapper error={errors?.tshirt?.type === 'required' ? 'This is required' : undefined}>
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
        </FieldWrapper>

        <div className="hoam-form__controls">
          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <QuantitySelector
                {...field}
                max={13}
                ariaLabel="Quantity"
              />
            )}
          />
          <Button
            type="submit"
            disabled={!inStock}
            className="hoam-form__submit"
          >
            Add to cart
          </Button>
        </div>
      </form>

      <div className="hoam-product-info__information | mt-2xl">
        <Accordion defaultOpenIds={['one']}>
          <AccordionItem id="one">
            <div>
              <strong>Description</strong>
            </div>
            <div>
              <div className="body-text">
                <p>
                  Ut minim mollit officia ad adipiscing velit duis duis fugiat. Reprehenderit
                  voluptate dolore laboris esse in adipiscing adipiscing voluptate anim laboris qui
                  reprehenderit eiusmod eiusmod incididunt occaecat excepteur mollit. Ad labore
                  irure amet sit aliquip veniam pariatur veniam laboris nostrud nulla ullamco.
                  Adipiscing veniam dolore cupidatat qui ad exercitation elit labore velit et
                  aliquip adipiscing occaecat fugiat consequat esse sint nulla ea. Excepteur anim
                  cillum culpa ullamco labore commodo veniam ut dolor excepteur irure duis voluptate
                  proident ex in velit qui anim.
                </p>
              </div>
            </div>
          </AccordionItem>
          <AccordionItem id="two">
            <div>
              <strong>Returns Policy</strong>
            </div>
            <div>
              <div className="body-text">
                <p>
                  Fugiat esse consequat ad aliquip amet aliquip sed sit voluptate. Enim est culpa
                  labore pariatur aliquip culpa mollit excepteur officia ea magna. Mollit ipsum nisi
                  mollit minim laboris labore sunt et dolore ullamco reprehenderit. Dolor est velit
                  adipiscing commodo nisi deserunt commodo ad cillum amet veniam in ea ut incididunt
                  esse cupidatat eiusmod. Et ullamco aute elit tempor cillum id aliqua aute magna
                  irure sit. Ex cillum sint incididunt sit adipiscing commodo labore duis nulla
                  laborum dolor laborum. Aliqua do proident laborum in reprehenderit commodo ut
                  adipiscing sunt.
                </p>
              </div>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

export default ProductInfo;
