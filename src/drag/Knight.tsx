import React from 'react'
import { useDrag, DragPreviewImage } from 'react-dnd'

import { ItemTypes } from './Constants'
import knightImageUrl from './knightImageUrl'

export const Knight = () => {
    const [ { isDragging }, drag, preview ] = useDrag({
        item: { type: ItemTypes.KNIGHT },
        collect: monitor => ({
            isDragging: !!monitor.isDragging()
        })
    })
    return (
        <>
            <DragPreviewImage connect={ preview } src={ knightImageUrl } />
            <div 
                ref={ drag } 
                style={{
                    opacity: isDragging ? 0.5 : 1,
                    fontSize: 25,
                    fontWeight: 'bold',
                    cursor: 'move'
                }}>
                    ♘
            </div>
        </>
    )
}