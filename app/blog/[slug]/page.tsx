import { readdir, readFile } from "fs/promises";
import matter from "gray-matter";
import rehypePrettyCode from "rehype-pretty-code";
import "@/styles/mdx.css";
import { Mdx } from "@/components/mdx";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

async function getAuthorDetails(authorsList) {
  if (!authorsList || authorsList.length === 0) {
    return [];
  }

  let authorsDetails = [];

  for (const authorName of authorsList) {
    const authorFilename = `./content/authors/${authorName}.mdx`;

    try {
      // Read the author's metadata file
      const authorFile = await readFile(authorFilename, "utf8");
      const { data: authorData } = matter(authorFile);

      // Store the necessary details
      authorsDetails.push({
        name: authorName,
        avatar: authorData.avatar,
        linkedIn: authorData.linkedIn,
      });
    } catch (error) {
      console.error(`Error reading author file for ${authorName}:`, error);
    }
  }

  return authorsDetails;
}

export default async function PostPage({ params }) {
  const filename = "./content/blog/" + params.slug + ".mdx";
  const file = await readFile(filename, "utf8");
  const { content, data } = matter(file);
  const authorsInfo = await getAuthorDetails(data.authors);

  return (
    <main className="container py-6 lg:py-8 max-w-[650px]">
      <div className="max-w-3xl">
        {data.publishedAt && (
          <time
            dateTime={data.publishedAt}
            className="block text-sm text-muted-foreground"
          >
            Published on {formatDate(data.publishedAt)}
          </time>
        )}
        <h1 className="mt-2 font-heading font-bold inline-block text-4xl leading-tight tracking-tight lg:text-5xl ">
          {data.title}
        </h1>
        {authorsInfo.length ? (
          <div className="mt-4 flex space-x-4">
            {authorsInfo.map((author) =>
              author ? (
                <Link
                  key={author.name}
                  href={`https://www.linkedin.com/in/${author.linkedIn}`}
                  className="flex items-center space-x-2 text-sm"
                >
                  <Image
                    placeholder="blur"
                    src={author.avatar}
                    alt={author.name}
                    width={42}
                    height={42}
                    className="rounded-full"
                  />
                  <div className="flex-1 text-left leading-tight">
                    <p className="font-medium">{author.name}</p>
                    <p className="text-[12px] text-muted-foreground">
                      @LinkedIn
                    </p>
                  </div>
                </Link>
              ) : null
            )}
          </div>
        ) : null}
      </div>
      {data.image && (
        <Image
          src={data.image}
          alt={data.title}
          width={650}
          height={405}
          className="my-8 rounded-md border bg-zinc-500 transition-colors"
          priority
        />
      )}
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
                    theme: "github-dark-dimmed",
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
  const entries = await readdir("./content/blog", { withFileTypes: true });
  const dirs = entries.map((entry) => path.basename(entry.name, ".mdx"));
  return dirs.map((dir) => ({ slug: dir }));
}
