import { MDXRemote } from "next-mdx-remote/rsc";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Callout } from "./callout";

const components = {
  h1: ({ className, ...props }) => (
    <h1 className={cn("font-heading", className)} {...props} />
  ),
  h2: ({ className, ...props }) => (
    <h2 className={cn("font-heading", className)} {...props} />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={cn("font-heading", className)} {...props} />
  ),
  h4: ({ className, ...props }) => (
    <h4 className={cn("font-heading", className)} {...props} />
  ),

  img: ({
    className,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={cn("rounded-md border", className)} alt={alt} {...props} />
  ),
  hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn("m-0 border-t p-0 even:bg-muted", className)}
      {...props}
    />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn(
        "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        " [&>code]:!bg-black border border-zinc-800 !bg-black text-xs sm:text-sm",
        className
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "relative rounded !bg-zinc-800 px-[0.3rem] py-[0.2rem] font-code [&>span]:pr-4",
        className
      )}
      {...props}
    />
  ),
  Link: ({ className, ...props }: React.ComponentProps<typeof Link>) => (
    <Link
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
  Callout,
  Image,
};

export function Mdx(props) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}
