import React, { ComponentPropsWithoutRef } from 'react'

export interface IBackdrop extends ComponentPropsWithoutRef<'div'> {
    isVisible?: boolean
}

export const Backdrop = ({ isVisible, children, ...rest }: IBackdrop) => {
    return (
        <div style={{ display: (isVisible) ? 'block' : 'none', backgroundColor: '#11111177' }}
            tabIndex={-1} aria-modal="true" role="dialog"
            className={(isVisible) ? 'modal fade show' : 'modal fade'} {...rest}>
            {children}
        </div>
    )
}
