import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { useState } from "react";
import { IRelease } from "../../lib/contracts";
import { CloseIconButton } from "../atoms/close-icon-button";
import { GridContainer } from "../atoms/grid-container";
import { GridItem } from "../atoms/grid-item";
import { Reveal } from "../atoms/reveal-animation";
import { ReleaseArtworkCard, ReleaseCard } from "../molecules/release-card";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer - 1,
  },

  cardWrapperSelected: {
    width: "100vw",
    maxWidth: "480px",

    zIndex: theme.zIndex.modal,
    position: "absolute",
    top: 0,
    [theme.breakpoints.down("xs")]: {
      left: 0,
    },
  },
}));

export const ReleaseCardGrid = (props: { releases: IRelease[] }) => {
  const { releases } = props;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected =
    releases.find((release) => release.id === selectedId) ?? null;

  const classes = useStyles();

  return (
    <AnimateSharedLayout type="crossfade">
      <GridContainer>
        {releases.map((release) => (
          <GridItem
            layoutId={release.id}
            key={release.id}
            onClick={() => {
              setSelectedId(release.id);
            }}
            clickable
          >
            <Reveal>
              <ReleaseArtworkCard release={release} />
            </Reveal>
          </GridItem>
        ))}
      </GridContainer>

      <Backdrop
        className={classes.backdrop}
        open={Boolean(selected)}
        onClick={() => {
          setSelectedId(null);
        }}
      >
        <AnimatePresence>
          {selected && (
            <motion.div
              layoutId={selected.id}
              className={classes.cardWrapperSelected}
            >
              <ReleaseCard
                release={selected}
                CardHeaderProps={{
                  action: (
                    <CloseIconButton
                      onClick={() => {
                        setSelectedId(null);
                      }}
                    />
                  ),
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Backdrop>
    </AnimateSharedLayout>
  );
};