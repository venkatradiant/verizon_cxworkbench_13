import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Mail, 
  Video, 
  FileText, 
  Clipboard, 
  FileType, 
  Eye, 
  ExternalLink, 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Calendar,
  User,
  Bot,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

const Motion = motion;

interface AIContextSource {
  id: string;
  sourceType: 'Slack' | 'Email' | 'Meeting Recording' | 'Transcript' | 'Jira' | 'External Document';
  title: string;
  subtitle?: string;
  timestamp: string;
  owner?: string;
  channel?: string;
  duration?: string;
  videoUrl?: string;
  transcript?: Array<{ time: string; text: string }>;
  summary: string;
  isIncluded: boolean;
  isAutomatic: boolean;
  metadata?: Record<string, any>;
}

interface AIContextSourcesPanelProps {
  sources: AIContextSource[];
  onToggleInclude: (sourceId: string, included: boolean) => void;
  onOpenSource: (source: AIContextSource) => void;
}

export const AIContextSourcesPanel: React.FC<AIContextSourcesPanelProps> = ({
  sources,
  onToggleInclude,
  onOpenSource
}) => {
  const [selectedSource, setSelectedSource] = useState<AIContextSource | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [highlightedTranscriptIndex, setHighlightedTranscriptIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Calculate source breakdown
  const sourceBreakdown = sources.reduce((acc, source) => {
    const type = source.sourceType;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'Slack': return MessageSquare;
      case 'Email': return Mail;
      case 'Meeting Recording': return Video;
      case 'Transcript': return FileText;
      case 'Jira': return Clipboard;
      case 'External Document': return FileType;
      default: return FileText;
    }
  };

  const getSourceColor = (type: string) => {
    switch (type) {
      case 'Slack': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700';
      case 'Email': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700';
      case 'Meeting Recording': return 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/20 border-rose-300 dark:border-rose-700';
      case 'Transcript': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700';
      case 'Jira': return 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700';
      case 'External Document': return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700';
      default: return 'text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900/20 border-zinc-300 dark:border-zinc-700';
    }
  };

  const handleTranscriptClick = (time: string, index: number) => {
    if (videoRef.current) {
      const [hours, minutes, seconds] = time.split(':').map(Number);
      const totalSeconds = (hours || 0) * 3600 + minutes * 60 + seconds;
      videoRef.current.currentTime = totalSeconds;
      setHighlightedTranscriptIndex(index);
      
      // Auto-scroll to highlighted transcript
      if (transcriptRef.current) {
        const highlightedEl = transcriptRef.current.children[index] as HTMLElement;
        if (highlightedEl) {
          highlightedEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Panel */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-[16px] font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
              AI Context Sources Used: {sources.length}
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              {Object.entries(sourceBreakdown).map(([type, count]) => (
                <div key={type} className="flex items-center gap-1.5 text-[12px] text-indigo-700 dark:text-indigo-300 font-bold">
                  <span className="font-black">{type}</span>
                  <span className="px-1.5 py-0.5 bg-indigo-200 dark:bg-indigo-800 rounded text-[10px] font-black">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[12px] text-indigo-600 dark:text-indigo-400 font-medium max-w-md">
            These sources were used to enrich AI recommendations. Review or exclude any before proceeding.
          </p>
        </div>
      </div>

      {/* Source Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sources.map((source) => {
          const IconComponent = getSourceIcon(source.sourceType);
          const colorClasses = getSourceColor(source.sourceType);
          
          return (
            <div
              key={source.id}
              className={clsx(
                "flex flex-col gap-4 p-5 bg-white dark:bg-zinc-900 border-2 rounded-xl transition-all",
                source.isIncluded 
                  ? "border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700" 
                  : "border-zinc-100 dark:border-zinc-900 opacity-60"
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center border-2 shrink-0", colorClasses)}>
                    <IconComponent size={18} />
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                        {source.sourceType}
                      </span>
                      {source.channel && (
                        <span className="text-[11px] text-muted-foreground">• {source.channel}</span>
                      )}
                    </div>
                    <h4 className="text-[14px] font-bold text-foreground line-clamp-2">{source.title}</h4>
                    {source.subtitle && (
                      <p className="text-[12px] text-muted-foreground line-clamp-1">{source.subtitle}</p>
                    )}
                  </div>
                </div>

                {/* Include Toggle */}
                <button
                  onClick={() => onToggleInclude(source.id, !source.isIncluded)}
                  className={clsx(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-[11px] font-bold transition-all shrink-0",
                    source.isIncluded
                      ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                      : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-muted-foreground"
                  )}
                >
                  {source.isIncluded ? (
                    <>
                      <CheckCircle2 size={12} />
                      Included
                    </>
                  ) : (
                    <>
                      <XCircle size={12} />
                      Excluded
                    </>
                  )}
                </button>
              </div>

              {/* Metadata Row */}
              <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar size={11} />
                  <span>{source.timestamp}</span>
                </div>
                {source.owner && (
                  <div className="flex items-center gap-1.5">
                    <User size={11} />
                    <span>{source.owner}</span>
                  </div>
                )}
                {source.duration && (
                  <div className="flex items-center gap-1.5">
                    <Video size={11} />
                    <span>{source.duration}</span>
                  </div>
                )}
                {source.isAutomatic && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded text-[9px] font-black text-blue-700 dark:text-blue-300 uppercase">
                    <Bot size={9} />
                    Auto
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => setSelectedSource(source)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-[12px] font-bold text-foreground transition-all"
                >
                  <Eye size={14} />
                  View {source.sourceType === 'Meeting Recording' ? 'Recording' : 'Summary'}
                </button>
                <button
                  onClick={() => onOpenSource(source)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/20 hover:bg-indigo-200 dark:hover:bg-indigo-900/40 border border-indigo-300 dark:border-indigo-700 rounded-lg text-[12px] font-bold text-indigo-700 dark:text-indigo-300 transition-all"
                >
                  <ExternalLink size={14} />
                  Open
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Source Detail Modal */}
      <AnimatePresence>
        {selectedSource && (
          <>
            <div 
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setSelectedSource(null)}
            />
            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
            >
              <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    {React.createElement(getSourceIcon(selectedSource.sourceType), {
                      size: 20,
                      className: 'text-indigo-600 dark:text-indigo-400'
                    })}
                    <div>
                      <h3 className="text-[18px] font-bold text-foreground">{selectedSource.title}</h3>
                      <p className="text-[12px] text-muted-foreground">{selectedSource.sourceType} • {selectedSource.timestamp}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSource(null)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <X size={20} className="text-muted-foreground" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {selectedSource.sourceType === 'Meeting Recording' && selectedSource.videoUrl ? (
                    <div className="flex flex-col gap-6">
                      {/* Video Player */}
                      <div className="relative bg-zinc-900 rounded-xl overflow-hidden">
                        <video
                          ref={videoRef}
                          className="w-full aspect-video"
                          src={selectedSource.videoUrl}
                          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                          onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                        />
                        
                        {/* Video Controls Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                if (videoRef.current) {
                                  if (isVideoPlaying) {
                                    videoRef.current.pause();
                                  } else {
                                    videoRef.current.play();
                                  }
                                  setIsVideoPlaying(!isVideoPlaying);
                                }
                              }}
                              className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
                            >
                              {isVideoPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
                            </button>
                            
                            <div className="flex-1 flex items-center gap-2">
                              <span className="text-[12px] text-white font-bold">{formatTime(currentTime)}</span>
                              <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-white transition-all"
                                  style={{ width: `${(currentTime / (videoRef.current?.duration || 1)) * 100}%` }}
                                />
                              </div>
                              <span className="text-[12px] text-white font-bold">
                                {videoRef.current?.duration ? formatTime(videoRef.current.duration) : selectedSource.duration}
                              </span>
                            </div>

                            <button
                              onClick={() => {
                                if (videoRef.current) {
                                  videoRef.current.muted = !isMuted;
                                  setIsMuted(!isMuted);
                                }
                              }}
                              className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
                            >
                              {isMuted ? <VolumeX size={20} className="text-white" /> : <Volume2 size={20} className="text-white" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Transcript */}
                      {selectedSource.transcript && selectedSource.transcript.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <h4 className="text-[14px] font-bold text-foreground">Transcript with Timestamps</h4>
                          <div 
                            ref={transcriptRef}
                            className="flex flex-col gap-2 max-h-[400px] overflow-y-auto bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4"
                          >
                            {selectedSource.transcript.map((entry, index) => (
                              <button
                                key={index}
                                onClick={() => handleTranscriptClick(entry.time, index)}
                                className={clsx(
                                  "flex gap-3 p-3 rounded-lg text-left transition-all cursor-pointer",
                                  highlightedTranscriptIndex === index
                                    ? "bg-indigo-100 dark:bg-indigo-900/30 border-2 border-indigo-300 dark:border-indigo-700"
                                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800 border-2 border-transparent"
                                )}
                              >
                                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 shrink-0 font-mono">
                                  {entry.time}
                                </span>
                                <span className="text-[13px] text-foreground leading-relaxed">{entry.text}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Text Summary */
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
                        <h4 className="text-[14px] font-bold text-foreground mb-4">Extracted Summary</h4>
                        <pre className="whitespace-pre-wrap text-[13px] text-foreground leading-relaxed font-normal">
                          {selectedSource.summary}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleInclude(selectedSource.id, !selectedSource.isIncluded)}
                      className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-[13px] font-bold transition-all",
                        selectedSource.isIncluded
                          ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                          : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-muted-foreground"
                      )}
                    >
                      {selectedSource.isIncluded ? 'Included in AI Analysis' : 'Excluded from AI Analysis'}
                    </button>
                  </div>
                  <button
                    onClick={() => onOpenSource(selectedSource)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[13px] font-bold transition-all"
                  >
                    <ExternalLink size={16} />
                    Open Original Source
                  </button>
                </div>
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
