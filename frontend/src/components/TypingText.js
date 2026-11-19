"use client";

import { useEffect, useState } from "react";

// Hiệu ứng chữ tự gõ rồi xoá, lặp qua danh sách "words"
export default function TypingText({ words }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    let delay = deleting ? 45 : 90;
    if (!deleting && text === word) delay = 1800;
    if (deleting && text === "") delay = 300;

    const timer = setTimeout(() => {
      if (!deleting && text === word) setDeleting(true);
      else if (deleting && text === "") {
        setDeleting(false);
        setIndex((index + 1) % words.length);
      } else {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [text, deleting, index, words]);

  return (
    <span>
      {text}
      <span className="caret ml-0.5 text-brand">|</span>
    </span>
  );
}
