import React, { useState, useEffect } from 'react';
import { ExternalLink, Globe, Play, Music, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface URLPreviewProps {
  url: string;
  className?: string;
}

interface URLMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  type?: 'website' | 'video' | 'audio' | 'image';
}

const URLPreview: React.FC<URLPreviewProps> = ({ url, className = "" }) => {
  const [metadata, setMetadata] = useState<URLMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract domain from URL
  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain;
    } catch {
      return url;
    }
  };

  // Detect content type from URL
  const detectContentType = (url: string): URLMetadata['type'] => {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('vimeo.com') || lowerUrl.includes('.mp4')) {
      return 'video';
    }
    if (lowerUrl.includes('spotify.com') || lowerUrl.includes('.mp3') || lowerUrl.includes('.wav')) {
      return 'audio';
    }
    if (lowerUrl.includes('.jpg') || lowerUrl.includes('.png') || lowerUrl.includes('.gif') || lowerUrl.includes('.webp')) {
      return 'image';
    }
    return 'website';
  };

  // Get icon based on content type
  const getContentIcon = (type?: URLMetadata['type']) => {
    switch (type) {
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'audio':
        return <Music className="w-4 h-4" />;
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  // Mock metadata fetching (in real app, this would call an API)
  useEffect(() => {
    if (!url) return;

    setIsLoading(true);
    setError(null);

    // Simulate API call
    const timer = setTimeout(() => {
      const contentType = detectContentType(url);
      const domain = getDomain(url);
      
      // Mock metadata based on URL patterns
      const mockMetadata: URLMetadata = {
        title: `Content from ${domain}`,
        description: `A link to ${domain}`,
        siteName: domain,
        type: contentType,
      };

      // Add mock image for certain domains
      if (domain.includes('youtube.com')) {
        mockMetadata.image = 'https://via.placeholder.com/300x200/ff0000/ffffff?text=YouTube';
        mockMetadata.title = 'YouTube Video';
      } else if (domain.includes('spotify.com')) {
        mockMetadata.image = 'https://via.placeholder.com/300x200/1db954/ffffff?text=Spotify';
        mockMetadata.title = 'Spotify Track';
      } else if (domain.includes('github.com')) {
        mockMetadata.image = 'https://via.placeholder.com/300x200/333333/ffffff?text=GitHub';
        mockMetadata.title = 'GitHub Repository';
      } else {
        mockMetadata.image = 'https://via.placeholder.com/300x200/666666/ffffff?text=Website';
      }

      setMetadata(mockMetadata);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [url]);

  if (!url) return null;

  return (
    <div className={cn("border border-gray-200 rounded-lg overflow-hidden", className)}>
      {isLoading ? (
        <div className="p-4 flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Loading preview...</span>
        </div>
      ) : error ? (
        <div className="p-4 text-sm text-red-600">
          Failed to load preview: {error}
        </div>
      ) : metadata ? (
        <div className="flex">
          {metadata.image && (
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src={metadata.image}
                alt={metadata.title || 'Preview'}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 p-4 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {getContentIcon(metadata.type)}
              <span className="text-xs text-gray-500 font-medium">
                {metadata.siteName}
              </span>
            </div>
            {metadata.title && (
              <h3 className="font-medium text-sm mb-1 line-clamp-2">
                {metadata.title}
              </h3>
            )}
            {metadata.description && (
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {metadata.description}
              </p>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-600 truncate">{url}</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 font-medium">
              {getDomain(url)}
            </span>
          </div>
          <div className="text-xs text-blue-600 truncate">{url}</div>
        </div>
      )}
    </div>
  );
};

export default URLPreview; 