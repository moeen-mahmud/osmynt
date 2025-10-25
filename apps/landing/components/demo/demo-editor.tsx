import React from "react";
import Editor, { type EditorProps } from "@monaco-editor/react";

const StableMonacoEditor = React.memo((props: EditorProps) => <Editor {...props} />);

export default StableMonacoEditor;
