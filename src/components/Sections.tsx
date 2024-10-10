// src/components/Sections.tsx
import React from 'react';

const Section = ({ id, title }: { id: string; title: string }) => {
  return (
    <div id={id} style={{ padding: '100px 20px', height: '100vh', background: '#f0f0f0', textAlign: 'center' }}>
      <h2>{title}</h2>
    </div>
  );
};

export default function Sections() {
  return (
    <div>
      <Section id="home" title="Home" />
      <Section id="about" title="About" />
      <Section id="work" title="Work" />
      <Section id="contact" title="Contact" />
    </div>
  );
}
