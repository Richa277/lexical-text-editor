import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot, $getSelection } from "lexical";
import { useState } from "react";

import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { Option } from "./plugins/Option";
function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

const editorConfig = {
  onError(error) {
    throw error;
  },
  nodes: [HeadingNode, QuoteNode, HeadingNode],
};
export default function Editor() {
  const [text, setText] = useState("");
  const [hasSlash, setHasSlash] = useState(false);
  const [search, setSearch] = useState();
  const handleINput = (editorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const selection = $getSelection();
      setText(root.__cachedText);

      if (root.__cachedText === "/") {
        setHasSlash(true);
      } else if (
        root.__cachedText.length > 1 &&
        (root.__cachedText.includes("//") || root.__cachedText === "//")
      ) {
        setHasSlash(false);
      } else if (text === "") {
        setHasSlash(false);
      } else if (text.length > 1) {
        setSearch(text.replace("/", ""));
      }
      console.log(root.__cachedText, text);
    });
  };
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <h3>Rich Text Editor</h3>
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="editor-input" onInput={handleINput} />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />

          <OnChangePlugin onChange={handleINput} />
          {hasSlash ? (
            <>
              <Option
                search={search}
                text={text}
                setText={setText}
                setHasSlash={setHasSlash}
              />
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </LexicalComposer>
  );
}
