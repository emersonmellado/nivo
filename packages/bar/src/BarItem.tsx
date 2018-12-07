/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import * as React from 'react'
import * as PropTypes from 'prop-types'
import { compose, withPropsOnChange } from 'recompose'
import { BasicTooltip, Theme } from '@nivo/core'

export interface BarItemProps {
    data: {
        id?: string
        value?: number
        indexValue?: string
        fill?: string
    }
    x: number
    y: number
    width: number
    height: number
    color: string
    borderRadius: number
    borderWidth: number
    borderColor: string
    label: React.ReactNode
    shouldRenderLabel: boolean
    labelColor: string
    showTooltip: (...args: any[]) => void
    hideTooltip: (...args: any[]) => void
    getTooltipLabel: (...args: any[]) => React.ReactNode
    tooltipFormat: string | number
    onClick: (...args: any[]) => void
    onMouseEnter: (...args: any[]) => void
    onMouseLeave: (...args: any[]) => void
    tooltip: React.ReactElement<any>
    theme: Partial<Pick<Theme, 'tooltip' | 'labels'>>
}

const BarItem: React.SFC<BarItemProps> = React.memo(
    ({
        data,
        x,
        y,
        width,
        height,
        borderRadius,
        color,
        borderWidth,
        borderColor,
        label,
        shouldRenderLabel,
        labelColor,
        showTooltip,
        hideTooltip,
        onClick,
        onMouseEnter,
        onMouseLeave,
        tooltip,
        theme,
    }) => {
        const handleTooltip = e => showTooltip(tooltip, e)
        const handleMouseEnter = e => {
            onMouseEnter(data, e)
            showTooltip(tooltip, e)
        }
        const handleMouseLeave = e => {
            onMouseLeave(data, e)
            hideTooltip(e)
        }

        return (
            <g transform={`translate(${x}, ${y})`}>
                <rect
                    width={width}
                    height={height}
                    rx={borderRadius}
                    ry={borderRadius}
                    fill={data.fill !== undefined ? data.fill : color}
                    strokeWidth={borderWidth}
                    stroke={borderColor}
                    onMouseEnter={handleMouseEnter}
                    onMouseMove={handleTooltip}
                    onMouseLeave={handleMouseLeave}
                    onClick={onClick}
                />
                {shouldRenderLabel && (
                    <text
                        x={width / 2}
                        y={height / 2}
                        textAnchor="middle"
                        alignmentBaseline="central"
                        style={{
                            ...theme.labels.text,
                            pointerEvents: 'none',
                            fill: labelColor,
                        }}
                    >
                        {label}
                    </text>
                )}
            </g>
        )
    }
)

BarItem.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        indexValue: PropTypes.string.isRequired,
        fill: PropTypes.string,
    }).isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    borderRadius: PropTypes.number.isRequired,
    borderWidth: PropTypes.number.isRequired,
    borderColor: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    shouldRenderLabel: PropTypes.bool.isRequired,
    labelColor: PropTypes.string.isRequired,
    showTooltip: PropTypes.func.isRequired,
    hideTooltip: PropTypes.func.isRequired,
    getTooltipLabel: PropTypes.func.isRequired,
    tooltipFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    tooltip: PropTypes.element.isRequired,
    theme: PropTypes.shape({
        tooltip: PropTypes.object.isRequired,
        labels: PropTypes.object.isRequired,
    }).isRequired,
}

const enhance = compose(
    withPropsOnChange(['data', 'color', 'onClick'], ({ data, color, onClick }) => ({
        onClick: event => onClick({ color, ...data }, event),
    })),
    withPropsOnChange(
        ['data', 'color', 'theme', 'tooltip', 'getTooltipLabel', 'tooltipFormat'],
        ({ data, color, theme, tooltip, getTooltipLabel, tooltipFormat }) => ({
            tooltip: (
                <BasicTooltip
                    id={getTooltipLabel(data)}
                    value={data.value}
                    enableChip={true}
                    color={color}
                    theme={theme}
                    format={tooltipFormat}
                    renderContent={
                        typeof tooltip === 'function'
                            ? tooltip.bind(null, { color, theme, ...data })
                            : null
                    }
                />
            ),
        })
    )
)

export default enhance(BarItem)
