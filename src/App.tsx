/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_ITEMS } from './data/tripData';
import { ChecklistItem } from './types';
import { ChecklistView } from './components/ChecklistView';
import { ImageGeneratorModal } from './components/ImageGeneratorModal';

export default function App() {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem('one_bag_travel_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_ITEMS;
  });

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('one_bag_travel_v6', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isPacked: !item.isPacked } : item
      )
    );
  };

  const packAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, isPacked: true })));
  };

  const resetAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, isPacked: false })));
  };

  const addItem = (name: string, category: ChecklistItem['category']) => {
    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      name,
      category,
      isPacked: false,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const packedCount = items.filter((i) => i.isPacked).length;
  const totalCount = items.length;

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white flex flex-col">
      {/* Quiet Minimalist Monospace Top Header */}
      <header className="border-b border-black px-4 sm:px-8 py-2.5 flex items-center justify-between font-mono text-[11px] bg-white">
        <div className="flex items-center gap-2">
          <span className="font-bold uppercase tracking-tight">
            One Bag Travel
          </span>
        </div>
        <div className="text-neutral-500 text-[10px]">
          {packedCount}/{totalCount} packed
        </div>
      </header>

      {/* Main Checklist Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 pt-3 pb-6">
        <ChecklistView
          items={items}
          onToggleItem={toggleItem}
          onPackAll={packAll}
          onResetAll={resetAll}
          onAddItem={addItem}
          onOpenImageModal={() => setIsImageModalOpen(true)}
        />
      </main>

      {/* Minimal Footer with Tiny Buttons */}
      <footer className="border-t border-neutral-200 bg-white px-4 sm:px-8 py-4 font-mono text-[10px] text-neutral-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span>one bag travel</span>
          </div>

          {/* Tiny action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsImageModalOpen(true)}
              className="border border-neutral-300 hover:border-black bg-white hover:bg-black hover:text-white px-2 py-0.5 uppercase transition text-[10px] text-black"
            >
              [make / export image]
            </button>
            <button
              onClick={() => window.print()}
              className="border border-neutral-300 hover:border-black bg-white hover:bg-neutral-100 px-2 py-0.5 uppercase transition text-[10px] text-neutral-600"
            >
              [print]
            </button>
            <button
              onClick={packAll}
              className="border border-neutral-300 hover:border-black bg-white hover:bg-neutral-100 px-2 py-0.5 uppercase transition text-[10px] text-neutral-600"
            >
              [pack all]
            </button>
            <button
              onClick={resetAll}
              className="border border-neutral-300 hover:border-black bg-white hover:bg-neutral-100 px-2 py-0.5 uppercase transition text-[10px] text-neutral-600"
            >
              [reset]
            </button>
          </div>
        </div>
      </footer>

      {/* Image Generator Modal */}
      <ImageGeneratorModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        items={items}
      />
    </div>
  );
}
