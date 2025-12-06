/**
 * Optimizes a Cloudinary URL by injecting transformation parameters.
 * 
 * @param url - The original Cloudinary URL
 * @param width - Optional width to resize the image/video to
 * @returns The optimized URL with f_auto,q_auto and optional width
 */
export const optimizeCloudinaryUrl = (url: string, width?: number): string => {
    if (!url || !url.includes('cloudinary.com')) return url;

    // Split the URL at '/upload/'
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;

    const [baseUrl, resourcePath] = parts;

    // Build transformation string
    const transformations = ['f_auto', 'q_auto'];
    if (width) {
        transformations.push(`w_${width}`);
    }

    // Reassemble URL: base + /upload/ + transformations + / + resource
    return `${baseUrl}/upload/${transformations.join(',')}/${resourcePath}`;
};

/**
 * Checks if a URL points to a video file.
 * 
 * @param url - The URL to check
 * @returns True if the URL is a video
 */
export const isVideo = (url: string): boolean => {
    if (!url) return false;
    return !!url.match(/\.(mp4|webm|ogg|mov)$/i) || url.includes('/video/upload/');
};
