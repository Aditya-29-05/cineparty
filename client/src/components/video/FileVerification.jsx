import React from 'react';
import { CheckCircle2, AlertTriangle, Film, Clock, HardDrive, FileType, RefreshCw } from 'lucide-react';
import { formatTime } from '../../utils/formatTime';
import { formatFileSize, getFileExtension } from '../../utils/fileUtils';
import { compareVideoMetadata } from '../../utils/videoUtils';

export default function FileVerification({
  localMetadata,
  expectedMetadata,
  isHost,
  onSetAsRoomReference,
  onChangeFile,
}) {
  if (!localMetadata) return null;

  const comparison = compareVideoMetadata(localMetadata, expectedMetadata);
  const hasExpected = Boolean(expectedMetadata && expectedMetadata.duration);

  return (
    <div className="p-4 rounded-xl bg-[#12151e] border border-[#242838] flex flex-col gap-3">
      {/* Status Banner */}
      {hasExpected ? (
        comparison.isMatched ? (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>✓ File matched with room reference. Playback will sync accurately.</span>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/50 text-xs text-amber-300 space-y-1.5">
            <div className="flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>File mismatch detected</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#9aa2b5] bg-[#0b0d13]/60 p-2 rounded border border-[#242838]">
              <div>
                <span className="text-[#5e667d]">Expected duration: </span>
                <span className="text-white font-mono">{formatTime(expectedMetadata.duration)}</span>
              </div>
              <div>
                <span className="text-[#5e667d]">Your duration: </span>
                <span className="text-amber-300 font-mono">{formatTime(localMetadata.duration)}</span>
              </div>
            </div>
            <p className="text-[11px] text-amber-400/80">
              Please select the correct file copy to avoid synchronization drift.
            </p>
          </div>
        )
      ) : (
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-[#161a25] border border-[#242838] text-xs text-[#9aa2b5]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
            <span>✓ Local file loaded and verified</span>
          </div>
          {isHost && onSetAsRoomReference && (
            <button
              onClick={onSetAsRoomReference}
              className="px-2.5 py-1 rounded bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[11px] font-medium transition-colors"
            >
              Set as Room Reference
            </button>
          )}
        </div>
      )}

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 rounded-lg bg-[#0b0d13] border border-[#242838]">
          <div className="flex items-center gap-1.5 text-[#5e667d] mb-1">
            <Film className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>Movie</span>
          </div>
          <p className="font-medium text-white truncate" title={localMetadata.fileName}>
            {localMetadata.fileName}
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-[#0b0d13] border border-[#242838]">
          <div className="flex items-center gap-1.5 text-[#5e667d] mb-1">
            <Clock className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>Duration</span>
          </div>
          <p className="font-mono font-medium text-white">
            {formatTime(localMetadata.duration)}
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-[#0b0d13] border border-[#242838]">
          <div className="flex items-center gap-1.5 text-[#5e667d] mb-1">
            <HardDrive className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>Size</span>
          </div>
          <p className="font-mono font-medium text-white">
            {formatFileSize(localMetadata.fileSize)}
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-[#0b0d13] border border-[#242838]">
          <div className="flex items-center gap-1.5 text-[#5e667d] mb-1">
            <FileType className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>Format</span>
          </div>
          <p className="font-mono font-medium text-white">
            {getFileExtension(localMetadata.fileName) || 'MP4'}
          </p>
        </div>
      </div>

      {/* Change file action */}
      {onChangeFile && (
        <div className="flex justify-end">
          <button
            onClick={onChangeFile}
            className="inline-flex items-center gap-1 text-[11px] text-[#9aa2b5] hover:text-white transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Change local file</span>
          </button>
        </div>
      )}
    </div>
  );
}
