import { useState, useEffect, useRef, useCallback } from 'react';

export function useSpeech() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Khởi tạo SpeechRecognition bản địa của trình duyệt
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'vi-VN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  // Bắt đầu nghe giọng nói tiếng Việt
  const startListening = useCallback((onResult) => {
    if (!recognitionRef.current) {
      alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói (Web Speech API).');
      return;
    }

    try {
      recognitionRef.current.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        if (onResult) onResult(transcript);
      };
      recognitionRef.current.start();
    } catch {
      recognitionRef.current.stop();
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  // Đọc to đoạn văn bằng giọng tiếng Việt
  const speak = useCallback((text, id = null) => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn chưa hỗ trợ phát âm (Speech Synthesis).');
      return;
    }

    // Nếu đang đọc chính tin này thì dừng lại
    if (isSpeaking && currentSpeakingId === id) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel(); // Dừng câu trước đó nếu có
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakingId(id);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };

    window.speechSynthesis.speak(utterance);
  }, [isSpeaking, currentSpeakingId]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    currentSpeakingId,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
