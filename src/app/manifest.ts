import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AirdropViewer - Web3 Airdrop Potential & Task Tracker",
    short_name: "AirdropViewer",
    description: "Direktori & Tracker Airdrop Web3 terkurasi dengan justifikasi pendanaan riil dan pencatat tugas.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#059669",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
