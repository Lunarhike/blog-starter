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
    <main className="relative py-6 lg:py-12 lg:gap-10 xl:grid">
      <div className="mx-auto w-full min-w-0">
        <h1
          className={[
            "text-[40px] font-black leading-[44px] text-[--title]",
          ].join(" ")}
        >
          {data.title}
        </h1>
        <p className="mt-2 text-[13px] text-gray-700 dark:text-gray-300">
          {new Date(data.date).toLocaleDateString("en", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <div className="pt-8">
          <Mdx
            source={content}
            options={{
              mdxOptions: {
                useDynamicImport: true,
                rehypePlugins: [
                  [
                    rehypePrettyCode,
                    {
                      theme: "slack-dark",
                    },
                  ],
                ],
              },
            }}
          />
          <hr />
        </div>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  const entries = await readdir("./content/", { withFileTypes: true });
  const dirs = entries.map((entry) => path.basename(entry.name, ".mdx"));
  return dirs.map((dir) => ({ slug: dir }));
}
