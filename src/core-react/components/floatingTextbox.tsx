import React, { ComponentPropsWithoutRef } from 'react';

interface IFloatingTextbox extends ComponentPropsWithoutRef<'input'> {
    additionalClassName?: string
    caption: string
    helpText?: string
    id: string
    placeholder: string
}

const FloatingTextbox = ({ additionalClassName = '', caption, helpText = '', id, placeholder, ...rest }: IFloatingTextbox) => {
    return (
        <div className="form-floating">
            <input className={"form-control " + additionalClassName} id={id} name={id} placeholder={placeholder} {...rest} />
            <label htmlFor={id}>{caption}</label>
            {
                (helpText && helpText.length > 0)
                    ? <div id={id + 'Help'} className="form-text" style={{ fontSize: "smaller" }}>{helpText}</div>
                    : null
            }
        </div>
    )
}

export default FloatingTextbox