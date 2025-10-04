import React, { useState, useRef } from 'react';
import { Send, Paperclip, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import ImageUploader from './ImageUploader.jsx';
import { useImageUpload } from '../hooks/useImageUpload.js';

const ChatInput = ({ onSendMessage, onSendImage, disabled = false, placeholder = "Type a message..." }) => {
    const [message, setMessage] = useState('');
    const [showImageUploader, setShowImageUploader] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const textareaRef = useRef(null);
    const { isUploading, uploadChatImage } = useImageUpload();

    const handleSendMessage = () => {
        if (message.trim() && !disabled) {
            onSendMessage(message.trim());
            setMessage('');
            adjustTextareaHeight();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
        }
    };

    const handleImageUpload = async (file) => {
        try {
            const result = await uploadChatImage(file);
            setSelectedImage({
                url: result.imageUrl,
                publicId: result.publicId,
                file
            });

            // Create preview
            const preview = URL.createObjectURL(file);
            setImagePreview(preview);
            setShowImageUploader(false);
        } catch {
            toast.error('Failed to upload image');
        }
    };

    const handleSendImage = () => {
        if (selectedImage && onSendImage) {
            onSendImage({
                imageUrl: selectedImage.url,
                publicId: selectedImage.publicId
            });
            clearSelectedImage();
        }
    };

    const clearSelectedImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleError = (error) => {
        toast.error(error);
    };

    return (
        <div className="border-t bg-white p-4">
            {/* Image Preview */}
            {selectedImage && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Image to send:</span>
                        <button
                            onClick={clearSelectedImage}
                            className="p-1 hover:bg-gray-200 rounded-full"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    <div className="relative inline-block">
                        <img
                            src={imagePreview}
                            alt="Selected"
                            className="max-w-32 max-h-32 rounded-lg object-cover"
                        />
                    </div>
                    <div className="mt-2 flex space-x-2">
                        <button
                            onClick={clearSelectedImage}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSendImage}
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-1"
                        >
                            <Send size={14} />
                            <span>Send Image</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Image Uploader */}
            {showImageUploader && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Upload Image</span>
                        <button
                            onClick={() => setShowImageUploader(false)}
                            className="p-1 hover:bg-gray-200 rounded-full"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    <ImageUploader
                        onImageUpload={handleImageUpload}
                        onError={handleError}
                        maxSize={10 * 1024 * 1024} // 10MB for chat images
                    />
                </div>
            )}

            {/* Message Input */}
            <div className="flex items-end space-x-2">
                {/* Attachment Button */}
                <button
                    onClick={() => setShowImageUploader(!showImageUploader)}
                    disabled={disabled || isUploading}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                    title="Attach image"
                >
                    {isUploading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />
                    ) : (
                        <ImageIcon size={20} />
                    )}
                </button>

                {/* Text Input */}
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            adjustTextareaHeight();
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        style={{ minHeight: '40px', maxHeight: '120px' }}
                        rows={1}
                    />
                </div>

                {/* Send Button */}
                <button
                    onClick={handleSendMessage}
                    disabled={disabled || !message.trim()}
                    className={`p-2 rounded-full transition-colors ${message.trim() && !disabled
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};

export default ChatInput;