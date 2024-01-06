import { readdir, readFile } from "fs/promises";
import matter from "gray-matter";
import rehypePrettyCode from "rehype-pretty-code";
import "@/styles/mdx.css";
import { Mdx } from "@/components/mdx";
import path from "path";

export default async function PostPage({ params }) {
  const filename = "./content/" + params.slug + ".mdx";
  const file = await readFile(filename, "utf8");

  const { content, data } = matter(file);

  return (
    <main className="container py-4 lg:py-8 max-w-[650px]">
      <div className="flex flex-col">
        <h1 className="title font-medium text-5xl tracking-tight text-left font-heading">
          {data.title}
        </h1>
        <p className="mt-2 text-[13px] text-gray-700 dark:text-gray-300">
          {new Date(data.publishedAt).toLocaleDateString("en", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="prose prose-quoteless prose-neutral dark:prose-invert py-8">
        <Mdx
          source={content}
          options={{
            mdxOptions: {
              useDynamicImport: true,
              rehypePlugins: [
                [
                  rehypePrettyCode,
                  {
                    theme: "github-dark",
                  },
                ],
              ],
            },
          }}
        />
        <hr />
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  const entries = await readdir("./content/", { withFileTypes: true });
  const dirs = entries.map((entry) => path.basename(entry.name, ".mdx"));
  return dirs.map((dir) => ({ slug: dir }));
}
