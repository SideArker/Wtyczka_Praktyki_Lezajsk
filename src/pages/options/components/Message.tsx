import { Box, Typography } from "@mui/material";
import React from "react";

export default function ChatMessage(props) {
  const { text, isMine } = props.message;

  const messageClass = isMine ? 'sent' : 'received';

  return (<>
    <Box className={`message ${messageClass}`} sx={{
      mb: 1
    }}>
      {/* <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} /> */}
      <Typography sx={{
        wordWrap: 'break-word'
      }}>{text}</Typography>
    </Box>
  </>)
}