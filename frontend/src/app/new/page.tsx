"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewArticle() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        article: {
          title,
          body,
          published_at: new Date().toISOString(),
        },
      }),
    });

    router.push("/");
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>新しい記事を投稿</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <textarea
            placeholder="本文"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
        <button type="submit">投稿する</button>
      </form>
    </main>
  );
}
