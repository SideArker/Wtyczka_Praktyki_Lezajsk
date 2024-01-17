import { Typography } from "@mui/material";
import React from "react";

type MessageProps = {text: String}


export function UserMessage(props: MessageProps) {
  return (
    <Typography sx={{
      m: 2,
      p: 1,
      bgcolor: '#0288d1',
      borderRadius: '4px'
    }}>
      {props.text}
    </Typography>
  );
}

export function ChatMessage(props: MessageProps) {
  return (
    <Typography sx={{
      m: 2,
      p: 1,
      bgcolor: '#a0a0a0',
      borderRadius: '4px'
    }}>
      {props.text}
    </Typography>
  );
}