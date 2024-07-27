// import { Detail } from "@raycast/api";

// export default function Command() {
//   return <Detail markdown="# Hello World" />;
// }

import { Detail, Toast, getFrontmostApplication, showToast } from "@raycast/api";
import fs from "node:fs";
import path from "node:path";
import React, { useEffect, useState } from "react";

async function loadNote(): Promise<{ content: string; appName: string }> {
  console.log("loadNote");

  try {
    const focusedApp = await getFrontmostApplication();
    const notesDirectory = path.join(process.env.HOME || "", "obscenities/orchis/macos/");
    const notePath = path.join(notesDirectory, `${focusedApp.name}.md`);

    if (!fs.existsSync(notePath)) {
      throw new Error(`No note found for ${focusedApp.name}`);
    }

    const content = fs.readFileSync(notePath, "utf-8");
    return { content, appName: focusedApp.name };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred");
  }
}

export default function Command() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [markdown, setMarkdown] = React.useState<string>("Loading...");
  const [navigationTitle, setNavigationTitle] = React.useState<string>("Loading");

  React.useEffect(() => {
    loadNote()
      .then(({ content, appName }) => {
        setMarkdown(content);
        setNavigationTitle(appName);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error", error);
        showToast({
          style: Toast.Style.Failure,
          title: "Failed to open note",
          message: String(error),
        });
        setMarkdown("Failed to load note");
        setNavigationTitle("Error");
        setIsLoading(false);
      });
  }, []);

  return <Detail isLoading={isLoading} markdown={markdown} navigationTitle={navigationTitle} />;
}
