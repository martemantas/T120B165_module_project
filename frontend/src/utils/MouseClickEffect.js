import React, { useEffect } from 'react';
import '../App.css';

const MouseClickEffect = () => {
    useEffect(() => {
        const handleClick = (e) => {
            const effectDiv = document.createElement('div');
            effectDiv.className = 'clickEffect';
            effectDiv.style.left = `${e.clientX}px`;
            effectDiv.style.top = `${e.clientY}px`;
            document.body.appendChild(effectDiv);

            // Remove the effect after the animation completes
            setTimeout(() => {
                document.body.removeChild(effectDiv);
            }, 400); // Match with animation duration
        };

        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, []);

    return null;
};

export default MouseClickEffect;
