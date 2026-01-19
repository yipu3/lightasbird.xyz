"use client";

import Giscus from "@giscus/react";

export default function Comments() {
  return (
    <Giscus
      repo="yipu3/lightasbird.xyz"
      repoId="R_kgDOLBwi-A"
      category="Announcements"
      categoryId="DIC_kwDOLBwi-M4C1JDd"
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme="preferred_color_scheme"
      lang="zh-CN"
    />
  );
}
