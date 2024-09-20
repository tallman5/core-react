import React, { useState } from 'react';
import { copyToClipboard } from '@tallman5/core-js';

interface ICopyValue {
    value: string
}

const CopyValue = ({ value }: ICopyValue) => {
    const [buttonText, setButtonText] = useState('Copy')

    const copyClicked = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        copyToClipboard(value)
            .then(() => {
                setButtonText("Copied");
                window.setTimeout(() => {
                    setButtonText('Copy');
                }, 3000)
            })
            .catch(e => console.error(e));
    }

    return (
        <div className="input-group mb-3">
            <input value={value} type="text" className="form-control bg-light text-dark" placeholder="Share Link" aria-label="Share Link" aria-describedby="button-addon2" readOnly />
            <button onClick={(e) => { copyClicked(e) }} className="btn btn-outline-secondary" type="button" id="button-addon2">{buttonText}</button>
        </div>
    )
}

export default CopyValue
