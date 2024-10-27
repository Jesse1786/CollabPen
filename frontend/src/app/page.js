'use client'

import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import HtmlEditor from '@/components/HtmlEditor/HtmlEditor';

export default function Home() {
  const [html, setHtml] = React.useState('<h1>Try edting me!</h1>');

  return (
    <div>
      <Navbar />
      <HtmlEditor value={html} setValue={setHtml} />
    </div>
  );
}

