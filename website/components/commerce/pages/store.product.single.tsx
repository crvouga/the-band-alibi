import { IProduct, IProductVariant, ISettings, useUiState } from "@data-access";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { HorizontalList, HorizontalListItem, Image } from "@components/generic";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import { toLongestCommonPrefix } from "utility";
import { PageWrapper } from "../../top-level";
import { useShoppingCartState } from "../shopping-cart/shopping-cart-state";
import { ProductVariantCard } from "../cards";

export type IProductSingle = {
  settings: ISettings;
  product: IProduct;
};

export const ProductSingle = (props: IProductSingle) => {
  const { settings, product } = props;

  const router = useRouter();

  const [
    selectedVariant,
    setSelectedVariant,
  ] = useState<IProductVariant | null>(null);

  const shoppingCartState = useShoppingCartState();

  const uiState = useUiState();

  const handleAddToCart = () => {
    if (selectedVariant) {
      shoppingCartState.addItem({
        variant: selectedVariant,
      });
      uiState.setState("shopping-cart-opened");
    }
  };

  return (
    <PageWrapper
      pageTitle={["Store", product.name]}
      settings={settings}
      hideFooter
    >
      <Container maxWidth="md" disableGutters>
        <Box p={2}>
          <Typography variant="h2" gutterBottom>
            {product.name}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              {/* <Image aspectRatio={1} src={src} alt={alt} /> */}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="h2">Variants</Typography>

              <HorizontalList>
                {/* {productInfo.variants.map((variant) => (
                  <HorizontalListItem key={variant.id}>
                    <ProductVariantCard
                      selected={variant.id === selectedVariant?.id}
                      title={variant.name.replace(longestCommonPrefix, "")}
                      subtitle={`${variant.retailPrice} ${variant.currency}`}
                      image={variant.product.image}
                      onClick={() => {
                        setSelectedVariant(variant);
                      }}
                    />
                  </HorizontalListItem>
                ))} */}
              </HorizontalList>

              <Box paddingY={2}>
                <Button
                  color="primary"
                  disabled={!selectedVariant}
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<MdAddShoppingCart />}
                  onClick={handleAddToCart}
                >
                  Add To Cart
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </PageWrapper>
  );
};