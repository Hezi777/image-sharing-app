import {
  Box,
  Container
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ImageCard from '../components/gallery/ImageCard';
import GalleryHeader from '../components/gallery/GalleryHeader';
import EmptyState from '../components/gallery/EmptyState';
import LoadingState from '../components/gallery/LoadingState';

type Comment = { text: string; createdAt?: string };
type Image = {
  id: number;
  filename: string;
  originalName?: string;
  url: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
};

export default function GalleryPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<Image[]>('/images')
      .then(res => setImages(res.data))
      .finally(() => setLoading(false));
  }, []);

  const like = async (id: number) => {
    await axios.post(`/images/${id}/like`);
    
    setImages(prev =>
      prev.map(img => (img.id === id ? { ...img, likes: img.likes + 1 } : img))
    );
    
    setLikedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const comment = async (id: number) => {
    const text = newComment[id];
    if (!text) return;
    
    await axios.post(`/images/${id}/comment`, { text });
    
    setImages(prev =>
      prev.map(img =>
        img.id === id ? { ...img, comments: [...img.comments, { text }] } : img
      )
    );
    
    setNewComment({ ...newComment, [id]: '' });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: '#fafafa',
      py: 2,
      userSelect: 'none',
    }}>
      <Container maxWidth="sm">
        <GalleryHeader />

        {loading ? (
          <LoadingState />
        ) : images.length === 0 ? (
          <EmptyState />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {images.map(image => (
              <ImageCard
                key={image.id}
                image={image}
                liked={likedImages.has(image.id)}
                newComment={newComment[image.id] || ''}
                onLike={like}
                onCommentChange={(id, text) => setNewComment({ ...newComment, [id]: text })}
                onCommentSubmit={comment}
                formatTimeAgo={formatTimeAgo}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
