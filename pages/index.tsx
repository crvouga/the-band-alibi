import { GetStaticProps } from "next";
import { GalleryGrid } from "../components/gallery/gallery-grid";
import { PageLayout } from "../components/layout";
import {
  SectionHeader,
  SectionLayout,
} from "../components/layout/section-layout";
import { Meta } from "../components/meta";
import { ShowcaseSection } from "../components/showcase";
import { SocialMediaSection } from "../components/social-media/social-media-section";
import { VideoCardGrid } from "../components/videos/video-card-grid";
import { cms } from "../lib/cms";
import { IGallery, IShowcase, ISocialMedia, IVideo } from "../lib/contracts";
import { Container } from "@material-ui/core";

type IIndexProps = {
  showcases: IShowcase[];
  videos: IVideo[];
  socialMedia: ISocialMedia[];
  galleries: IGallery[];
};

export const getStaticProps: GetStaticProps<IIndexProps> = async () => {
  return {
    props: {
      showcases: await cms.getShowcases(),
      videos: await cms.getVideos(),
      socialMedia: await cms.getSocialMedia(),
      galleries: await cms.getGalleries(),
    },
  };
};

const Index = (props: IIndexProps) => {
  const { showcases, videos, socialMedia, galleries } = props;
  return (
    <div>
      <Meta />

      <Container maxWidth="lg">
        <ShowcaseSection showcases={showcases} />

        <SocialMediaSection socialMedia={socialMedia} />

        <SectionLayout layoutId="video">
          <SectionHeader
            title="Video"
            action={{ name: "See All", href: "/video" }}
          />

          <VideoCardGrid videos={videos.slice(0, 3)} />
        </SectionLayout>

        <SectionLayout layoutId="gallery">
          <SectionHeader
            title="Gallery"
            action={{ name: "See All", href: "/gallery" }}
          />
          <GalleryGrid galleries={galleries.slice(0, 3)} />
        </SectionLayout>
      </Container>
    </div>
  );
};

export default Index;
