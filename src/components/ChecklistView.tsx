import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { ChecklistItem } from '../types';
import { CATEGORIES_ORDER, NOTES } from '../data/tripData';

interface ChecklistViewProps {
  items: ChecklistItem[];
  onToggleItem: (id: string) => void;
  onPackAll: () => void;
  onResetAll: () => void;
  onAddItem: (name: string, category: ChecklistItem['category']) => void;
  onOpenImageModal: () => void;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  items,
  onToggleItem,
  onPackAll,
  onResetAll,
  onAddItem,
  onOpenImageModal,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ChecklistItem['category']>('clothing');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const packedCount = items.filter((i) => i.isPacked).length;
  const totalCount = items.length;
  const progressPct = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const toggleCategoryCollapse = (catId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const collapseAll = () => {
    const next: Record<string, boolean> = {};
    CATEGORIES_ORDER.forEach((c) => {
      next[c.id] = true;
    });
    setCollapsedCategories(next);
  };

  const expandAll = () => {
    setCollapsedCategories({});
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem(newItemName.trim(), newItemCategory);
    setNewItemName('');
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col gap-4 pt-0 mt-0">
      {/* Add Item Inline Drawer (Only rendered when open) */}
      {isAdding ? (
        <form
          onSubmit={handleAddSubmit}
          className="border border-black p-2.5 bg-neutral-50 flex flex-col sm:flex-row gap-2 font-mono text-[11px]"
        >
          <input
            type="text"
            placeholder="Item name..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="flex-1 border border-black bg-white px-2.5 py-1.5 focus:outline-none"
            autoFocus
          />
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value as ChecklistItem['category'])}
            className="border border-black bg-white px-2.5 py-1.5 focus:outline-none text-[11px]"
          >
            {CATEGORIES_ORDER.map((c) => (
              <option key={c.id} value={c.id}>
                {c.index} / {c.title}
              </option>
            ))}
          </select>
          <div className="flex gap-1.5">
            <button
              type="submit"
              className="bg-black text-white px-3 py-1.5 font-bold uppercase hover:bg-neutral-800 transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="border border-black bg-white px-3 py-1.5 uppercase hover:bg-neutral-100"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {/* Masonry Grid Layout: Columns with automatic flow and zero dead gaps */}
      <div className="columns-1 md:columns-2 gap-4 [column-fill:_balance] pt-0 mt-0">
        {CATEGORIES_ORDER.map((category) => {
          const categoryItems = items.filter((item) => item.category === category.id);
          const categoryPacked = categoryItems.filter((i) => i.isPacked).length;
          const isCollapsed = Boolean(collapsedCategories[category.id]);

          return (
            <div
              key={category.id}
              className="break-inside-avoid mb-4 border border-black bg-white flex flex-col transition-all duration-200"
            >
              {/* Category Header: Click to fold/unfold */}
              <div
                onClick={() => toggleCategoryCollapse(category.id)}
                className={`px-3.5 py-2 select-none flex items-center justify-between cursor-pointer transition ${
                  isCollapsed
                    ? 'bg-neutral-100 hover:bg-neutral-200/80 border-b-0'
                    : 'bg-neutral-50 hover:bg-neutral-100 border-b border-black'
                }`}
                title={isCollapsed ? 'Click to unfold' : 'Click to fold'}
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[11px] text-neutral-500 font-bold">
                    {category.index}
                  </span>
                  <h3 className="font-bold text-xs tracking-tight uppercase">
                    {category.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="text-neutral-500">
                    {categoryPacked}/{categoryItems.length}
                  </span>
                  <span className="w-4 h-4 border border-black flex items-center justify-center font-bold text-[10px] text-black bg-white">
                    {isCollapsed ? '+' : '−'}
                  </span>
                </div>
              </div>

              {/* Items List: Folds smoothly when collapsed */}
              {!isCollapsed && (
                <div className="divide-y divide-neutral-100 animate-in fade-in duration-150">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onToggleItem(item.id)}
                      className={`px-3.5 py-1.5 flex items-center justify-between gap-3 cursor-pointer transition select-none group ${
                        item.isPacked
                          ? 'bg-neutral-50/70 text-neutral-400'
                          : 'bg-white hover:bg-neutral-50 text-black'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Httpster-style stark checkbox */}
                        <button
                          type="button"
                          className={`w-3.5 h-3.5 rounded-none border border-black flex items-center justify-center transition shrink-0 ${
                            item.isPacked ? 'bg-black text-white' : 'bg-white group-hover:border-black'
                          }`}
                        >
                          {item.isPacked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </button>

                        <div className="min-w-0">
                          <span
                            className={`text-xs tracking-tight ${
                              item.isPacked
                                ? 'line-through decoration-neutral-400 font-normal'
                                : 'font-medium'
                            }`}
                          >
                            {item.name}
                          </span>
                          {item.details && (
                            <span className="font-mono text-[10px] text-neutral-400 ml-1.5">
                              ({item.details})
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 shrink-0">
                        {item.isPacked ? 'packed' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Small Separate Notes Container */}
      <div className="border border-neutral-300 bg-neutral-50 p-3 font-mono text-[11px] text-neutral-700 space-y-2 mt-0">
        <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
          Reference Notes
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {NOTES.map((note) => (
            <div key={note.id} className="border border-neutral-200 bg-white p-2.5">
              <div className="font-bold text-[11px] text-black mb-1 uppercase tracking-tight">
                {note.title}
              </div>
              <div className="text-[11px] text-neutral-600">
                {note.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Very Tiny Action Buttons at the Bottom */}
      <div className="pt-2 pb-1 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] text-neutral-500">
        <div className="flex items-center gap-2">
          <span>{packedCount}/{totalCount} packed ({progressPct}%)</span>
          <span className="text-neutral-300">•</span>
          <button
            onClick={collapseAll}
            className="hover:text-black underline underline-offset-2"
          >
            fold all
          </button>
          <span>/</span>
          <button
            onClick={expandAll}
            className="hover:text-black underline underline-offset-2"
          >
            unfold all
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenImageModal}
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
            onClick={onPackAll}
            className="border border-neutral-300 hover:border-black bg-white hover:bg-neutral-100 px-2 py-0.5 uppercase transition text-[10px] text-neutral-600"
          >
            [pack all]
          </button>
          <button
            onClick={onResetAll}
            className="border border-neutral-300 hover:border-black bg-white hover:bg-neutral-100 px-2 py-0.5 uppercase transition text-[10px] text-neutral-600"
          >
            [reset]
          </button>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="border border-neutral-300 hover:border-black bg-white hover:bg-neutral-100 px-2 py-0.5 uppercase transition text-[10px] text-neutral-600"
          >
            [+ add item]
          </button>
        </div>
      </div>
    </div>
  );
};
