import React from 'react';
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
    const embedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;

    // Agregar parámetros
    const params = new URLSearchParams({
        autoplay: autoplay ? 'true' : 'false',
        loop: loop ? 'true' : 'false',
        muted: muted ? 'true' : 'false',
        preload: preload ? 'true' : 'false',
        responsive: responsive ? 'true' : 'false',
    });

    const fullUrl = `${embedUrl}?${params.toString()}`;

    return (
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
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen={true}
            title={title || 'Video player'}
        />
    );
};

export default BunnyVideoPlayer;