// components/ImageComponent.tsx
import React from 'react';
import Image from 'next/image';

interface ImageComponentProps {
    width?: number;
    height?: number;
}

const ImageComponent: React.FC<ImageComponentProps> = ({
    width = 200,
    height = 200,
}) => {
    return (
        <Image
            src='/statics/mainLoader.gif'
            alt='loaderGif'
            width={width}
            height={height}
            priority
        />
    );
};

export default ImageComponent;
