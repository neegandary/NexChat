import React, { memo, useMemo, useState } from 'react';

const MessageItem = memo(({ message, currentUserId, onImageClick }) => {
    const isOwner = message.sender === currentUserId || 
                   (message.sender && message.sender._id === currentUserId);
    
    const [imageError, setImageError] = useState(false);
    
    const messageContent = useMemo(() => {
        if (message.messageType === "file") {
            if (message.fileUrl) {
                const fileExtension = message.fileName?.split('.').pop()?.toLowerCase();
                const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
                
                if (isImage && !imageError) {
                    return (
                        <div 
                            className="cursor-pointer max-w-xs"
                            onClick={() => onImageClick?.(message.fileUrl)}
                        >
                            <img
                                src={message.fileUrl}
                                alt={message.fileName || 'Image'}
                                className="rounded-lg max-w-full h-auto"
                                loading="lazy"
                                onError={() => setImageError(true)}
                                onLoad={(e) => {
                                    // Fade in effect khi load xong
                                    e.target.style.opacity = '1';
                                }}
                                style={{
                                    opacity: '0',
                                    transition: 'opacity 0.3s ease'
                                }}
                            />
                            {message.fileName && (
                                <p className="text-xs text-gray-500 mt-1 truncate">
                                    {message.fileName}
                                </p>
                            )}
                        </div>
                    );
                }
                
                return (
                    <div className="flex items-center space-x-2">
                        <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                {message.fileName || 'File'}
                            </p>
                            <a
                                href={message.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 hover:underline"
                            >
                                Download
                            </a>
                        </div>
                    </div>
                );
            }
        }
        
        return (
            <div className="whitespace-pre-wrap break-words">
                {message.content}
            </div>
        );
    }, [message, imageError, onImageClick]);

    return (
        <div className={`flex ${isOwner ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwner
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                }`}
            >
                {messageContent}
                
                {/* Message status indicators */}
                <div className="flex items-center justify-end mt-1 space-x-1">
                    <span className="text-xs opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })}
                    </span>
                    
                    {isOwner && (
                        <div className="flex items-center">
                            {message.isPending ? (
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                            ) : (
                                <>
                                    {/* Single check - sent */}
                                    <svg className="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    
                                    {/* Double check - delivered/read */}
                                    {message.isRead && (
                                        <svg className="w-3 h-3 text-blue-300 -ml-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

MessageItem.displayName = 'MessageItem';

export default MessageItem;