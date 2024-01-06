import { readdir, readFile } from "fs/promises";
import matter from "gray-matter";
import Link from "next/link";
import path from "path";

export const metadata = {
  title: "Blog Starter - Santiego",
  description: "Next.js 14 MDX Blog Starter presented by Santiego",
};

export async function getPosts() {
  const entries = await readdir("./content/", { withFileTypes: true });
  const dirs = entries.map((entry) => path.basename(entry.name, ".mdx"));
  const fileContents = await Promise.all(
    dirs.map((dir) => readFile("./content/" + dir + ".mdx", "utf8"))
  );
  const posts = dirs.map((slug, i) => {
    const fileContent = fileContents[i];
    const { data } = matter(fileContent);
    return { slug, ...data };
  });
  posts.sort((a, b) => {
    return Date.parse(a.publishedAt) < Date.parse(b.publishedAt) ? 1 : -1;
  });
  return posts;
}

export default async function Home() {
  const posts = await getPosts();
  return (
    <div className="container relative -top-[10px] flex flex-col gap-8">
      {posts.map((post) => (
        <Link
          key={post.slug}
          className="block py-4 hover:scale-[1.005]"
          href={"/blog/" + post.slug + "/"}
        >
          <article>
            <PostTitle post={post} />
            <PostMeta post={post} />
            <PostSubtitle post={post} />
          </article>
        </Link>
      ))}
    </div>
  );
}

function PostTitle({ post }) {
  let today = new Date();
  let timeSinceFirstPost = (today - new Date(2018, 10, 30)).valueOf();
  let timeSinceThisPost = (today - new Date(post.publishedAt)).valueOf();
  let staleness = timeSinceThisPost / timeSinceFirstPost;

  return (
    <h2 className={["text-3xl font-black font-heading"].join(" ")}>
      {post.title}
    </h2>
  );
}

function PostMeta({ post }) {
  return (
    <p className="text-[13px] text-gray-700 dark:text-gray-300">
      {new Date(post.publishedAt).toLocaleDateString("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </p>
  );
}

function PostSubtitle({ post }) {
  return <p className="mt-1">{post.spoiler}</p>;
}
