import React, { useRef, useState, useCallback } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface PanZoomSpringProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    minScale?: number;
    maxScale?: number;
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
    const lastDistance = useRef<number | null>(null);

    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const [{ transform }, api] = useSpring(() => ({
        transform: `translate(0px, 0px) scale(1)`,
    }));

    const handleWheel = useCallback(
        (event: React.WheelEvent<HTMLDivElement>) => {
            event.preventDefault();
            event.stopPropagation();
            if (event.ctrlKey) return;

            const delta = -event.deltaY * 0.001;
            const newScale = Math.min(Math.max(minScale, scale * (1 + delta)), maxScale);

            const rect = containerRef.current!.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            const scaleRatio = newScale / scale;
            const newX = mouseX - (mouseX - position.x) * scaleRatio;
            const newY = mouseY - (mouseY - position.y) * scaleRatio;

            setScale(newScale);
            setPosition({ x: newX, y: newY });
            api.start({ transform: `translate(${newX}px, ${newY}px) scale(${newScale})` });
        },
        [scale, position, minScale, maxScale, api]
    );

    const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        containerRef.current!.style.cursor = 'grabbing';
        event.preventDefault();
        isPanning.current = true;
        startPosition.current = { x: event.pageX - position.x, y: event.pageY - position.y };

        const handleMouseMove = (event: MouseEvent) => {
            if (!isPanning.current) return;
            event.preventDefault();
            const newX = event.pageX - startPosition.current.x;
            const newY = event.pageY - startPosition.current.y;
            setPosition({ x: newX, y: newY });
            api.start({ transform: `translate(${newX}px, ${newY}px) scale(${scale})` });
        };

        const handleMouseUp = () => {
            isPanning.current = false;
            containerRef.current!.style.cursor = 'grab';
            isPanning.current = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [position, scale, api]);

    const handleTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
        if (event.touches.length === 2) {
            event.preventDefault();
            event.stopPropagation();
            const distance = Math.hypot(
                event.touches[0].pageX - event.touches[1].pageX,
                event.touches[0].pageY - event.touches[1].pageY
            );
            lastDistance.current = distance;
        } else if (event.touches.length === 1) {
            isPanning.current = true;
            startPosition.current = { x: event.touches[0].pageX - position.x, y: event.touches[0].pageY - position.y };
        }
    }, [position]);

    const handleTouchMove = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
        if (event.touches.length === 2 && lastDistance.current !== null) {
            event.preventDefault();
            event.stopPropagation();
            const distance = Math.hypot(
                event.touches[0].pageX - event.touches[1].pageX,
                event.touches[0].pageY - event.touches[1].pageY
            );
            const scaleFactor = distance / lastDistance.current;
            const newScale = Math.min(Math.max(minScale, scale * scaleFactor), maxScale);
            lastDistance.current = distance;

            const rect = containerRef.current!.getBoundingClientRect();
            const centerX = (event.touches[0].pageX + event.touches[1].pageX) / 2 - rect.left;
            const centerY = (event.touches[0].pageY + event.touches[1].pageY) / 2 - rect.top;

            const scaleRatio = newScale / scale;
            const newX = centerX - (centerX - position.x) * scaleRatio;
            const newY = centerY - (centerY - position.y) * scaleRatio;

            setScale(newScale);
            setPosition({ x: newX, y: newY });
            api.start({ transform: `translate(${newX}px, ${newY}px) scale(${newScale})` });
        }
    }, [scale, position, minScale, maxScale, api]);

    const handleTouchEnd = useCallback(() => {
        isPanning.current = false;
        lastDistance.current = null;
    }, []);

    const handleDoubleClick = useCallback(() => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
        api.start({ transform: `translate(0px, 0px) scale(1)` });
    }, [api]);

    const containerStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        touchAction: 'none',
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
