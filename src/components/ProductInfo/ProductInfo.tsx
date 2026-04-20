import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from '@/components/Accordion';
import { BadgeList, BadgeListItem } from '@/components/BadgeList';
import { Button } from '@/components/Button';
import { BodyText } from '@/components/Common/BodyText';
import { FieldWrapper, Select } from '@/components/Form';
import { Section, Stack } from '@/components/Layout';
import { VariantSelector } from '@/components/VariantSelector';
import { useCurrency } from '@/hooks/useCurrency';
import { useMessages } from '@/hooks/useMessages';
import { logger } from '@/utils/logger';

import styles from '@/components/ProductInfo/ProductInfo.module.css';

const ProductInformationSchema = z.record(z.string(), z.string());

export type ProductInformationSchemaType = z.infer<typeof ProductInformationSchema>;

export type ProductOption = {
  /** Human-readable option label. */
  label: string;
  /** Submitted value for the option. */
  value: string;
  /** Optional display-only value, used for swatches, images, or alternate labels. */
  displayValue?: string;
  /** Optional category label used to group select options. */
  category?: string;
  /** Prevents the option from being selected. */
  disabled?: boolean;
};

export type ProductOptionGroup = {
  /** Stable identifier used as the submitted field name. */
  id: string;
  /** Visible field label shown to customers. */
  label: string;
  /** Input presentation used to render the option group. */
  input: 'color' | 'image' | 'label' | 'select';
  /** Available choices for the group. */
  options: ProductOption[];
};

type MoreInformationItem = {
  id: string;
  title: string;
  text: string;
};

export type ProductInfoProps = {
  /** Product title shown above pricing and options. */
  title: string;
  /** Optional supporting description for the product. */
  description?: string | undefined;
  /** Stable product identifier used by consuming applications. */
  productId: string;
  /** Current and comparison pricing for the product. */
  price: { amount: number; saleAmount: number };
  /** Disables purchase actions when the product cannot be bought. */
  inStock: boolean;
  /** Shows the "new" product badge. */
  newItem: boolean;
  /** Shows the low-stock badge. */
  lowStock: boolean;
  /** Content-driven option groups and accordion content. */
  data: {
    options: ProductOptionGroup[];
    moreInformation: MoreInformationItem[];
  };
  /** Called with the selected option values when the form is submitted. */
  onSubmit: (args: ProductInformationSchemaType) => void;
  /** Shows a submitting state on the call-to-action button. */
  isSubmitting: boolean;
};

function getDisplayValue(option: ProductOption) {
  return option.displayValue ?? option.label;
}

function getOptionsByCategory(options: ProductOption[]) {
  return Object.values(
    options.reduce(
      (acc, option) => {
        const category = option.category ?? 'Other';
        acc[category] ??= { name: category, options: [] };
        acc[category].options.push(option);
        return acc;
      },
      {} as Record<string, { name: string; options: ProductOption[] }>
    )
  );
}

export function ProductInfo({
  title,
  description,
  inStock,
  newItem,
  lowStock,
  price,
  data,
  onSubmit,
  isSubmitting = false,
}: Readonly<ProductInfoProps>) {
  const t = useMessages('productTile');
  const { formatCurrency } = useCurrency();
  const optionGroups = data.options;

  const defaultMoreInformation = data?.moreInformation?.[0];

  if (!defaultMoreInformation) {
    logger.error('More information requires at least one item.');
  }

  const hasInvalidOptionGroup =
    optionGroups.length === 0 || optionGroups.some((group) => group.options.length === 0);

  if (hasInvalidOptionGroup) {
    const message = 'ProductInfo requires at least one option for each configured option group.';
    logger.error(message);
    throw new Error(message);
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductInformationSchemaType>({
    resolver: zodResolver(ProductInformationSchema),
    defaultValues: Object.fromEntries(
      optionGroups.map((group) => [group.id, group.options[0]?.value ?? ''])
    ) as ProductInformationSchemaType,
    mode: 'all',
  });

  const priceString = formatCurrency(price.amount);
  const salePriceString = formatCurrency(price.saleAmount);

  return (
    <div className={styles.root}>
      <Stack>
        <div className={styles.content}>
          <Stack gap="sm">
            {newItem || lowStock ? (
              <BadgeList>
                {newItem && <BadgeListItem variant="default">{t.new}</BadgeListItem>}
                {lowStock && <BadgeListItem variant="alert">{t.lowStock}</BadgeListItem>}
              </BadgeList>
            ) : null}
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

            {description && <p className={styles.description}>{description}</p>}
          </Stack>
        </div>

        <Stack>
          <form
            onSubmit={(event) => {
              void handleSubmit(onSubmit)(event);
            }}
          >
            <Stack gap="lg">
              {optionGroups.map((group) => {
                const errorMessage = errors[group.id]?.message;
                const groupedOptions =
                  group.input === 'select' && group.options.some((option) => option.category)
                    ? getOptionsByCategory(group.options)
                    : null;

                return (
                  <FieldWrapper
                    key={group.id}
                    error={typeof errorMessage === 'string' ? errorMessage : undefined}
                  >
                    <Controller
                      name={group.id}
                      control={control}
                      render={({ field }) => {
                        const fieldValue = typeof field.value === 'string' ? field.value : '';

                        return group.input === 'select' ? (
                          <Select
                            ref={field.ref}
                            label={group.label}
                            name={field.name}
                            value={fieldValue}
                            onBlur={field.onBlur}
                            onChange={(value) => field.onChange(value)}
                          >
                            {groupedOptions
                              ? groupedOptions.map((category) => (
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
                                        {getDisplayValue(option)}
                                      </Select.Option>
                                    ))}
                                  </Select.OptGroup>
                                ))
                              : group.options.map((option) => (
                                  <Select.Option
                                    key={option.value}
                                    value={option.value}
                                    disabled={option.disabled}
                                  >
                                    {getDisplayValue(option)}
                                  </Select.Option>
                                ))}
                          </Select>
                        ) : (
                          <VariantSelector
                            ref={field.ref}
                            label={group.label}
                            name={group.id}
                            options={group.options.map((option) => ({
                              ...option,
                              displayValue: getDisplayValue(option),
                            }))}
                            value={fieldValue}
                            onChange={(value) => field.onChange(String(value))}
                            variant={group.input}
                          />
                        );
                      }}
                    />
                  </FieldWrapper>
                );
              })}

              <Button
                type="submit"
                disabled={!inStock || isSubmitting}
                className={styles.button}
              >
                {isSubmitting ? t.addedToCart : t.addToCart}
              </Button>
            </Stack>
          </form>
        </Stack>

        <Section>
          <div className={styles.information}>
            <Accordion defaultOpenIds={defaultMoreInformation ? [defaultMoreInformation.id] : []}>
              {data?.moreInformation?.map((item) => (
                <AccordionItem
                  key={item.id}
                  id={item.id}
                >
                  <AccordionHeader>
                    <strong>{item.title}</strong>
                  </AccordionHeader>
                  <AccordionPanel>
                    <BodyText>
                      <p>{item.text}</p>
                    </BodyText>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Section>
      </Stack>
    </div>
  );
}
