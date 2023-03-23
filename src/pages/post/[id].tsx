import Head from "next/head";

function PostPage() {
  return (
    <>
      <Head>
        <title>Chirper | Post</title>
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          Post View
        </div>
      </main>
    </>
  );
}

export default PostPage;
