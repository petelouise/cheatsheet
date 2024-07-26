// import { Detail } from "@raycast/api";

// export default function Command() {
//   return <Detail markdown="# Hello World" />;
// }

import { Detail, Toast, getFrontmostApplication, showToast } from "@raycast/api";
import fs from "node:fs";
import path from "node:path";

export default async function Command() {
  try {
    const focusedApp = await getFrontmostApplication();

    const notesDirectory = path.join(process.env.HOME || "", "obscenities/orchis/macos/");
    const notePath = path.join(notesDirectory, `${focusedApp.name}.md`);

    if (!fs.existsSync(notePath)) {
      throw new Error(`No note found for ${focusedApp.name}`);
    }

    const noteContent = fs.readFileSync(notePath, "utf-8");

    return <Detail markdown={noteContent} navigationTitle={`Note for ${focusedApp.name}`} />;
  } catch (error) {
    console.log("Error", error);
    return <Detail markdown="**Error**" navigationTitle="Error" />;

    showToast({
      style: Toast.Style.Failure,
      title: "Failed to open note",
      message: String(error),
    });

    return <Detail markdown={`# Error\n\n${String(error)}`} navigationTitle="Error" />;
  }
}
