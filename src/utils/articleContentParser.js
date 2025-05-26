export const parseArticleContent = (content) => {
  if (!content || !content.includes("```")) {
    return {
      content,
      codeBlocks: [],
    };
  }

  const regex = /```(\w+)?\n([\s\S]*?)\n```/g;
  const parts = [];
  const codeBlocks = [];

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }

    const language = match[1] || "javascript";
    const code = match[2];

    parts.push(`[CODE_BLOCK_${codeBlocks.length}]`);

    codeBlocks.push({
      language,
      code,
      order: codeBlocks.length,
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return {
    content: parts.join(""),
    codeBlocks,
  };
};

export const processArticleWithCodeBlocks = (article) => {
  if (!article) return article;

  if (article.content && article.content.includes("```")) {
    const { content, codeBlocks } = parseArticleContent(article.content);

    if (codeBlocks.length > 0) {
      article.content = content;

      if (!article.code_snippets) {
        article.code_snippets = [];
      }

      const existingCodeIds = article.code_snippets.map((s) => s.id);

      codeBlocks.forEach((block, index) => {
        article.code_snippets.push({
          id: `temp-${index}`,
          language: block.language,
          code: block.code,
          position: "middle",
          order: block.order + 100,
          title: "",
          description: "",
        });
      });
    }
  }

  return article;
};
