// BunnyVideoPlayer.jsx
import React, { useState } from 'react';
import { Box } from '@mui/material';


const BunnyVideoPlayer = ({
    videoId,
    libraryId = '578582',
    title = '',
    autoplay = false,
    responsive = true,
    preload = true,
    loop = false,
    muted = false
}) => {
    // Construir URL del iframe
    const embedUrl = `https://iframe.mediadelivery.net/play/${libraryId}/${videoId}`;

    // Agregar parámetros
    const params = new URLSearchParams({
        autoplay: autoplay ? '1' : '0',
        loop: loop ? '1' : '0',
        muted: muted ? '1' : '0',
        preload: preload ? '1' : '0',
        responsive: responsive ? '1' : '0',
    });

    const fullUrl = `${embedUrl}?${params.toString()}`;

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
                bgcolor: '#000',
                borderRadius: 2,
                overflow: 'hidden',
            }}
        >
            <iframe
                src={fullUrl}
                loading="lazy"
                style={{
                    border: 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                }}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
            />
        </Box>
    );
};

export default BunnyVideoPlayer;