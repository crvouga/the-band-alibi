import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { ISettings } from "@data-access";
import { IProduct } from "@data-access";
import { PageWrapper } from "../../top-level";

export type IProductProps = {
  settings: ISettings;
  products: IProduct[];
};

export const Product = (props: IProductProps) => {
  const { settings } = props;

  return (
    <PageWrapper pageTitle={["Store", "Products"]} settings={settings}>
      <Container>
        <Box paddingY={2}>
          <Typography variant="h1">Products</Typography>
        </Box>
      </Container>
    </PageWrapper>
  );
};