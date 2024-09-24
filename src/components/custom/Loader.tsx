// components/ImageComponent.tsx
import React from 'react';

interface ImageComponentProps {
    width?: number;
    height?: number;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ width = 200, height = 200 }) => { // Define valores padrão
    return (
        <img 
            src={"/statics/mainLoader.gif"}
            alt={"loaderGif"} 
            width={width} 
            height={height} 
            style={{ objectFit: 'cover' }}
        />
    );
};

export default ImageComponent;
