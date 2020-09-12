import React, { useEffect, useState, useContext } from "react";

import { Button, TextField, Grid, Select } from "@material-ui/core";

export default function ButtonList({ question, buttons }) {
  console.log(buttons);
  return buttons.map((e,i) => {
    return (
      <Button key={i} color={e.color} onClick={() => e.onClick(question)}>
        {e.title(question)}
      </Button>
    );
  });
}
