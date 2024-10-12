import React, { ComponentPropsWithoutRef, CSSProperties, ReactElement, useEffect, useState } from "react"
import { useMasonryColumns } from "../utilities"

export interface IMasonry extends ComponentPropsWithoutRef<'div'> {
    gap?: string
}

export const Masonry = ({ children, gap = '10px' }: IMasonry) => {
    const columnCount = useMasonryColumns()
    const [columns, setColumns] = useState<ReactElement[]>([])

    useEffect(() => {
        const newCols: ReactElement[] = []
        const colWidth = (100 / columnCount) + '%'
        const colStyle: CSSProperties = {
            width: colWidth,
        }

        if (children) {
            const childArray = children as Array<ReactElement>

            for (let i = 0; i < columnCount; i++) {
                const rows: ReactElement[] = [];
                for (let j = i; j < childArray.length; j += columnCount) {
                    rows.push(
                        <div key={j} style={{ margin: gap + ' 0px' }}>
                            {childArray[j]}
                        </div>
                    )
                }
                newCols.push(<div key={i} style={colStyle}>{rows}</div>);
            }
            setColumns(newCols)
        }
        else {
            setColumns([])
        }
    }, [children, columnCount])

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap }}>
            {columns}
        </div>
    )
}
