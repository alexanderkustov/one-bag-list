import React, { useEffect, useRef, useState } from 'react';
import { Download, Copy, Check, X, Smartphone, RefreshCw, FileText } from 'lucide-react';
import { ChecklistItem, ExportRatio, ExportTheme } from '../types';
import { renderChecklistToCanvas } from '../utils/canvasRenderer';

interface ImageGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ChecklistItem[];
}

export const ImageGeneratorModal: React.FC<ImageGeneratorModalProps> = ({
  isOpen,
  onClose,
  items,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [theme, setTheme] = useState<ExportTheme>('bw-light');
  const [ratio, setRatio] = useState<ExportRatio>('poster');
  const [imageDataUrl, setImageDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setIsRendering(true);
    const timer = setTimeout(() => {
      if (canvasRef.current) {
        const url = renderChecklistToCanvas(canvasRef.current, {
          theme,
          ratio,
          items,
        });
        setImageDataUrl(url);
      }
      setIsRendering(false);
    }, 40);

    return () => clearTimeout(timer);
  }, [isOpen, theme, ratio, items]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!imageDataUrl) return;
    const a = document.createElement('a');
    a.href = imageDataUrl;
    a.download = `one-bag-travel-${theme}-${ratio}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white text-black border-2 border-black rounded-none shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-mono font-bold text-xs">
              IMG
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight uppercase">
                Image Generator / Export
              </h3>
              <p className="text-xs text-neutral-500 font-mono">
                B&W Editorial Checklist Image • One Bag Travel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold border border-black hover:bg-neutral-100 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'COPIED' : 'COPY'}
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold bg-black text-white hover:bg-neutral-800 transition"
            >
              <Download className="w-3.5 h-3.5" />
              DOWNLOAD PNG
            </button>
            <button
              onClick={onClose}
              className="p-1.5 border border-black hover:bg-black hover:text-white transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-2.5 border-b border-neutral-200 bg-neutral-50 text-xs font-mono">
          {/* Theme */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 uppercase">Scheme:</span>
            <div className="flex border border-black p-0.5 bg-white">
              <button
                onClick={() => setTheme('bw-light')}
                className={`px-3 py-1 font-bold transition ${
                  theme === 'bw-light'
                    ? 'bg-black text-white'
                    : 'text-neutral-700 hover:text-black'
                }`}
              >
                Paper White (B&W)
              </button>
              <button
                onClick={() => setTheme('bw-dark')}
                className={`px-3 py-1 font-bold transition ${
                  theme === 'bw-dark'
                    ? 'bg-black text-white'
                    : 'text-neutral-700 hover:text-black'
                }`}
              >
                Inverted Dark
              </button>
            </div>
          </div>

          {/* Ratio */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 uppercase">Format:</span>
            <div className="flex border border-black p-0.5 bg-white">
              <button
                onClick={() => setRatio('poster')}
                className={`px-3 py-1 font-bold transition ${
                  ratio === 'poster'
                    ? 'bg-black text-white'
                    : 'text-neutral-700 hover:text-black'
                }`}
              >
                Poster (3:4)
              </button>
              <button
                onClick={() => setRatio('story')}
                className={`px-3 py-1 font-bold transition flex items-center gap-1 ${
                  ratio === 'story'
                    ? 'bg-black text-white'
                    : 'text-neutral-700 hover:text-black'
                }`}
              >
                <Smartphone className="w-3 h-3" /> Lockscreen (9:16)
              </button>
              <button
                onClick={() => setRatio('square')}
                className={`px-3 py-1 font-bold transition ${
                  ratio === 'square'
                    ? 'bg-black text-white'
                    : 'text-neutral-700 hover:text-black'
                }`}
              >
                Square (1:1)
              </button>
            </div>
          </div>
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Image Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-neutral-200/50 min-h-[460px]">
          {isRendering ? (
            <div className="flex flex-col items-center justify-center gap-3 text-neutral-500 font-mono text-xs py-20">
              <RefreshCw className="w-6 h-6 animate-spin text-black" />
              <span>RENDERING B&W POSTER...</span>
            </div>
          ) : imageDataUrl ? (
            <div className="relative group max-h-[62vh] flex items-center justify-center">
              <img
                src={imageDataUrl}
                alt="One Bag Travel Checklist B&W Poster"
                className="max-h-[62vh] w-auto shadow-2xl border-2 border-black object-contain bg-white"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-90 group-hover:opacity-100 transition">
                <span className="text-[10px] font-mono bg-black text-white px-2 py-1">
                  {ratio === 'story' ? '1080 × 1920 PX' : ratio === 'square' ? '1200 × 1200 PX' : '1200 × 1600 PX'}
                </span>
                <button
                  onClick={handleDownload}
                  className="bg-black text-white hover:bg-neutral-800 text-xs font-mono font-bold px-3 py-1 border border-black shadow flex items-center gap-1.5 transition"
                >
                  <Download className="w-3 h-3" />
                  SAVE PNG
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t-2 border-black bg-white flex items-center justify-between text-xs font-mono text-neutral-600">
          <span>HTTPSTER EDITORIAL MONOCHROME EXPORT</span>
          <span>HIGH DENSITY • CARRY-ON SPEC</span>
        </div>
      </div>
    </div>
  );
};
