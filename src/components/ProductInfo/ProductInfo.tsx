import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

import "./ProductInfo.css";
import VariantSelector from "@/components/VariantSelector/VariantSelector";

type ProductInfoProps = {
  title: string;
  productId: string;
  footnote: string;
  inStock: boolean;
};

interface IFormInput {
  color: string;
}

function ProductInfo({
  title,
  productId,
  footnote,
  inStock,
}: Readonly<ProductInfoProps>) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      color: "",
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
  };

  const options = [
    { label: "Red", value: "#ff0000", name: "color", type: "color" },
    { label: "Yellow", value: "#ffff00", name: "color", type: "color" },
    {
      label: "Vitamin D Supplement",
      value: "https://placehold.co/48x4?text=Vitamin+D+Supplement",
      name: "color",
      type: "image",
    },
    { label: "Green", value: "#067c0eff", name: "color", type: "color" },
  ];

  return (
    <div className="hoam-product-info">
      <h1 className="hoam-product-info__title">{title}</h1>
      {/* TODO: Use form for add to cart + controls */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="color"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <VariantSelector
              {...field}
              name="color"
              // onChange={onChange}
              // value={active}
              options={options}
            />
          )}
        />
        {errors?.color?.type === "required" && (
          <p role="alert">This is required</p>
        )}
        {/* <Controller
          name="iceCreamType"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={[
                { value: "chocolate", label: "Chocolate" },
                { value: "strawberry", label: "Strawberry" },
                { value: "vanilla", label: "Vanilla" },
              ]}
            />
          )}
        /> */}
        <input type="submit" />
      </form>
    </div>
  );
}

export default ProductInfo;
