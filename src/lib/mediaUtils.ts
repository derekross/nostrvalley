import type { NostrEvent } from '@nostrify/nostrify';

export interface MediaItem {
  url: string;
  type: 'image' | 'video' | 'unknown';
  alt?: string;
  title?: string;
  mimeType?: string;
  blurhash?: string;
  dimensions?: string;
}

// Extract media from NIP-68 Picture events (kind 20)
export function extractNIP68Media(event: NostrEvent): MediaItem[] {
  const media: MediaItem[] = [];
  
  // Get title from tags
  const title = event.tags.find(tag => tag[0] === 'title')?.[1];
  
  // Extract imeta tags
  event.tags.forEach(tag => {
    if (tag[0] === 'imeta') {
      const mediaItem: MediaItem = {
        url: '',
        type: 'image', // NIP-68 is picture-first
        title,
      };
      
      // Parse imeta tag properties
      for (let i = 1; i < tag.length; i++) {
        const prop = tag[i];
        if (prop.startsWith('url ')) {
          mediaItem.url = prop.substring(4);
        } else if (prop.startsWith('alt ')) {
          mediaItem.alt = prop.substring(4);
        } else if (prop.startsWith('m ')) {
          mediaItem.mimeType = prop.substring(2);
          // Determine type from mime type
          if (mediaItem.mimeType.startsWith('video/')) {
            mediaItem.type = 'video';
          } else if (mediaItem.mimeType.startsWith('image/')) {
            mediaItem.type = 'image';
          }
        } else if (prop.startsWith('blurhash ')) {
          mediaItem.blurhash = prop.substring(9);
        } else if (prop.startsWith('dim ')) {
          mediaItem.dimensions = prop.substring(4);
        }
      }
      
      if (mediaItem.url) {
        media.push(mediaItem);
      }
    }
  });
  
  return media;
}

// Extract media from regular text notes (kind 1)
export function extractTextNoteMedia(event: NostrEvent): MediaItem[] {
  const media: MediaItem[] = [];
  
  // Extract URLs from content using regex
  const urlRegex = /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|mp4|webm|mov|avi|mp3|wav|ogg)/gi;
  const urls = event.content.match(urlRegex) || [];
  
  urls.forEach(url => {
    const extension = url.split('.').pop()?.toLowerCase();
    let type: 'image' | 'video' | 'unknown' = 'unknown';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      type = 'image';
    } else if (['mp4', 'webm', 'mov', 'avi'].includes(extension || '')) {
      type = 'video';
    }
    
    media.push({
      url: url.trim(),
      type,
      mimeType: `${type}/${extension}`,
    });
  });
  
  // Also check for imeta tags in kind 1 events
  event.tags.forEach(tag => {
    if (tag[0] === 'imeta') {
      const mediaItem: MediaItem = {
        url: '',
        type: 'unknown',
      };
      
      // Parse imeta tag properties
      for (let i = 1; i < tag.length; i++) {
        const prop = tag[i];
        if (prop.startsWith('url ')) {
          mediaItem.url = prop.substring(4);
        } else if (prop.startsWith('alt ')) {
          mediaItem.alt = prop.substring(4);
        } else if (prop.startsWith('m ')) {
          mediaItem.mimeType = prop.substring(2);
          if (mediaItem.mimeType.startsWith('video/')) {
            mediaItem.type = 'video';
          } else if (mediaItem.mimeType.startsWith('image/')) {
            mediaItem.type = 'image';
          }
        }
      }
      
      if (mediaItem.url) {
        media.push(mediaItem);
      }
    }
  });
  
  // Deduplicate media items by URL
  const uniqueMedia = media.filter((item, index, self) => 
    index === self.findIndex(m => m.url === item.url)
  );
  
  return uniqueMedia;
}

// Main function to extract all media from any event
export function extractMediaFromEvent(event: NostrEvent): MediaItem[] {
  if (event.kind === 20) {
    return extractNIP68Media(event);
  } else if (event.kind === 1) {
    return extractTextNoteMedia(event);
  }
  
  return [];
}

// Get the first/primary media item from an event
export function getPrimaryMedia(event: NostrEvent): MediaItem | null {
  const media = extractMediaFromEvent(event);
  return media.length > 0 ? media[0] : null;
}

// Check if URL is a video
export function isVideoUrl(url: string): boolean {
  const videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv'];
  const extension = url.split('.').pop()?.toLowerCase();
  return videoExtensions.includes(extension || '');
}

// Check if URL is an image
export function isImageUrl(url: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  const extension = url.split('.').pop()?.toLowerCase();
  return imageExtensions.includes(extension || '');
}