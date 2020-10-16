import React, { useState } from 'react'
import { styled, Button } from '@material-ui/core'

import { formatAmount } from '../../util/currencyFormatting'
import { Colors } from '../../shared-theme/colors'

const TipStyleButton = styled(Button)(() => ({
  padding: '0px',
  width: '212px',
  height: '32px',
  backgroundColor: Colors.Grey800,
  color: Colors.Grey99,
  fontSize: '12px',
  lineHeight: '24px',
  '&:hover': {
    backgroundColor: Colors.Grey700
  },
  '&:disabled': {
    color: Colors.Grey99
  }
}))

export enum TipState {
  READY = 0,
  LOADING,
  COMPLETE,
  ERROR
}

export interface TipButtonProps {
  onClick: () => void
  tipState: TipState
  readyToTip: boolean
  tipAmount: number
}

export const TipButton = (props: TipButtonProps) => {
  const formattedAmount = formatAmount(
    {
      amount: String(props.tipAmount),
      assetCode: 'USD',
      assetScale: 2
    },
    { precision: 0 }
  )
  switch (props.tipState) {
    case TipState.READY:
      return (
        <TipStyleButton disabled={!props.readyToTip} onClick={props.onClick}>
          TIP {formattedAmount}
        </TipStyleButton>
      )
    case TipState.LOADING:
      return <TipStyleButton disabled>[Spinner]</TipStyleButton>
    case TipState.COMPLETE:
      return <TipStyleButton disabled>[Check mark]</TipStyleButton>
    case TipState.ERROR:
      return <TipStyleButton disabled>Something went wrong.</TipStyleButton>
  }
}
