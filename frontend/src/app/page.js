'use client'

import React from 'react';
import { Grid2 as Grid, Box } from '@mui/material';

import { htmlPlaceholder, cssPlaceholder, jsPlaceholder } from './placeholder';
import Navbar from '@/components/Navbar/Navbar';
import EditorHTML from '@/components/EditorHTML/EditorHTML';
import EditorCSS from '@/components/EditorCSS/EditorCSS';
import EditorJS from '@/components/EditorJS/EditorJS';
import Preview from '@/components/Preview/Preview';

export default function Home() {
  const [html, setHtml] = React.useState(htmlPlaceholder);
  const [css, setCss] = React.useState(cssPlaceholder);
  const [js, setJs] = React.useState(jsPlaceholder);

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Navbar />
        <Grid container spacing={2} sx={{ borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider', padding: '0 20px' }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <EditorHTML value={html} setValue={setHtml} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <EditorCSS value={css} setValue={setCss} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <EditorJS value={js} setValue={setJs} />
          </Grid>
        </Grid>

        <Box sx={{ flexGrow: 1, marginTop: '15px', padding: '0 20px'}}>
          <Preview html={html} css={css} js={js} />
        </Box>
      </Box>
    </>
  );
}

