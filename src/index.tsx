// import { Detail } from "@raycast/api";

// export default function Command() {
//   return <Detail markdown="# Hello World" />;
// }

import { Detail, Toast, getFrontmostApplication, showToast, ActionPanel, Action } from "@raycast/api";
import fs from "node:fs";
import path from "node:path";

export default function Command() {
  return (
    <Detail
      markdown="Loading..."
      navigationTitle="Loading"
      actions={
        <ActionPanel>
          <Action.Push
            title="Load Note"
            target={<NoteDetail />}
          />
        </ActionPanel>
      }
    />
  );
}

function NoteDetail() {
  const [markdown, setMarkdown] = React.useState<string>("Loading...");
  const [navigationTitle, setNavigationTitle] = React.useState<string>("Loading");

  React.useEffect(() => {
    async function loadNote() {
      try {
        const focusedApp = await getFrontmostApplication();
        const notesDirectory = path.join(process.env.HOME || "", "obscenities/orchis/macos/");
        const notePath = path.join(notesDirectory, `${focusedApp.name}.md`);

        if (!fs.existsSync(notePath)) {
          throw new Error(`No note found for ${focusedApp.name}`);
        }

        const noteContent = fs.readFileSync(notePath, "utf-8");
        setMarkdown(noteContent);
        setNavigationTitle(`Note for ${focusedApp.name}`);
      } catch (error) {
        console.log("Error", error);
        setMarkdown(`# Error\n\n${String(error)}`);
        setNavigationTitle("Error");

        showToast({
          style: Toast.Style.Failure,
          title: "Failed to open note",
          message: String(error),
        });
      }
    }

    loadNote();
  }, []);

  return <Detail markdown={markdown} navigationTitle={navigationTitle} />;
}
