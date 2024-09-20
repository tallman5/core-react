import { animated, easings, useSpring } from "@react-spring/web";
import { UiFunction } from "@tallman5/core-js";
import React, { ComponentPropsWithoutRef, CSSProperties, useEffect, useState } from "react";

export interface ITimeoutBar extends ComponentPropsWithoutRef<'div'> {
    uiFunction?: UiFunction,
    duration?: number,
    height?: string,
}

export const TimeoutBar = ({ duration = 5000, height = '10px', uiFunction = UiFunction.Success }: ITimeoutBar) => {
    const [isRunning, setIsRunning] = useState(false)
    const props = useSpring({
        width: isRunning ? `${100}%` : `0%`,
        config: {
            duration,
            easing: easings.easeInOutQuad,
        }
    })

    const containerStyle: CSSProperties = {
        position: 'relative',
        width: '100%',
        height,
        overflow: 'hidden'
    }

    const barStyle: CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        borderRadius: '10px'
    }

    useEffect(() => {
        setIsRunning(true)
    }, [])

    return (
        <div style={containerStyle}>
            <div style={{ ...barStyle, width: '100%', opacity: '.3' }} className={'text-bg-' + uiFunction}></div>
            <animated.div style={{ ...props, ...barStyle }} className={'text-bg-' + uiFunction}></animated.div>
        </div>
    )
};
