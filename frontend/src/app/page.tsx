"use client";

import { useEffect, useState } from "react";

type Article = {
  id: number;
  title: string;
  body: string;
  published_at: string;
};

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles`)
      .then((res) => res.json())
      .then((data) => setArticles(data));
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>記事一覧</h1>
      <ul>
        {articles.map((article) => (
          <li key={article.id} style={{ marginBottom: "1.5rem" }}>
            <h2>{article.title}</h2>
            <p>{article.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
