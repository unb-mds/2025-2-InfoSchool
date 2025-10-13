// src/app/page.tsx
'use client';
import { useEffect } from 'react';

export default function RootPage() {
  useEffect(() => {
    // Redirect instantâneo com JavaScript
    window.location.href = '/inicial';
  }, []);

  return null; // Não mostra nada
}