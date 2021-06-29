import { equalBy, groupBy, uniqueBy } from "@utility";

type IImage = {
  src: string;
};

export type IPrice = {
  amount: string;
  currencyCode: string;
};

export type IProductOption = {
  name: string;
  value: string;
};

export type IProductVariant = {
  variantId: string;
  name: string;
  price: IPrice;
  image: IImage;
  selectedOptions: IProductOption[];
};

export type IProduct = {
  productId: string;
  name: string;
  descriptionHTML: string;
  thumbnail: IImage;
  images: IImage[];
  variants: IProductVariant[];
};

export type ICommerce = {
  products: {
    getOne: ({ productId }: { productId: string }) => Promise<IProduct>;
    getAll: () => Promise<IProduct[]>;
  };
};

export const productToOptionsByName = (
  product: IProduct
): { [name: string]: IProductOption[] } => {
  const allOptions = product.variants.flatMap(
    (variant) => variant.selectedOptions
  );

  const uniqueOptions = uniqueBy(
    (option) => `${option.name}${option.value}`,
    allOptions
  );

  const optionsByName = groupBy((option) => option.name, uniqueOptions);

  return optionsByName;
};

const isEqual = (option1: IProductOption, option2: IProductOption) => {
  return equalBy((option) => `${option.name}${option.value}`, option1, option2);
};

export const optionsToVariants = (
  product: IProduct,
  options: IProductOption[]
): IProductVariant[] => {
  const variants = product.variants.filter((variant) =>
    variant.selectedOptions.some((selectedOption) =>
      options.some((option) => isEqual(selectedOption, option))
    )
  );

  return variants;
};
