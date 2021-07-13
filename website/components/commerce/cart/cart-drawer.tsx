import { CardActionArea, CloseIconButton } from "@components/generic";
import { routes, useAppEventEmitter } from "@components/top-level";
import {
  CartItemQuantity,
  cartToSubtotal,
  CART_ITEM_QUANTITY_UPPER_BOUND,
  formatPrice,
  ICart,
} from "@data-access";
import Box from "@material-ui/core/Box";
import Fade from "@material-ui/core/Fade";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import { useBreakpointDown, useEventEmitter } from "@utility";
import React, { useState } from "react";
import {
  useCartQuery,
  useRemoveCartItems,
  useUpdateCartItems,
} from "./cart-state";
import { CartItemActions } from "./cart-item-actions";
import { CartItemInfo } from "./cart-item-info";
import { CheckoutButton } from "./checkout-button";
import { useTheme } from "@material-ui/core";

const CartEmpty = () => {
  return (
    <Box
      sx={{
        paddingY: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h5"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        Your cart is empty.
      </Typography>
    </Box>
  );
};

const CartLoading = () => {
  return (
    <Box
      sx={{
        paddingY: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <CircularProgress color="inherit" />
    </Box>
  );
};

const CartLoaded = ({ cart }: { cart: ICart }) => {
  const removeCartItems = useRemoveCartItems({ cart });
  const updateCartItems = useUpdateCartItems({ cart });

  const isCartUpdating =
    updateCartItems.status === "loading" ||
    removeCartItems.status === "loading";

  const theme = useTheme();

  return (
    <Box
      sx={{
        paddingY: 1,
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <Fade in={isCartUpdating}>
        <Box
          sx={{
            zIndex: 2,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        >
          <CircularProgress />
        </Box>
      </Fade>

      <Box sx={{ p: 2 }}>
        {cart.items.map((cartItem) => (
          <Box
            key={cartItem.cartItemId}
            sx={{
              paddingBottom: 1,
            }}
          >
            <CardActionArea href={routes.singleProduct(cartItem)}>
              <CartItemInfo cartItem={cartItem} />
            </CardActionArea>

            <CartItemActions
              disabled={isCartUpdating}
              onRemove={() => {
                removeCartItems.mutate([cartItem.cartItemId]);
              }}
              onDecrement={() => {
                updateCartItems.mutateAsync([
                  {
                    cartItemId: cartItem.cartItemId,
                    quantity: CartItemQuantity(cartItem.quantity - 1),
                  },
                ]);
              }}
              onIncrement={() => {
                updateCartItems.mutateAsync([
                  {
                    cartItemId: cartItem.cartItemId,
                    quantity: CartItemQuantity(cartItem.quantity + 1),
                  },
                ]);
              }}
            />

            <Divider />
          </Box>
        ))}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingY: 1,
          }}
        >
          <Typography>Subtotal</Typography>

          <Typography>{formatPrice(cartToSubtotal(cart))}</Typography>
        </Box>

        <Typography variant="body2" color="textSecondary" align="center">
          Shipping, taxes, and discount codes calculated at checkout.
        </Typography>

        <CheckoutButton
          checkoutUrl={cart.checkoutUrl}
          disabled={cart.items.length === 0}
        />
      </Box>
    </Box>
  );
};

export const CartDrawer = () => {
  const [state, setState] = useState<"closed" | "opened">("closed");

  const appEventEmitter = useAppEventEmitter();

  useEventEmitter(appEventEmitter, {
    "open-cart": () => {
      setState("opened");
    },
    "close-cart": () => {
      setState("closed");
    },
    "route-changed-completed": () => {
      setState("closed");
    },
  });

  const handleClose = () => {
    appEventEmitter.emit("close-cart", {});
  };

  const breakpointDown = useBreakpointDown();

  const cartQuery = useCartQuery();

  return (
    <Drawer
      open={state === "opened"}
      onClose={handleClose}
      anchor={breakpointDown === "sm" ? "bottom" : "right"}
    >
      <Box
        sx={{
          margin: "0 auto",
          maxWidth: "100%",
          width: "480px",
          height: "100%",
          maxHeight: "100%",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 1,
          }}
        >
          <Typography variant="h3">Your Shopping Cart</Typography>
          <CloseIconButton onClick={handleClose} />
        </Box>

        {!cartQuery.data && <CartLoading />}
        {cartQuery.data && cartQuery.data.items.length === 0 && <CartEmpty />}
        {cartQuery.data && cartQuery.data.items.length > 0 && (
          <CartLoaded cart={cartQuery.data} />
        )}
      </Box>
    </Drawer>
  );
};