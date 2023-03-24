import { SignInButton, SignOutButton, useAuth, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";

import { type RouterOutputs, api } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import LoadingSpinner from "~/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postView";
dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  const { signOut } = useAuth();

  const [input, setInput] = useState<string>("");

  const ctx = api.useContext();

  const { mutate: createPost, isLoading: isPosting } =
    api.posts.create.useMutation({
      onSuccess: () => {
        void ctx.posts.getAll.invalidate();
      },
      onError: (err) => {
        const errorsMsg = err.data?.zodError?.fieldErrors.content;
        if (errorsMsg && errorsMsg[0]) {
          toast.error(errorsMsg[0]);
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
      },
    });

  if (!user) return null;

  return (
    <div className="flex w-full gap-4">
      <button>
        <Image
          className="h-14 w-14 rounded-full"
          src={user.profileImageUrl}
          alt="Profile Image"
          height={56}
          width={56}
          placeholder="blur"
          onClick={() => signOut()}
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN0dnffAwADNQGPiCXt9AAAAABJRU5ErkJggg=="
        />
      </button>
      <input
        placeholder="What's on your mind? (In emojis)"
        className="grow bg-transparent outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            createPost({ content: input });
            setInput("");
          }
        }}
      />
      {input !== "" && (
        <button
          onClick={() => {
            createPost({ content: input });
            setInput("");
          }}
          disabled={isPosting}
        >
          Post
        </button>
      )}

      {isPosting && <LoadingSpinner />}
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingSpinner />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col ">
      {data?.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
        {!isSignedIn && (
          <div className="flex justify-center">
            <SignInButton />
          </div>
        )}
        {isSignedIn && <CreatePostWizard />}
      </div>
      <Feed />
    </PageLayout>
  );
};

export default Home;
