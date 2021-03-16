import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useState, useMemo } from "react";
import { useQuery } from "react-query";
import { dataStore } from "../../lib/data-access/data-store";
import { ISettings, IVideo } from "../../lib/data-access";
import { ITag } from "../../lib/data-access/tag";
import { DocumentTitle } from "../app/meta";
import { PageLayout } from "../app/layout";
import { TagChipGroup } from "../tag/tag-chip";
import { VideoCardGrid, VideoCardGridSkeleton } from "../video/video-card-grid";
import { useVideoState } from "../video/video-state";
import { descend } from "../../lib/utility";
import { useMediaQuery } from "@material-ui/core";

export type IVideoGalleryProps = {
  initialVideos: IVideo[];
  tags: ITag[];
  settings: ISettings;
};

const useStyles = makeStyles((theme) => ({
  tagGroup: {
    padding: theme.spacing(2, 0),
    paddingLeft: theme.spacing(2),
  },
  tagChipGroupBar: {
    [theme.breakpoints.down("xs")]: {
      zIndex: theme.zIndex.appBar,
      backgroundColor: theme.palette.background.default,
      position: "sticky",
      top: 0,
    },
  },
}));

export const VideoGallery = (props: IVideoGalleryProps) => {
  const { initialVideos, tags, settings } = props;

  const classes = useStyles();

  const videoState = useVideoState();

  const sortedTags = useMemo(
    () => tags.sort(descend((tag) => tag.videoCount)),
    [tags.length]
  );

  const [selectedTag, setSelectedTag] = useState<ITag | null>(null);

  const query = useQuery(String(selectedTag?.slug), () => {
    if (selectedTag) {
      return dataStore.video.getAllByTagSlug(selectedTag.slug);
    } else {
      return initialVideos;
    }
  });

  const videos = query.data ?? initialVideos;

  const handleTagClick = (tag: ITag) => {
    window.scrollTo({ top: 0 });
    setSelectedTag((selectedTag) =>
      tag.slug === selectedTag?.slug ? null : tag
    );
  };

  const videoCardSkeletonCount = Math.min(
    selectedTag?.videoCount ?? initialVideos.length,
    6
  );

  const isSmallScreen = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.down("xs")
  );

  return (
    <PageLayout
      title={DocumentTitle(settings.band.name, "Video")}
      settings={settings}
    >
      <Container>
        <Box paddingTop={2}>
          <Typography variant="h1">Videos</Typography>
        </Box>
      </Container>

      <Container className={classes.tagChipGroupBar} disableGutters>
        <TagChipGroup
          wrap={!isSmallScreen}
          className={classes.tagGroup}
          onClick={handleTagClick}
          selected={selectedTag ? [selectedTag] : []}
          tags={sortedTags}
        />
      </Container>

      <Container>
        {query.isLoading ? (
          <VideoCardGridSkeleton count={videoCardSkeletonCount} />
        ) : (
          <VideoCardGrid onClick={videoState.openVideo} videos={videos} />
        )}
      </Container>
    </PageLayout>
  );
};
