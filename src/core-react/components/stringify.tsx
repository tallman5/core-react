import React, { ComponentPropsWithoutRef } from "react"

export interface IStringify extends ComponentPropsWithoutRef<'pre'> {
    o: any
}

export const Stringify = ({ o, ...rest }: IStringify) => {
    return (
        <pre {...rest}>{JSON.stringify(o, null, 2)}</pre>
    )
}
