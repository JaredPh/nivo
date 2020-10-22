/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import { useMemo } from 'react'
import { computeLayout } from './enhancedCompute'

export const useCalendarLayout = ({
    width,
    height,
    from,
    to,
    direction,
    blockSpacing,
    monthSpacing,
    daySpacing,
    align,
    granularity,
    weekDirection,
    breakpoint,
}) =>
    useMemo(
        () =>
            computeLayout({
                width,
                height,
                from,
                to,
                direction,
                blockSpacing,
                monthSpacing,
                daySpacing,
                align,
                granularity,
                weekDirection,
                breakpoint,
            }),
        [
            width,
            height,
            from,
            to,
            direction,
            blockSpacing,
            monthSpacing,
            daySpacing,
            align,
            granularity,
            weekDirection,
            breakpoint,
        ]
    )
