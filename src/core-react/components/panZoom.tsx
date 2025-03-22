import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

interface PanZoomProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    minScale?: number; // Customizable minimum zoom level
    maxScale?: number; // Customizable maximum zoom level
}

export const PanZoom: React.FC<PanZoomProps> = ({
    children,
    minScale = 0.5,
    maxScale = 5,
    ...props
}) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const isPanning = useRef(false);
    const startPosition = useRef({ x: 0, y: 0 });

    // Smooth zooming and panning with requestAnimationFrame
    const targetScale = useRef(scale);
    const targetPosition = useRef(position);

    // Animation loop
    useEffect(() => {
        const animate = () => {
            setScale((prevScale) => {
                const delta = targetScale.current - prevScale;
                return prevScale + delta * 0.1; // Smoothly interpolate scale
            });
            setPosition((prevPosition) => {
                const deltaX = targetPosition.current.x - prevPosition.x;
                const deltaY = targetPosition.current.y - prevPosition.y;
                return {
                    x: prevPosition.x + deltaX * 0.2, // Increased interpolation factor for smoother panning
                    y: prevPosition.y + deltaY * 0.2,
                };
            });
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, []);

    // Handle wheel event for zooming
    const handleWheel = useCallback(
        (event: React.WheelEvent<HTMLDivElement>) => {
            event.preventDefault();

            // Normalize the wheel delta to make the zoom smoother
            const delta = event.deltaY * -0.001; // Smaller multiplier for smoother zoom
            const newScale = targetScale.current * (1 + delta);

            // Clamp the scale between minScale and maxScale
            targetScale.current = Math.min(Math.max(minScale, newScale), maxScale);

            // Calculate the mouse position relative to the container
            const rect = containerRef.current!.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            // Adjust the position to keep the zoom focused on the mouse cursor
            const scaleRatio = targetScale.current / scale;
            targetPosition.current = {
                x: mouseX - (mouseX - position.x) * scaleRatio,
                y: mouseY - (mouseY - position.y) * scaleRatio,
            };
        },
        [minScale, maxScale, scale, position]
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
            targetPosition.current = {
                x: event.pageX - startPosition.current.x,
                y: event.pageY - startPosition.current.y,
            };
        };

        const handleMouseUp = () => {
            isPanning.current = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [position]);

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
            targetPosition.current = {
                x: event.touches[0].pageX - startPosition.current.x,
                y: event.touches[0].pageY - startPosition.current.y,
            };
        }
    }, []);

    const handleTouchEnd = useCallback(() => {
        isPanning.current = false;
    }, []);

    // Handle double-click to reset zoom and pan
    const handleDoubleClick = useCallback(() => {
        targetScale.current = 1; // Reset scale
        targetPosition.current = { x: 0, y: 0 }; // Reset position
    }, []);

    // Memoized styles for performance optimization
    const containerStyle: React.CSSProperties = useMemo(
        () => ({
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            cursor: isPanning.current ? 'grabbing' : 'grab',
            position: 'relative',
            ...props.style,
        }),
        [props.style]
    );

    // Custom cubic-bezier curve for a "powerful" transition
    const contentStyle: React.CSSProperties = useMemo(
        () => ({
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: 'transform 0.3s cubic-bezier(.04,.53,.92,.43)', // Your custom curve
        }),
        [position, scale]
    );

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
            <div style={contentStyle}>{children}</div>
        </div>
    );
};