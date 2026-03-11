import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  BadgeList,
  BadgeListItem,
  Button,
  FieldWrapper,
  QuantitySelector,
  Select,
  VariantSelector,
} from '@/components';

import styles from '@/components/ProductInfo/ProductInfo.module.css';
import { convertNumberToCurrency } from '@/utils/convertNumberToCurrency';
import clsx from 'clsx';

const ProductInformationSchema = z.object({
  color: z.string(),
  size: z.string(),
  tshirt: z.string(),
  image: z.string(),
  quantity: z.number().min(1),
});

type ProductInformationSchemaType = z.infer<typeof ProductInformationSchema>;

type ProductOption = {
  label: string;
  value: string;
  displayValue: string;
  category?: string;
  disabled?: boolean;
};

export type ProductInfoProps = {
  title: string;
  description?: string;
  productId: string;
  price: { amount: number; saleAmount: number; currency: string };
  inStock: boolean;
  newItem: boolean;
  lowStock: boolean;
  data: {
    options: {
      color: ProductOption[];
      size: ProductOption[];
      image: ProductOption[];
      tshirt: ProductOption[];
    };
  };
};

export function ProductInfo({
  title,
  description,
  inStock,
  newItem,
  lowStock,
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
        const category = option.category ?? 'Other';
        acc[category] ??= { name: category, options: [] };
        acc[category].options.push(option);
        return acc;
      },
      {} as Record<string, { name: string; options: ProductOption[] }>
    )
  );

  const defaultColor = colorOptions[0];
  const defaultSize = sizeOptions[0];
  const defaultImage = imageOptions[0];
  const defaultTshirt = tshirtOptions[0];

  if (!defaultColor || !defaultSize || !defaultImage || !defaultTshirt) {
    throw new Error('ProductInfo requires at least one option for color, size, image, and tshirt.');
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductInformationSchemaType>({
    resolver: zodResolver(ProductInformationSchema),
    defaultValues: {
      color: defaultColor.value,
      size: defaultSize.value,
      image: defaultImage.value,
      tshirt: defaultTshirt.value,
      quantity: 1,
    },
    mode: 'all',
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  const onSubmit: SubmitHandler<ProductInformationSchemaType> = (data) => {
    console.log(data);
    setSubmitting(true);

    // TODO: temporary, to mimic server response.
    setTimeout(() => {
      setSubmitting(false);
    }, 2000);
  };

  const priceString = convertNumberToCurrency({ value: price.amount, currency: price.currency });
  const salePriceString = convertNumberToCurrency({
    value: price.saleAmount,
    currency: price.currency,
  });

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <h2 className={styles.price}>
          {salePriceString ? (
            <>
              {salePriceString} <span className={styles.pricePrevious}>{priceString}</span>
            </>
          ) : (
            priceString
          )}
        </h2>
        {newItem || lowStock ? (
          <BadgeList>{newItem && <BadgeListItem>NEW</BadgeListItem>}</BadgeList>
        ) : null}

        {description && <p className={styles.description}>{description}</p>}
      </div>

      <form
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event);
        }}
      >
        <FieldWrapper error={errors?.color?.message}>
          <Controller
            name="color"
            control={control}
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

        <FieldWrapper error={errors?.size?.message}>
          <Controller
            name="size"
            control={control}
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

        <FieldWrapper error={errors?.image?.message}>
          <Controller
            name="image"
            control={control}
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

        <FieldWrapper error={errors?.tshirt?.message}>
          <Controller
            name="tshirt"
            control={control}
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

        <div>
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
            disabled={!inStock || Boolean(errors?.quantity?.message) || submitting}
          >
            {submitting ? 'Added!' : 'Add to cart'}
          </Button>
        </div>
      </form>

      <div className={clsx(styles.information, 'mt-2xl')}>
        <Accordion defaultOpenIds={['one']}>
          <AccordionItem id="one">
            <AccordionHeader>
              <strong>Description</strong>
            </AccordionHeader>
            <AccordionPanel>
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
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem id="two">
            <AccordionHeader>
              <strong>Returns Policy</strong>
            </AccordionHeader>
            <AccordionPanel>
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
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
