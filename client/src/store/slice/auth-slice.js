
export const createAuthSlice = (set, get) => ({
    userInfo: undefined,
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    contacts: [],
    isDarkMode: false,
    setUserInfo: (userInfo) => set({ userInfo }),
    setToken: (token) => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    },
    setDarkMode: (isDarkMode) => {
        // Apply to DOM immediately for instant visual feedback
        if (typeof document !== 'undefined') {
            if (isDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            localStorage.setItem('darkMode', isDarkMode.toString());
        }
        set({ isDarkMode });
    },
    toggleDarkMode: () => {
        const currentMode = get().isDarkMode;
        const newMode = !currentMode;

        // Use requestAnimationFrame for smooth transition
        if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(() => {
                get().setDarkMode(newMode);
            });
        } else {
            get().setDarkMode(newMode);
        }
    },
    initializeDarkMode: () => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('darkMode');
            const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
            const shouldBeDark = savedTheme ? savedTheme === 'true' : prefersDark;

            get().setDarkMode(shouldBeDark);
        }
    },
    setSelectedChatType: (chatType) => set({ selectedChatType: chatType }),
    setSelectedChatData: (chatData) => set({ selectedChatData: chatData }),
    setSelectedChatMessages: (messages) => set({ selectedChatMessages: messages }),
    setContacts: (contacts) => set({ contacts }),
    closeChat: () => {
        set({ selectedChatType: undefined, selectedChatData: undefined, selectedChatMessages: [] });
    },
    addMessage: (message) => {
        const selectedChatMessages = get().selectedChatMessages;
        const selectedChatType = get().selectedChatType;

        // Handle sender and recipient - they might be objects or strings
        const senderId = typeof message.sender === 'object' ? message.sender._id : message.sender;
        const recipientId = typeof message.recipient === 'object' ? message.recipient._id : message.recipient;

        set({
            selectedChatMessages: [...selectedChatMessages, {
                ...message,
                recipient: selectedChatType === "channel" ? message.recipient : recipientId,
                sender: selectedChatType === "channel" ? message.sender : senderId
            }]
        })
    },

    updateMessagesReadStatus: (userId) => {
        const selectedChatMessages = get().selectedChatMessages;
        const userInfo = get().userInfo;

        if (userInfo && userInfo.id === userId) {
            const updatedMessages = selectedChatMessages.map(message => ({
                ...message,
                isRead: true
            }));
            set({ selectedChatMessages: updatedMessages });
        }
    },
    logout: () => {
        // Clear user info and related data
        set({
            userInfo: undefined,
            selectedChatType: undefined,
            selectedChatData: undefined,
            selectedChatMessages: [],
            contacts: []
        });

        // Clear localStorage
        if (typeof window !== 'undefined') {
            // Keep dark mode preference but clear other data
            const darkMode = localStorage.getItem('darkMode');
            localStorage.removeItem('token');
            localStorage.clear();
            if (darkMode) {
                localStorage.setItem('darkMode', darkMode);
            }
        }
    }
})

