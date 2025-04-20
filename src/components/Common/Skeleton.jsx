import React from 'react'

import Skeleton from 'react-loading-skeleton'

const TableSkeleton = () => {
    return (
        <>
            <h1>{<Skeleton />}</h1>
            {<Skeleton count={5} />}
        </>
    )
}

const TableFromSkeleton = () => {
    return (
        <>
            <h1>{<Skeleton />}</h1>
            {<Skeleton count={20} />}
        </>
    )
}



export { TableSkeleton, TableFromSkeleton }

