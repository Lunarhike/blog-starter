import { readdir, readFile } from "fs/promises";
import matter from "gray-matter";
import rehypePrettyCode from "rehype-pretty-code";
import "@/styles/mdx.css";
import { Mdx } from "@/components/mdx";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

async function getAuthorDetails(authorsList) {
  // If authorsList is empty or not provided, return an empty array
  if (!authorsList || authorsList.length === 0) {
    return [];
  }

  let authorsDetails = [];

  for (const authorName of authorsList) {
    // Construct the path to the author's metadata file
    const authorFilename = `./content/authors/${authorName.toLowerCase()}.mdx`; // Ensure the path is lowercase

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
        <div className="mt-4 flex space-x-4">
          {authorsInfo.map((author) => (
            <Link
              key={author.name}
              href={`https://www.linkedin.com/in/${author.linkedIn}`}
              className="flex items-center space-x-2 text-sm"
            >
              <Image
                loading="lazy"
                src={author.avatar}
                alt={author.name}
                width={42}
                height={42}
                className="rounded-full"
              />
              <div className="flex-1 text-left leading-tight">
                <p className="font-medium">{author.name}</p>
                <p className="text-[12px] text-muted-foreground">@LinkedIn</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {data.image && (
        <Image
          src={data.image}
          alt={data.title}
          width={650}
          height={650}
          placeholder={`data:image/svg+xml;base64,${toBase64(
            shimmer(650, 650)
          )}`}
          className="my-8 rounded-md border bg-zinc-500 transition-colors"
          priority
          loading="lazy"
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
