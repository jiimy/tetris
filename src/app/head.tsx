import Script from 'next/script';

interface ThemeColor {
  media: string;
  color: string;
}

interface Author {
  name: string;
  url?: string;
}

interface Icon {
  rel: string;
  url: string;
}

interface MetadataProps {
  title: string;
  description: string;
  generator: string;
  manifest: string;
  keywords: string[];
  themeColor: ThemeColor[];
  authors: Author[];
  viewport: string;
  icons: Icon[];
}

export const metadata: MetadataProps = {
  title: "PWA with Next 14",
  description: "PWA application with Next 14",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "nextjs14", "next14", "pwa", "next-pwa"],
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#fff" }],
  authors: [
    { name: "Alldo Faiz Ramadhani" },
    {
      name: "Alldo Faiz Ramadhani",
      url: "https://www.linkedin.com/in/alldofaiz/",
    },
  ],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon.png" },
    { rel: "icon", url: "icons/icon.png" },
  ],
};

export default function Head() {
  return (
    <>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="generator" content={metadata.generator} />
        <link rel="manifest" href={metadata.manifest} />
        <meta name="keywords" content={metadata.keywords.join(", ")} />
        {metadata.themeColor.map(({ media, color }, index) => (
          <meta key={index} name="theme-color" media={media} content={color} />
        ))}
        {metadata.authors.map(({ name, url }, index) => (
          <meta key={index} name="author" content={name} {...(url && { href: url })} />
        ))}
        <meta name="viewport" content={metadata.viewport} />
        {metadata.icons.map(({ rel, url }, index) => (
          <link key={index} rel={rel} href={url} />
        ))}
      </head>
    </>
  )
}
