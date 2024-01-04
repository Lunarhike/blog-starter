// import { notFound } from "next/navigation";
// import { Mdx } from "@/components/mdx";
// import { getBlogPosts } from "@/lib/blog";
// import rehypePrettyCode from "rehype-pretty-code";

// export default function Blog({ params }) {
//   let post = getBlogPosts().find((post) => post.slug === params.slug);

//   if (!post) {
//     notFound();
//   }

//   return (
//     <section>
//       <h1 className="title font-medium text-2xl tracking-tighter max-w-[650px]">
//         {post.metadata.title}
//       </h1>
//       <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
//         <p className="text-sm text-neutral-600 dark:text-neutral-400">
//           {post.metadata.publishedAt}
//         </p>
//       </div>
//       <article className="">
//         <Mdx
//           source={post.content}
//           options={{
//             mdxOptions: {
//               useDynamicImport: true,
//               rehypePlugins: [
//                 [
//                   rehypePrettyCode,
//                   {
//                     theme: "slack-dark",
//                   },
//                 ],
//               ],
//             },
//           }}
//         />
//       </article>
//     </section>
//   );
// }

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
    <div>
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
      <div className="markdown mt-10">
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
  );
}

export async function generateStaticParams() {
  const entries = await readdir("./content/", { withFileTypes: true });
  const dirs = entries.map((entry) => path.basename(entry.name, ".mdx"));
  console.log(dirs.map((dir) => ({ slug: dir })));
  return dirs.map((dir) => ({ slug: dir }));
}
