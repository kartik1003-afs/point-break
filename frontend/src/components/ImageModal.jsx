import React, { useState, useEffect, useCallback } from 'react';

const ImageModal = ({ images, onClose }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    // Reset loaded state when index changes
    useEffect(() => {
        setIsLoaded(false);
    }, [selectedIndex]);

    const handleNext = useCallback(() => {
        setSelectedIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const handlePrev = useCallback(() => {
        setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev, onClose]);

    if (!images || images.length === 0) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <button className="close-modal-btn" onClick={onClose}>&times;</button>

            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                {/* Main View Area */}
                <div className="modal-main-view">
                    {/* Prev Button */}
                    <button className="nav-btn prev" onClick={handlePrev}>&#10094;</button>

                    <div className="modal-main-image-container">
                        <img
                            src={images[selectedIndex]}
                            alt="Selected View"
                            className={`main-img ${isLoaded ? 'loaded' : 'loading'}`}
                            onLoad={() => setIsLoaded(true)}
                        />
                        {!isLoaded && <div className="loader"></div>}
                    </div>

                    {/* Next Button */}
                    <button className="nav-btn next" onClick={handleNext}>&#10095;</button>
                </div>

                {/* Thumbnail sidebar */}
                <div className="modal-thumbnails">
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className={`thumbnail ${selectedIndex === idx ? 'active' : ''}`}
                            onClick={() => setSelectedIndex(idx)}
                        >
                            <img
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageModal;
