import { Box, Typography } from '@mui/material';
import React from 'react';
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import ReactHtmlParser from 'react-html-parser';

export default function ChatMessage(props) {
  const { text, isUser } = props.message;

  const messageClass = isUser ? 'sent' : 'received';

  function replaceNewLines(input: string): string {
    return input.replace(/\n/g, '<br>');
  }

  function FormatText(_text) {
    let messageText = replaceNewLines(_text);
    return messageText;
  }
  const transformString = (str) => {
    const codeSnippets = [];
    let index = 0;

    while (index !== -1) {
      index = str.indexOf("```", index);
      if (index === -1) break;

      const openingIndex = index;
      index = str.indexOf("```", index + 3);
      const closingIndex = index !== -1 ? index : str.length;
      const codeSnippet = str.slice(openingIndex + 3, closingIndex);
      index += 3;
      codeSnippets.push(codeSnippet);
    }

    const content = str.split("```");

    return (
      <>
        {content.map((content, index) => (
          (index % 2 != 0) ?
            <CodeMirror
              value={content}
              // height="200px"
              theme="dark"
              extensions={[javascript({ jsx: true })]}
              readOnly={true}

            /> : <div dangerouslySetInnerHTML={{ __html: FormatText(content) }} />

        ))}
      </>
    );
  };

  return (
    <>
      <Box
        className={`message ${messageClass}`}
        sx={{
          mb: 1,
        }}>
        {/* <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} /> */}
        <Typography
          sx={{
            wordWrap: 'break-word',
          }}>
          {transformString(text)}
        </Typography>
      </Box>
    </>
  );
}
