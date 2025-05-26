export const parseHtml = (content) => {
  if (!content) return '';
  
  const decodeHtmlEntities = (html) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = html;
    return textArea.value;
  };
  
  let result = decodeHtmlEntities(content);
  
  if (result.includes('&lt;br&gt;')) {
    result = result.replace(/&lt;br&gt;/g, '<br>');
  }
  
  if (result.includes('&lt;strong&gt;')) {
    result = result.replace(/&lt;strong&gt;/g, '<strong>');
    result = result.replace(/&lt;\/strong&gt;/g, '</strong>');
  }
  
  if (result.includes('&lt;em&gt;')) {
    result = result.replace(/&lt;em&gt;/g, '<em>');
    result = result.replace(/&lt;\/em&gt;/g, '</em>');
  }
  
  return result;
};

export const processArticleHtml = (article) => {
  if (!article) return article;

  const processedArticle = {...article};
  
  if (processedArticle.description) {
    processedArticle.description = parseHtml(processedArticle.description);
  }
  
  if (processedArticle.summary) {
    processedArticle.summary = parseHtml(processedArticle.summary);
  }
  
  if (processedArticle.sections && Array.isArray(processedArticle.sections)) {
    processedArticle.sections = processedArticle.sections.map(section => {
      const processedSection = {...section};
      
      if (processedSection.content) {
        processedSection.content = parseHtml(processedSection.content);
      }
      
      if (processedSection.code_description) {
        processedSection.code_description = parseHtml(processedSection.code_description);
      }
      
      return processedSection;
    });
  }
  
  return processedArticle;
};