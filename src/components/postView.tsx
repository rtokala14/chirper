import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { RouterOutputs } from "~/utils/api";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.profileImageUrl}
        alt={`${author.username}'s profile picture`}
        className="h-14 w-14 rounded-full"
        height={56}
        width={56}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN0dnffAwADNQGPiCXt9AAAAABJRU5ErkJggg=="
      />
      <div className="flex flex-col ">
        <div className="flex gap-1 text-slate-300">
          <Link href={`/@${author.username}`}>
            <span className="hover:underline">{`@${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{` · ${dayjs(
              post.createdAt
            ).fromNow()}`}</span>
          </Link>
        </div>
        {/* <Link href={`/post/${post.id}`}> */}
        <span className="text-2xl">{post.content}</span>
        {/* </Link> */}
      </div>
    </div>
  );
};
