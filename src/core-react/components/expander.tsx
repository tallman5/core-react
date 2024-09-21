import { useSpring, animated } from "@react-spring/web";
import React, { ComponentPropsWithoutRef, } from "react";
import { usePrevious } from "../utilities";
import useMeasure from "react-use-measure";

export interface IExpander extends ComponentPropsWithoutRef<'div'> {
    isExpanded?: boolean
}

export const Expander = ({ children, isExpanded = false, style }: IExpander) => {
    const previous = usePrevious(isExpanded)
    const [ref, { height: viewHeight }] = useMeasure()
    const { height, opacity, zIndex } = useSpring({
        from: {
            height: 0,
            opacity: 0,
            zIndex: -1000,
        },
        to: {
            height: isExpanded ? viewHeight : 0,
            opacity: isExpanded ? 1 : 0,
            zIndex: isExpanded ? 1 : -1000,
        },
        config: {
            friction: 30,
            tension: 230,
        }
    });

    const finalStyle = {
        height: isExpanded && previous === isExpanded ? 'auto' : height,
        opacity,
        zIndex,
        position: 'relative',
        ...style,
    }

    return (
        // @ts-ignore
        <animated.div style={finalStyle}>
            <animated.div ref={ref} children={children} />
        </animated.div>
    )
}
