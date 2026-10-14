import React, { useState, useRef, useEffect } from 'react';
import {
  FaPaperPlane,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVolumeUp,
  FaVolumeMute,
  FaRobot,
  FaUser,
} from 'react-icons/fa';
import chatApi from '../api/chatApi.js';
import { useSpeech } from '../hooks/useSpeech.js';
import { Spinner } from '../components/common/Loading.jsx';

const SAMPLE_PROMPTS = [
  'Cách viết CV cho sinh viên mới ra trường?',
  'Làm thế nào để ứng tuyển hiệu quả trên JobNest?',
  'Cách đàm phán mức lương khi phỏng vấn?',
  'Ngành CNTT hiện tại cần những kỹ năng gì?',
];

export default function Support() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Xin chào! Tôi là Trợ lý AI của JobNest. Tôi có thể hỗ trợ bạn tìm kiếm việc làm, tư vấn tối ưu hóa CV hoặc giải đáp các thắc mắc về thị trường tuyển dụng. Bạn muốn hỏi điều gì hôm nay?',
      time: 'Vừa xong',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const { isListening, isSpeaking, currentSpeakingId, startListening, stopListening, speak } =
    useSpeech();

  const chatBodyRef = useRef(null);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageText = input) => {
    const textToSend = messageText.trim();
    if (!textToSend || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await chatApi.sendMessage({ message: textToSend, history });
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: res.reply || 'Cảm ơn bạn đã đặt câu hỏi. Tôi luôn sẵn sàng hỗ trợ bạn!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Rất tiếc, đã có lỗi kết nối tới máy chủ. Vui lòng thử lại sau giây lát.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((transcript) => {
        setInput(transcript);
      });
    }
  };

  return (
    <div className="support-page py-4">
      <div className="container-app">
        <div className="chat-window-card mx-auto shadow-sm border rounded bg-white overflow-hidden">
          {/* Header Chat */}
          <div className="chat-header p-3 border-bottom d-flex align-items-center justify-content-between bg-white">
            <div className="d-flex align-items-center gap-2">
              <div className="chat-avatar-bot bg-warning-subtle text-warning p-2 rounded-circle">
                <FaRobot size={20} />
              </div>
              <div>
                <h1 className="fs-6 fw-bold mb-0">Trợ lý AI JobNest</h1>
                <span className="small text-success d-inline-flex align-items-center gap-1">
                  <span className="online-dot" /> Trực tuyến & Sẵn sàng hỗ trợ
                </span>
              </div>
            </div>
            <span className="badge bg-light text-muted border small">Hỗ trợ 24/7</span>
          </div>

          {/* Vùng Tin nhắn */}
          <div className="chat-body p-3 overflow-auto" ref={chatBodyRef} style={{ height: '480px' }}>
            {messages.map((m) => {
              const isBot = m.sender === 'bot';
              return (
                <div
                  key={m.id}
                  className={`chat-message-row d-flex mb-3 ${isBot ? 'justify-content-start' : 'justify-content-end'}`}
                >
                  <div className={`d-flex gap-2 max-w-75 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div
                      className={`avatar-bubble rounded-circle d-flex align-items-center justify-content-center shrink-0 ${
                        isBot ? 'bg-warning-subtle text-dark' : 'bg-secondary text-white'
                      }`}
                      style={{ width: '32px', height: '32px' }}
                    >
                      {isBot ? <FaRobot size={14} /> : <FaUser size={12} />}
                    </div>

                    <div>
                      <div
                        className={`p-3 rounded-3 shadow-sm ${
                          isBot ? 'bg-light text-dark border' : 'bg-warning text-dark fw-medium'
                        }`}
                        style={{ whiteSpace: 'pre-line', fontSize: '14px', lineHeight: '1.6' }}
                      >
                        {m.text}
                      </div>

                      <div
                        className={`d-flex align-items-center gap-2 mt-1 px-1 ${
                          isBot ? 'justify-content-start' : 'justify-content-end'
                        }`}
                      >
                        <span className="text-muted" style={{ fontSize: '11px' }}>
                          {m.time}
                        </span>
                        {/* Nút Loa đọc to cho tin của Bot */}
                        {isBot && (
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-muted p-0"
                            onClick={() => speak(m.text, m.id)}
                            title={isSpeaking && currentSpeakingId === m.id ? 'Dừng đọc' : 'Đọc to câu trả lời'}
                          >
                            {isSpeaking && currentSpeakingId === m.id ? (
                              <FaVolumeMute size={12} className="text-danger" />
                            ) : (
                              <FaVolumeUp size={12} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="d-flex align-items-center gap-2 text-muted small py-2">
                <Spinner size="sm" />
                <span>Trợ lý AI đang soạn câu trả lời...</span>
              </div>
            )}
          </div>

          {/* Gợi ý câu hỏi mẫu */}
          <div className="chat-prompts-bar px-3 py-2 bg-light border-top d-flex gap-2 overflow-auto">
            {SAMPLE_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="btn btn-sm btn-outline-secondary text-nowrap rounded-pill small"
                style={{ fontSize: '12px' }}
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Khung Nhập & Gửi tin */}
          <div className="chat-footer p-3 border-top bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="d-flex align-items-center gap-2"
            >
              {/* Nút Micro */}
              <button
                type="button"
                className={`btn btn-outline-secondary rounded-circle p-2 ${
                  isListening ? 'btn-danger text-white border-danger' : ''
                }`}
                onClick={handleMicToggle}
                title={isListening ? 'Đang lắng nghe... Bấm để dừng' : 'Bấm để nói bằng giọng nói'}
              >
                {isListening ? <FaMicrophoneSlash size={16} /> : <FaMicrophone size={16} />}
              </button>

              <input
                type="text"
                className="form-control"
                placeholder={isListening ? 'Đang lắng nghe bạn nói...' : 'Nhập câu hỏi của bạn...'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />

              <button
                type="submit"
                className="btn btn-brand fw-semibold d-inline-flex align-items-center gap-1"
                disabled={loading || !input.trim()}
              >
                <span>Gửi</span>
                <FaPaperPlane size={13} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
