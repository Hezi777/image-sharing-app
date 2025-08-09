import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { ThemeToggleFAB } from './ThemeToggleFAB';

export default function Layout() {
  return (
    <>
      <Outlet />
      <BottomNav />
      <ThemeToggleFAB />
    </>
  );
}
