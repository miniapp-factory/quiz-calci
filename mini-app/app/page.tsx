import { description, title, url } from "@/lib/metadata";
import { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    other: {
      "fc:miniapp": JSON.stringify({
        version: "next",
        imageUrl: `${url}/icon.png`,
        ogTitle: title,
        ogDescription: description,
        ogImageUrl: `${url}/icon.png`,
        button: {
          title: "Launch Mini App",
          action: {
            type: "launch_miniapp",
            name: title,
            url: url,
            splashImageUrl: `${url}/icon.png`,
            iconUrl: `${url}/icon.png`,
            splashBackgroundColor: "#000000",
            description: description,
            primaryCategory: "utility",
            tags: [],
          },
        },
      }),
    },
  };
}

export default function Home() {
  return (
    <main className="flex flex-col gap-3 place-items-center px-4 py-8">
      <span className="text-3xl font-bold">{title}</span>
      <span className="text-muted-foreground text-center">{description}</span>
      <Link
        href="/quiz"
        className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
      >
        Start Quiz
      </Link>
    </main>
  );
}
