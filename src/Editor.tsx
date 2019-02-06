import React from "react";
import AceEditor from "react-ace";

import "brace/mode/javascript";
import "brace/theme/github";

export default ({
  value,
  onChange
}: {
  value: string;
  onChange: (val: string) => void;
}) => (
  <AceEditor
    value={value}
    onChange={onChange}
    showGutter={false}
    setOptions={{
      printMargin: false,
      tabSize: 2,
      useSoftTabs: true,
    }}
    width="100%"
    height="100%"
    mode="javascript"
    theme="github"
  />
);
