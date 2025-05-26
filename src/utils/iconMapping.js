import {
  DiHtml5,
  DiCss3,
  DiJsBadge,
  DiReact,
  DiDatabase,
  DiDjango,
} from "react-icons/di";

export const iconMap = {
  DiHtml5: DiHtml5,
  DiCss3: DiCss3,
  DiJsBadge: DiJsBadge,
  DiReact: DiReact,
  DiDatabase: DiDatabase,
  DiDjango: DiDjango,
  html: DiHtml5,
  css: DiCss3,
  javascript: DiJsBadge,
  js: DiJsBadge,
  react: DiReact,
  sql: DiDatabase,
  database: DiDatabase,
  django: DiDjango,
  python: DiDjango
};

export const getIcon = (iconName) => {
  if (iconMap[iconName]) {
    return iconMap[iconName];
  }
  
  const lowerIconName = iconName.toLowerCase();
  for (const key in iconMap) {
    if (lowerIconName.includes(key.toLowerCase())) {
      return iconMap[key];
    }
  }
  
  return DiJsBadge;
};