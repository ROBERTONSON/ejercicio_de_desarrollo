import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="app-layout text-sm">
      <Sidebar />
      <main className="main-content relative bg-[#0a0a0f]">
        <Header />
        <div className="page-body pb-20 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
