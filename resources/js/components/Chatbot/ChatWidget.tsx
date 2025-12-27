import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, MessageCircle, Send, Sparkles, Trash2, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

type Role = 'admin' | 'guru' | 'siswa' | null;

interface Message {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface ChatWidgetProps {
    isAuthenticated?: boolean;
    userRole?: Role;
    className?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isAuthenticated = false, userRole = null, className = '' }) => {
    // Pesan Awal berupa List Menu (Hardcoded match dengan controller untuk loading awal cepat)
    const initialBotText = `
👋 Halo ${isAuthenticated ? (userRole ? userRole.toUpperCase() : 'User') : 'Tamu'}! 
Silakan pilih informasi yang ingin Anda lihat:

**1.** Total Siswa
**2.** Total Guru
**3.** Total Mata Pelajaran
**4.** Total Kelas Aktif
**5.** Info Tahun Ajaran
**6.** Pengumuman Terbaru
**7.** Tugas (Assignment) Terbaru
**8.** Cek Kehadiran Siswa

_Ketik angkanya (misal: **1**) atau ketik pertanyaan._
    `.trim();

    const initialMessages: Message[] = [{ id: 'greet-1', content: initialBotText, sender: 'bot', timestamp: new Date() }];

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showTips, setShowTips] = useState(true);

    const messagesWrapRef = useRef<HTMLDivElement>(null);

    // Auto-scroll ke bawah
    useEffect(() => {
        const el = messagesWrapRef.current;
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, [messages, isTyping, isOpen]);

    const resetHistory = () => {
        setMessages([{ id: 'greet-reset', content: initialBotText, sender: 'bot', timestamp: new Date() }]);
    };

    const formatTime = (d: Date) => d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    // Format text with simple bold markdown (**text**) and newlines
    const formatMessage = (text: string) => {
        let formatted = text.replace(/\n/g, '<br/>'); // Handle newlines
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Handle bold
        formatted = formatted.replace(/_(.*?)_/g, '<em>$1</em>'); // Handle italic
        return formatted;
    };

    const sendText = async (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: `u-${Date.now()}`,
            content: text.trim(),
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await axios.post('/chatbot', { question: text });
            const replyText = response.data.reply || 'Maaf, saya tidak mengerti.';

            const botMsg: Message = {
                id: `b-${Date.now()}`,
                content: replyText,
                sender: 'bot',
                timestamp: new Date(),
            };

            setTimeout(() => {
                setMessages((prev) => [...prev, botMsg]);
                setIsTyping(false);
            }, 500);
        } catch (err) {
            console.error('Chatbot error:', err);
            const botMsg: Message = {
                id: `b-${Date.now()}`,
                content: '⚠️ Maaf, terjadi kesalahan koneksi ke server.',
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMsg]);
            setIsTyping(false);
        }
    };

    const onSend = () => sendText(inputValue);

    return (
        <div className={`fixed right-6 bottom-6 z-50 ${className}`}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        className="mb-3 flex w-[380px] max-w-[92vw] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
                        style={{ height: 600 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b bg-white px-4 py-3">
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-sm">
                                    <Sparkles size={18} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-800">Asisten SIMS</div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="relative flex h-2 w-2">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                                        </span>
                                        <span className="text-[10px] font-medium text-muted-foreground">Database Terhubung</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100" title="Reset Chat" onClick={resetHistory}>
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    className="rounded-full p-2 text-gray-500 hover:bg-red-50 hover:text-red-500"
                                    title="Tutup"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Quick Access Numbers (Optional - user requested just typing numbers, but clickable buttons are nice UX) */}
                        <div
                            className={`overflow-hidden border-b border-gray-100 bg-gray-50/80 px-4 transition-all duration-300 ease-in-out ${showTips ? 'max-h-[120px] py-3 opacity-100' : 'max-h-0 py-0 opacity-0'}`}
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Akses Cepat (Angka)</p>
                                <button onClick={() => setShowTips(false)}>
                                    <ChevronUp size={14} className="text-gray-400" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => sendText(num.toString())}
                                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-600 shadow-sm transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 active:scale-95"
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div className="relative flex-1 overflow-hidden bg-gray-50/30">
                            <div ref={messagesWrapRef} className="absolute inset-0 space-y-4 overflow-y-auto p-4">
                                {messages.map((m) => (
                                    <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {/* Avatar Bot */}
                                        {m.sender === 'bot' && (
                                            <div className="mt-1 mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px]">
                                                🤖
                                            </div>
                                        )}

                                        <div
                                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                                                m.sender === 'user'
                                                    ? 'rounded-br-none bg-gray-900 text-white'
                                                    : 'rounded-tl-none border border-gray-100 bg-white text-gray-800'
                                            }`}
                                        >
                                            <div className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMessage(m.content) }} />
                                            <div
                                                className={`mt-1.5 text-right text-[10px] opacity-60 ${m.sender === 'user' ? 'text-gray-300' : 'text-gray-400'}`}
                                            >
                                                {formatTime(m.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="mt-1 mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px]">
                                            🤖
                                        </div>
                                        <div className="rounded-2xl rounded-tl-none border border-gray-100 bg-white px-4 py-3 shadow-sm">
                                            <div className="flex gap-1.5">
                                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                                                <span
                                                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
                                                    style={{ animationDelay: '0.15s' }}
                                                />
                                                <span
                                                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
                                                    style={{ animationDelay: '0.3s' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Input */}
                        <div className="border-t border-gray-100 bg-white p-3">
                            {!showTips && (
                                <div className="mb-2 flex justify-center">
                                    <button
                                        onClick={() => setShowTips(true)}
                                        className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-blue-600"
                                    >
                                        <ChevronDown size={12} /> Tampilkan Menu Angka
                                    </button>
                                </div>
                            )}
                            <div className="relative flex items-center">
                                <input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            onSend();
                                        }
                                    }}
                                    placeholder="Ketik angka (1-8) atau pertanyaan..."
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-12 pl-4 text-sm transition-all outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
                                    disabled={isTyping}
                                />
                                <button
                                    onClick={onSend}
                                    disabled={!inputValue.trim() || isTyping}
                                    className="absolute right-2 rounded-lg bg-blue-600 p-1.5 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen((v) => !v)}
                className="group flex items-center gap-2 rounded-full bg-gray-900 py-3.5 pr-5 pl-4 text-white shadow-xl transition-all hover:scale-105 hover:bg-black active:scale-95"
            >
                <div className="relative">
                    <MessageCircle size={20} className="relative z-10" />
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 animate-pulse rounded-full border-2 border-gray-900 bg-red-500"></span>
                </div>
                <span className="text-sm font-semibold">Tanya Data</span>
            </button>
        </div>
    );
};

export default ChatWidget;
