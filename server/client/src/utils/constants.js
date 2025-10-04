
export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = "api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

export const CONTACTS_ROUTES = "api/contacts";
export const SEARCH_CONTACTS_ROUTE = `${CONTACTS_ROUTES}/search`;

export const MESSAGES_ROUTES = "api/messages";
export const GET_MESSAGES_ROUTE = `${MESSAGES_ROUTES}/get-messages`;
export const GET_MESSAGES_WITH_CONTACTS_ROUTE = `${MESSAGES_ROUTES}/get-messages-with-contacts`;
export const MARK_MESSAGES_AS_READ_ROUTE = `${MESSAGES_ROUTES}/mark-as-read`;
export const ARCHIVE_CONVERSATION_ROUTE = `${MESSAGES_ROUTES}/archive-conversation`;

export const UPLOAD_ROUTES = "api/upload";
export const UPLOAD_FILE_ROUTE = `${UPLOAD_ROUTES}/upload-file`;


// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${HOST}/uploads/profiles/${imagePath}`;
};