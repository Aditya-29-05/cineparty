import React, { useRef, useState } from 'react';
import { UploadCloud, Film, HardDrive, AlertCircle } from 'lucide-react';
import { extractVideoMetadata } from '../../utils/videoUtils';

export default function FilePicker({ onFileSelected, isHost }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|mkv|webm|mov|m4v|avi)$/i)) {
      setError('Please select a valid video file (MP4, WebM, MKV, MOV).');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      const metadata = await extractVideoMetadata(file);
      const videoUrl = URL.createObjectURL(file);
      onFileSelected({
        file,
        url: videoUrl,
        metadata,
      });
    } catch (err) {
      setError(err.message || 'Could not parse video metadata. Try converting to MP4/WebM.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        accept="video/*,.mkv,.mp4,.webm,.mov"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-colors flex flex-col items-center justify-center ${
          isDragging
            ? 'border-[#2563eb] bg-[#2563eb]/5'
            : 'border-[#242838] hover:border-[#363c52] bg-[#12151e]'
        }`}
      >
        <div className="w-12 h-12 rounded-xl bg-[#161a25] border border-[#242838] flex items-center justify-center text-[#2563eb] mb-4">
          {isProcessing ? (
            <div className="w-5 h-5 rounded-full border-2 border-[#2563eb] border-t-transparent animate-spin" />
          ) : (
            <HardDrive className="w-6 h-6" />
          )}
        </div>

        <h3 className="text-base font-semibold text-white mb-1">
          {isProcessing
            ? 'Reading video metadata locally...'
            : isHost
            ? 'Select Room Movie File'
            : 'Select Your Local Copy of the Movie'}
        </h3>

        <p className="text-xs text-[#9aa2b5] max-w-sm mb-4">
          Drag and drop your local video file here, or click to browse. Supported formats: MP4, WebM, MKV.
        </p>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161a25] border border-[#242838] text-[11px] text-[#5e667d]">
          <Film className="w-3 h-3 text-[#2563eb]" />
          <span>Local playback only • No server upload</span>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 rounded-lg bg-red-950/40 border border-red-800/60 flex items-start gap-2.5 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
