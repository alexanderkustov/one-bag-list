import { ChecklistItem, ExportRatio, ExportTheme } from '../types';
import { CATEGORIES_ORDER, NOTES } from '../data/tripData';

interface RenderOptions {
  theme: ExportTheme;
  ratio: ExportRatio;
  items: ChecklistItem[];
}

export function renderChecklistToCanvas(
  canvas: HTMLCanvasElement,
  options: RenderOptions
): string {
  const { theme, ratio, items } = options;

  let width = 1200;
  let height = 1600;

  if (ratio === 'story') {
    width = 1080;
    height = 1920;
  } else if (ratio === 'square') {
    width = 1200;
    height = 1200;
  } else {
    width = 1200;
    height = 1600;
  }

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const isDark = theme === 'bw-dark';
  const bg = isDark ? '#09090b' : '#ffffff';
  const fg = isDark ? '#ffffff' : '#09090b';
  const muted = isDark ? '#71717a' : '#71717a';
  const border = isDark ? '#27272a' : '#09090b';
  const lightBorder = isDark ? '#27272a' : '#e4e4e7';

  // Fill background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const pad = ratio === 'story' ? 56 : 64;
  let curY = pad;

  // Outer border frame (Httpster brutalist framing)
  ctx.strokeStyle = border;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

  const innerPad = 32;
  const contentX = pad + innerPad;
  const contentW = width - (pad + innerPad) * 2;
  curY = pad + innerPad;

  // Understated Editorial Title & Status Line
  const packedCount = items.filter((i) => i.isPacked).length;
  const totalCount = items.length;
  const pct = Math.round((totalCount > 0 ? packedCount / totalCount : 0) * 100);

  ctx.fillStyle = fg;
  ctx.font = '800 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('One Bag Travel', contentX, curY + 12);

  ctx.fillStyle = muted;
  ctx.font = '600 11px ui-monospace, SFMono-Regular, monospace';
  const statusStr = `${packedCount}/${totalCount} PACKED (${pct}%)  •  CARRY-ON SPEC`;
  const statusW = ctx.measureText(statusStr).width;
  ctx.fillText(statusStr, contentX + contentW - statusW, curY + 12);

  curY += 24;

  // Hairline separator
  ctx.strokeStyle = border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(contentX, curY);
  ctx.lineTo(contentX + contentW, curY);
  ctx.stroke();

  curY += 22;

  // Two-column layout for checklist sections
  const colGap = 36;
  const colW = (contentW - colGap) / 2;
  const leftX = contentX;
  const rightX = contentX + colW + colGap;

  let leftY = curY;
  let rightY = curY;

  // 5 checklist categories balanced (18 items left, 19 items right)
  const leftCategories = ['flight', 'clothing'];
  const rightCategories = ['documents', 'electronics', 'toiletries'];

  const drawCategory = (catId: string, x: number, y: number, w: number): number => {
    const catMeta = CATEGORIES_ORDER.find((c) => c.id === catId);
    if (!catMeta) return y;

    const catItems = items.filter((i) => i.category === catId);

    // Section Header
    ctx.fillStyle = fg;
    ctx.font = '800 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`${catMeta.index} / ${catMeta.title.toUpperCase()}`, x, y + 14);

    ctx.fillStyle = muted;
    ctx.font = '600 11px ui-monospace, monospace';
    const countLabel = `(${catItems.filter((i) => i.isPacked).length}/${catItems.length})`;
    const countW = ctx.measureText(countLabel).width;
    ctx.fillText(countLabel, x + w - countW, y + 14);

    y += 24;

    // Header hairline
    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.stroke();

    y += 14;

    // Items
    catItems.forEach((item) => {
      // Checkbox
      const boxSize = 13;
      ctx.strokeStyle = fg;
      ctx.lineWidth = 1.5;

      if (item.isPacked) {
        ctx.fillStyle = fg;
        ctx.fillRect(x, y - 2, boxSize, boxSize);
        // checkmark in inverted color
        ctx.strokeStyle = bg;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 2.5, y + 4.5);
        ctx.lineTo(x + 5.5, y + 8);
        ctx.lineTo(x + 10.5, y + 1.5);
        ctx.stroke();
      } else {
        ctx.strokeRect(x, y - 2, boxSize, boxSize);
      }

      // Text
      ctx.fillStyle = item.isPacked ? muted : fg;
      ctx.font = item.isPacked
        ? '400 12.5px -apple-system, BlinkMacSystemFont, sans-serif'
        : '500 12.5px -apple-system, BlinkMacSystemFont, sans-serif';

      let textName = item.name;
      // Truncate if overflowing
      if (textName.length > 42) {
        textName = textName.substring(0, 40) + '...';
      }
      ctx.fillText(textName, x + 22, y + 9);

      if (item.isPacked) {
        // Strike through
        const tw = ctx.measureText(textName).width;
        ctx.strokeStyle = muted;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 22, y + 5);
        ctx.lineTo(x + 22 + tw, y + 5);
        ctx.stroke();
      }

      y += 24;
    });

    y += 16;
    return y;
  };

  leftCategories.forEach((catId) => {
    leftY = drawCategory(catId, leftX, leftY, colW);
  });

  rightCategories.forEach((catId) => {
    rightY = drawCategory(catId, rightX, rightY, colW);
  });

  // Small Separate Reference Notes Container at bottom
  const notesY = Math.max(leftY, rightY) + 4;
  const noteBoxW = (contentW - colGap) / 2;

  NOTES.forEach((note, idx) => {
    const nx = idx === 0 ? leftX : rightX;
    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    ctx.strokeRect(nx, notesY, noteBoxW, 58);

    ctx.fillStyle = fg;
    ctx.font = '700 11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`NOTE: ${note.title.toUpperCase()}`, nx + 12, notesY + 20);

    ctx.fillStyle = muted;
    ctx.font = '500 11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(note.content, nx + 12, notesY + 40);
  });

  // Footer bar inside border
  const footerY = height - pad - 30;
  ctx.strokeStyle = lightBorder;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(contentX, footerY);
  ctx.lineTo(contentX + contentW, footerY);
  ctx.stroke();

  ctx.fillStyle = muted;
  ctx.font = '600 10px ui-monospace, SFMono-Regular, monospace';
  ctx.fillText('ONE BAG TRAVEL CHECKLIST • CARRY-ON SPEC', contentX, footerY + 18);

  const endStr = 'HTTPSTER EDITORIAL ARCHIVE';
  const dw = ctx.measureText(endStr).width;
  ctx.fillText(endStr, contentX + contentW - dw, footerY + 18);

  return canvas.toDataURL('image/png');
}
