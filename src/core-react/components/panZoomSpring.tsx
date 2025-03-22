import React, { useRef, useState, useCallback } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface PanZoomSpringProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    minScale?: number; // Customizable minimum zoom level
    maxScale?: number; // Customizable maximum zoom level
}

export const PanZoomSpring: React.FC<PanZoomSpringProps> = ({
    children,
    minScale = 0.5,
    maxScale = 5,
    ...props
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isPanning = useRef(false);
    const startPosition = useRef({ x: 0, y: 0 });

    // State for scale and position
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // react-spring animation for smooth transitions
    const [{ transform }, api] = useSpring(() => ({
        transform: `translate(0px, 0px) scale(1)`,
    }));

    // Handle wheel event for zooming
    const handleWheel = useCallback(
        (event: React.WheelEvent<HTMLDivElement>) => {
            event.preventDefault();

            // Normalize the wheel delta to make the zoom smoother
            const delta = event.deltaY * -0.001; // Smaller multiplier for smoother zoom
            const newScale = Math.min(Math.max(minScale, scale * (1 + delta)), maxScale);

            // Calculate the mouse position relative to the container
            const rect = containerRef.current!.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            // Adjust position to ensure the point under cursor remains fixed
            const scaleRatio = newScale / scale;
            const newX = position.x + (mouseX - position.x) * (1 - scaleRatio);
            const newY = position.y + (mouseY - position.y) * (1 - scaleRatio);

            // Update state and spring animation
            setScale(newScale);
            setPosition({ x: newX, y: newY });
            api.start({
                transform: `translate(${newX}px, ${newY}px) scale(${newScale})`,
            });
        },
        [scale, position, minScale, maxScale, api]
    );

    // Handle mouse down event for panning
    const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        isPanning.current = true;
        startPosition.current = {
            x: event.pageX - position.x,
            y: event.pageY - position.y,
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (!isPanning.current) return;
            event.preventDefault();
            const newX = event.pageX - startPosition.current.x;
            const newY = event.pageY - startPosition.current.y;

            // Update state and spring animation
            setPosition({ x: newX, y: newY });
            api.start({
                transform: `translate(${newX}px, ${newY}px) scale(${scale})`,
            });
        };

        const handleMouseUp = () => {
            isPanning.current = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [position, scale, api]);

    // Handle touch events for mobile devices
    const handleTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
        if (event.touches.length === 1) {
            // Single touch for panning
            event.preventDefault();
            isPanning.current = true;
            startPosition.current = {
                x: event.touches[0].pageX - position.x,
                y: event.touches[0].pageY - position.y,
            };
        }
    }, [position]);

    const handleTouchMove = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
        if (event.touches.length === 1 && isPanning.current) {
            // Single touch for panning
            event.preventDefault();
            const newX = event.touches[0].pageX - startPosition.current.x;
            const newY = event.touches[0].pageY - startPosition.current.y;

            // Update state and spring animation
            setPosition({ x: newX, y: newY });
            api.start({
                transform: `translate(${newX}px, ${newY}px) scale(${scale})`,
            });
        }
    }, [scale, api]);

    const handleTouchEnd = useCallback(() => {
        isPanning.current = false;
    }, []);

    // Handle double-click to reset zoom and pan
    const handleDoubleClick = useCallback(() => {
        // Reset scale and position
        setScale(1);
        setPosition({ x: 0, y: 0 });
        api.start({
            transform: `translate(0px, 0px) scale(1)`,
        });
    }, [api]);

    // Memoized styles for performance optimization
    const containerStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: isPanning.current ? 'grabbing' : 'grab',
        position: 'relative',
        ...props.style,
    };

    return (
        <div
            {...props}
            ref={containerRef}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleDoubleClick}
            style={containerStyle}
        >
            <animated.div style={{ transform }}>{children}</animated.div>
        </div>
    );
};
