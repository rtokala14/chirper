import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "~/utils/api";
import LoadingSpinner from "~/components/loading";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import Image from "next/image";
import { PageLayout } from "~/components/layout";
dayjs.extend(relativeTime);

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (isLoading) return <LoadingSpinner />;

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${username} | Chirper`}</title>
      </Head>
      <PageLayout>
        <div className="relative h-36 bg-slate-600">
          <Image
            src={data.profileImageUrl}
            alt={`${data.username ?? ""}'s profile picture`}
            className="absolute -bottom-16 left-8 rounded-full border-2 border-black"
            height={128}
            width={128}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN0dnffAwADNQGPiCXt9AAAAABJRU5ErkJggg=="
          />
        </div>
        <div className="h-16"></div>
        <div className="p-4 text-2xl font-bold">{`@${
          data.username ?? ""
        }`}</div>
        <div className="w-full border-b border-slate-400"></div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") {
    throw new Error("No slug");
  }

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username: username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ProfilePage;
