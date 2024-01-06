import { readdir, readFile } from "fs/promises";
import matter from "gray-matter";
import Link from "next/link";
import path from "path";

export const metadata = {
  title: "Blog Starter - Santiego",
  description: "Next.js 14 MDX Blog Starter presented by Santiego",
};

export default async function Home() {
  const entries = await readdir("./content/blog/", { withFileTypes: true });
  const dirs = entries.map((entry) => path.basename(entry.name, ".mdx"));
  const fileContents = await Promise.all(
    dirs.map((dir) => readFile("./content/blog/" + dir + ".mdx", "utf8"))
  );
  const posts = dirs.map((slug, i) => {
    const fileContent = fileContents[i];
    const { data } = matter(fileContent);
    return { data, slug };
  });

  return (
    <div className="container relative -top-[10px] flex flex-col gap-8">
      {posts.map((post) => (
        <Link
          key={post.slug}
          className="block py-4 hover:scale-[1.005]"
          href={"/blog/" + post.slug + "/"}
        >
          <article>
            <h2 className={["text-3xl font-black font-heading"].join(" ")}>
              {post.data.title}
            </h2>
            <p className="text-[13px] text-gray-700 dark:text-gray-300">
              {new Date(post.data.publishedAt).toLocaleDateString("en", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </article>
        </Link>
      ))}
    </div>
  );
}
