import Head from "next/head";
import { PageLayout } from "~/components/layout";

function PostPage() {
  return (
    <>
      <Head>
        <title>Chirper | Post</title>
      </Head>
      <PageLayout>
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          Post View
        </div>
      </PageLayout>
    </>
  );
}

export default PostPage;
