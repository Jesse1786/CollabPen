'use client'

import React from 'react';
import { Grid2 as Grid, Box } from '@mui/material';

import Navbar from '@/components/Navbar/Navbar';
import EditorHTML from '@/components/EditorHTML/EditorHTML';
import EditorCSS from '@/components/EditorCSS/EditorCSS';
import EditorJS from '@/components/EditorJS/EditorJS';

export default function Home() {
  const [html, setHtml] = React.useState('<h1>Try edting me!</h1>');
  const [css, setCss] = React.useState('body { background-color: lightblue; }');
  const [js, setJs] = React.useState('console.log("Hello, World!");');

  return (
    <>
      <Navbar />
      <Grid container spacing={2} sx={{ borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider', padding: '5px 20px' }}>
        <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column' }}>
          <EditorHTML value={html} setValue={setHtml} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <EditorCSS value={css} setValue={setCss} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <EditorJS value={js} setValue={setJs} />
        </Grid>
      </Grid>
    </>
  );
}

