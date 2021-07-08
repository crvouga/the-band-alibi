import Box from "@material-ui/core/Box";
import { Image } from "@components/generic";
import Link from "next/link";
import React from "react";
import { routes } from "../../top-level";
import { useQuerySettings } from "@data-access";

const Logo = ({
  src,
  aspectRatio,
  alt,
  href,
}: {
  href: string;
  src: string;
  alt: string;
  aspectRatio: number;
}) => {
  return (
    <Link href={href}>
      <Box sx={{ width: "7em" }}>
        <Image priority src={src} aspectRatio={aspectRatio} alt={alt} />
      </Box>
    </Link>
  );
};

export const AppLogo = () => {
  const settingsQuery = useQuerySettings();

  if (!settingsQuery.data) {
    return null;
  }

  const settings = settingsQuery.data;

  return (
    <Logo
      href={routes.landing()}
      src={settings.band.logo.url}
      aspectRatio={settings.band.logo.metadata.dimensions.aspectRatio}
      alt={settings.band.name}
    />
  );
};
