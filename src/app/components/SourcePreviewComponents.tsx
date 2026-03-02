import React from 'react';
import { clsx } from 'clsx';
import { 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Play, 
  Clock, 
  Users as UsersIcon,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

interface FigmaPreviewProps {
  frames: Array<{ id: string; name: string; thumbnail?: string }>;
  metadata: { fileName?: string; lastUpdated?: string; owner?: string };
}

export const FigmaInlinePreview: React.FC<FigmaPreviewProps> = ({ frames, metadata }) => {
  return (
    <div className="mt-4 pt-4 border-t border-border flex flex-col gap-4">
      {/* Metadata */}
      <div className="grid grid-cols-2 gap-3 text-[12px]">
        <div>
          <span className="text-muted-foreground">File Name:</span>
          <p className="font-mono text-foreground text-[11px] mt-0.5">{metadata.fileName}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Owner:</span>
          <p className="font-bold text-foreground mt-0.5">{metadata.owner}</p>
        </div>
        <div className="col-span-2">
          <span className="text-muted-foreground">Last Updated:</span>
          <p className="font-bold text-foreground mt-0.5">{metadata.lastUpdated}</p>
        </div>
      </div>

      {/* Frame Thumbnails */}
      <div>
        <h5 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Frames ({frames.length})
        </h5>
        <div className="grid grid-cols-2 gap-3">
          {frames.map((frame) => (
            <div 
              key={frame.id}
              className="bg-surface-secondary border border-border rounded-lg p-3 hover:border-accent transition-all cursor-pointer group"
            >
              <div className="w-full aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-md mb-2 flex items-center justify-center">
                <ImageIcon size={24} className="text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
              <p className="text-[11px] font-bold text-foreground truncate">{frame.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2">
        <button className="flex-1 px-3 py-2 bg-accent text-white hover:bg-accent/90 rounded-lg text-[12px] font-bold transition-all flex items-center justify-center gap-2">
          <ExternalLink size={14} />
          Open Full File
        </button>
      </div>
    </div>
  );
};

interface MeetingPreviewProps {
  transcript: Array<{ time: string; speaker: string; text: string }>;
  metadata: { duration?: string; date?: string; attendees?: string[] };
}

export const MeetingInlinePreview: React.FC<MeetingPreviewProps> = ({ transcript, metadata }) => {
  return (
    <div className="mt-4 pt-4 border-t border-border flex flex-col gap-4">
      {/* Metadata */}
      <div className="grid grid-cols-2 gap-3 text-[12px]">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-muted-foreground" />
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Duration</span>
            <p className="font-bold text-foreground">{metadata.duration}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UsersIcon size={14} className="text-muted-foreground" />
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Attendees</span>
            <p className="font-bold text-foreground">{metadata.attendees?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Attendees List */}
      {metadata.attendees && metadata.attendees.length > 0 && (
        <div>
          <h5 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Participants
          </h5>
          <div className="flex flex-wrap gap-2">
            {metadata.attendees.map((attendee, idx) => (
              <span 
                key={idx}
                className="px-2 py-1 bg-surface-secondary border border-border rounded text-[11px] font-medium text-foreground"
              >
                {attendee}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Transcript Preview */}
      <div>
        <h5 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Transcript Preview
        </h5>
        <div className="bg-surface-secondary border border-border rounded-lg p-4 max-h-[300px] overflow-y-auto flex flex-col gap-3">
          {transcript.slice(0, 6).map((entry, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <button className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                  {entry.time}
                </button>
                <span className="text-[11px] font-bold text-foreground">{entry.speaker}</span>
              </div>
              <p className="text-[12px] text-muted-foreground leading-relaxed pl-16">
                {entry.text}
              </p>
            </div>
          ))}
          {transcript.length > 6 && (
            <p className="text-[11px] text-muted-foreground italic text-center pt-2 border-t border-border">
              + {transcript.length - 6} more entries
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="flex-1 px-3 py-2 bg-accent text-white hover:bg-accent/90 rounded-lg text-[12px] font-bold transition-all flex items-center justify-center gap-2">
          <Play size={14} />
          Watch Recording
        </button>
        <button className="flex-1 px-3 py-2 bg-surface-secondary border border-border hover:border-accent rounded-lg text-[12px] font-bold text-foreground transition-all flex items-center justify-center gap-2">
          <FileText size={14} />
          View Full Transcript
        </button>
      </div>
    </div>
  );
};

interface EmailSlackPreviewProps {
  fullContent: string;
  metadata: { subject?: string; sender?: string; date?: string };
  type: 'email' | 'slack';
}

export const EmailSlackInlinePreview: React.FC<EmailSlackPreviewProps> = ({ fullContent, metadata, type }) => {
  return (
    <div className="mt-4 pt-4 border-t border-border flex flex-col gap-4">
      {/* Metadata */}
      <div className="grid grid-cols-1 gap-2 text-[12px]">
        {type === 'email' && metadata.subject && (
          <div>
            <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-1">Subject</span>
            <p className="font-bold text-foreground">{metadata.subject}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-1">
              {type === 'email' ? 'From' : 'Participants'}
            </span>
            <p className="font-bold text-foreground">{metadata.sender}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-1">Date</span>
            <p className="font-bold text-foreground">{metadata.date}</p>
          </div>
        </div>
      </div>

      {/* Body Preview */}
      <div>
        <h5 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
          {type === 'email' ? 'Email Body' : 'Thread Content'}
        </h5>
        <div className="bg-surface-secondary border border-border rounded-lg p-4 max-h-[300px] overflow-y-auto">
          <pre className="text-[12px] text-foreground whitespace-pre-wrap font-sans leading-relaxed">
            {fullContent}
          </pre>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="flex-1 px-3 py-2 bg-accent text-white hover:bg-accent/90 rounded-lg text-[12px] font-bold transition-all flex items-center justify-center gap-2">
          <ExternalLink size={14} />
          Open Original Source
        </button>
      </div>
    </div>
  );
};

interface DocumentPreviewProps {
  metadata: { fileName?: string; lastUpdated?: string; owner?: string };
}

export const DocumentInlinePreview: React.FC<DocumentPreviewProps> = ({ metadata }) => {
  return (
    <div className="mt-4 pt-4 border-t border-border flex flex-col gap-4">
      {/* Metadata */}
      <div className="grid grid-cols-2 gap-3 text-[12px]">
        <div className="col-span-2">
          <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-1">File Name</span>
          <p className="font-mono text-foreground text-[11px]">{metadata.fileName}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-1">Owner</span>
          <p className="font-bold text-foreground">{metadata.owner}</p>
        </div>
        <div>
          <span className="text-muted-foreground text-[10px] uppercase font-bold block mb-1">Last Updated</span>
          <p className="font-bold text-foreground">{metadata.lastUpdated}</p>
        </div>
      </div>

      {/* Note about external link */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-[12px] text-blue-800 dark:text-blue-300">
          This document is stored externally. Click below to open in Google Drive.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="flex-1 px-3 py-2 bg-accent text-white hover:bg-accent/90 rounded-lg text-[12px] font-bold transition-all flex items-center justify-center gap-2">
          <ExternalLink size={14} />
          Open in Google Drive
        </button>
      </div>
    </div>
  );
};