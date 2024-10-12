import React, { CSSProperties, HTMLAttributes, ReactNode, useEffect, useState } from 'react'

export interface ICarousel extends HTMLAttributes<HTMLDivElement> {
    aspectRatio?: string,
    children: ReactNode,
    duration?: number,
}

export const ItemStyle: CSSProperties = {
    height: '100%',
    left: 0,
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    width: '100%',
}

export const Carousel = ({ aspectRatio = '25%', children, duration = 5000 }: ICarousel) => {
    const [currentIndex, setIndex] = useState(0)
    const kids = children as []

    const containerStyle: CSSProperties = {
        paddingBottom: aspectRatio,
        position: "relative",
    }

    useEffect(() => {
        const inter = setInterval(() => {
            setIndex(state => (state + 1) % kids?.length)
        }, duration)
        return function cleanUp() { window.clearInterval(inter) }
    }, [])

    return (
        <div style={containerStyle}>
            {
                kids?.map((child, index: number) => {
                    return (
                        <div key={index} style={{ transition: 'opacity 3.0s', opacity: (index === currentIndex) ? 1 : 0 }}>
                            {child}
                        </div>
                    )
                })
            }
        </div>
    )
}
