import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

interface PanZoomProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    minScale?: number;
    maxScale?: number;
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

    const targetScale = useRef(scale);
    const targetPosition = useRef(position);

    useEffect(() => {
        const animate = () => {
            setScale((prevScale) => {
                const delta = targetScale.current - prevScale;
                return prevScale + delta * 0.1;
            });
            setPosition((prevPosition) => {
                const deltaX = targetPosition.current.x - prevPosition.x;
                const deltaY = targetPosition.current.y - prevPosition.y;
                return {
                    x: prevPosition.x + deltaX * 0.2,
                    y: prevPosition.y + deltaY * 0.2,
                };
            });
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, []);

    const handleWheel = useCallback(
        (event: React.WheelEvent<HTMLDivElement>) => {
            event.preventDefault();

            const delta = event.deltaY * -0.001;
            const newScale = Math.min(Math.max(minScale, targetScale.current * (1 + delta)), maxScale);

            const rect = containerRef.current!.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            const prevScale = targetScale.current;
            targetScale.current = newScale;

            const scaleRatio = newScale / prevScale;
            targetPosition.current = {
                x: mouseX - (mouseX - position.x) * scaleRatio,
                y: mouseY - (mouseY - position.y) * scaleRatio,
            };
        },
        [minScale, maxScale, position]
    );

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

    const handleTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
        if (event.touches.length === 1) {
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

    const handleDoubleClick = useCallback(() => {
        targetScale.current = 1;
        targetPosition.current = { x: 0, y: 0 };
    }, []);

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

    const contentStyle: React.CSSProperties = useMemo(
        () => ({
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            transition: 'transform 0.3s cubic-bezier(.04,.53,.92,.43)',
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
