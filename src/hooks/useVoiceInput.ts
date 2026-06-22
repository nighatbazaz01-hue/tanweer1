"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Web Speech API type declarations (not in all TS DOM libs) ──────────────
interface SpeechRecognitionResultItem {
  readonly transcript: string;
  readonly confidence: number;
}
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionResultItem;
  [index: number]: SpeechRecognitionResultItem;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart:  ((this: ISpeechRecognition, ev: Event) => void) | null;
  onend:    ((this: ISpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror:  ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
interface ISpeechRecognitionCtor {
  new(): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: ISpeechRecognitionCtor;
    webkitSpeechRecognition?: ISpeechRecognitionCtor;
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────
export type VoiceStatus = "idle" | "listening" | "unsupported";
export type VoiceError  = "permission" | "no-speech" | "error" | "unsupported";

export interface UseVoiceInputOptions {
  onTranscript: (text: string) => void;
  onError?:     (error: VoiceError) => void;
  onStart?:     () => void;
  onEnd?:       () => void;
  lang?:        string;
}

export interface UseVoiceInputReturn {
  status:      VoiceStatus;
  start:       () => void;
  stop:        () => void;
  isSupported: boolean;
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useVoiceInput({
  onTranscript,
  onError,
  onStart,
  onEnd,
  lang = "en-IN",
}: UseVoiceInputOptions): UseVoiceInputReturn {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  const onTranscriptRef = useRef(onTranscript);
  const onErrorRef      = useRef(onError);
  const onStartRef      = useRef(onStart);
  const onEndRef        = useRef(onEnd);

  useEffect(() => { onTranscriptRef.current = onTranscript; }, [onTranscript]);
  useEffect(() => { onErrorRef.current      = onError;      }, [onError]);
  useEffect(() => { onStartRef.current      = onStart;      }, [onStart]);
  useEffect(() => { onEndRef.current        = onEnd;        }, [onEnd]);

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setStatus("idle");
  }, []);

  // ESC key stops recording
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") stop();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stop]);

  const start = useCallback(() => {
    if (!isSupported) {
      onErrorRef.current?.("unsupported");
      return;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) {
      onErrorRef.current?.("unsupported");
      return;
    }

    const recognition = new Ctor();
    recognition.continuous      = true;
    recognition.interimResults  = true;
    recognition.lang            = lang;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setStatus("listening");
      onStartRef.current?.();
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript   = "";
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript   += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      onTranscriptRef.current(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const code = event.error;
      if (code === "not-allowed" || code === "permission-denied") {
        onErrorRef.current?.("permission");
      } else if (code === "no-speech") {
        onErrorRef.current?.("no-speech");
      } else {
        onErrorRef.current?.("error");
      }
      setStatus("idle");
      recognitionRef.current = null;
      onEndRef.current?.();
    };

    recognition.onend = () => {
      setStatus("idle");
      recognitionRef.current = null;
      onEndRef.current?.();
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setStatus("idle");
      recognitionRef.current = null;
    }
  }, [isSupported, lang]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
    status:      isSupported ? status : "unsupported",
    start,
    stop,
    isSupported,
  };
}
