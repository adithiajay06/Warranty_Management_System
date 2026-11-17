import React, { useRef, useState } from 'react';
import { FileText, Image as ImageIcon, Upload, X } from 'lucide-react';

export interface UploadedInvoiceFile {
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

interface UploadZoneProps {
  file: UploadedInvoiceFile | null;
  onFileSelect: (file: UploadedInvoiceFile | null) => void;
  onError?: (msg: string) => void;
  acceptLabel?: string;
}

const ACCEPTED_MIME = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export function UploadZone({
  file,
  onFileSelect,
  onError,
  acceptLabel = 'Supports JPG, PNG, or PDF up to 10 MB',
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (rawFile: File) => {
    const extValid = /\.(jpe?g|png|pdf)$/i.test(rawFile.name);
    if (!ACCEPTED_MIME.includes(rawFile.type) && !extValid) {
      onError?.('Unsupported file type. Please upload a JPG, PNG, or PDF invoice.');
      return;
    }
    if (rawFile.size > MAX_SIZE_BYTES) {
      onError?.('File exceeds 10 MB limit. Please select a smaller invoice file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onFileSelect({
        name: rawFile.name,
        size: rawFile.size,
        type: rawFile.type || (rawFile.name.endsWith('.pdf') ? 'application/pdf' : 'image/png'),
        dataUrl: typeof reader.result === 'string' ? reader.result : '',
      });
    };
    reader.readAsDataURL(rawFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) processFile(dropped);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) processFile(selected);
    e.target.value = '';
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (file) {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {isPdf ? <FileText className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{file.name}</p>
              <p className="text-xs text-slate-500 tabular-nums dark:text-slate-400">
                {isPdf ? 'PDF Document' : 'Image File'} · {formatBytes(file.size)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onFileSelect(null)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap shrink-0 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Remove</span>
          </button>
        </div>

        {!isPdf && file.dataUrl && (
          <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
            <img
              src={file.dataUrl}
              alt={`Preview of ${file.name}`}
              className="max-h-56 w-full object-contain"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
        isDragging
          ? 'border-blue-600 bg-blue-50/70 dark:border-blue-500 dark:bg-blue-950/30'
          : 'border-slate-300 bg-slate-50/70 hover:border-blue-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/30 dark:hover:border-blue-600'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
        onChange={handleChange}
        className="hidden"
      />
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
        <Upload className="h-6 w-6" aria-hidden="true" />
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
        Drag and drop your purchase invoice here, or click to browse
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{acceptLabel}</p>
    </div>
  );
}
