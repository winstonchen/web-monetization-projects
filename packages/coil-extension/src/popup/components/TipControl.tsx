import React, { useState } from 'react'
import { styled } from '@material-ui/core'

import { PopupProps } from '../types'
import { SendTip, SendTipResult } from '../../types/commands'

import { TipButton, TipState } from './TipButton'
import { CoilContainer } from './CoilContainer'
import { TipRule } from './TipRule'
import { TipCounter } from './TipCounter'

const MIN_TIP_AMOUNT = 100
const MAX_TIP_AMOUNT = 2000

export const TipControl = styled((props: PopupProps) => {
  const [tipState, setTipState] = useState(TipState.READY)
  const [tipAmount, setTipAmount] = useState(100)
  const increaseTip = () =>
    setTipAmount(Math.min(tipAmount + 100, MAX_TIP_AMOUNT))
  const decreaseTip = () =>
    setTipAmount(Math.max(tipAmount - 100, MIN_TIP_AMOUNT))

  const sendTip = async () => {
    const message: SendTip = {
      command: 'sendTip',
      data: {
        amount: tipAmount
      }
    }

    return new Promise(resolve => {
      props.context.runtime.sendMessage(message, (result: SendTipResult) => {
        resolve(result)
      })
    }) as Promise<SendTipResult>
  }

  const onClickTip = async () => {
    setTipState(TipState.LOADING)

    // TODO: pass amount in here
    const { success } = await sendTip()

    if (success) {
      setTipState(TipState.COMPLETE)
    } else {
      setTipState(TipState.ERROR)
    }

    setTimeout(() => {
      setTipState(TipState.READY)
    }, 1000)
  }

  // TODO: should load from background
  const [tipBalance, setTipBalance] = useState(500)
  const readyToTip = Boolean(props.context.store.monetizedTotal > 0)

  const userCanTip = props.context.store.user.canTip
  return userCanTip ? (
    <>
      <TipRule />
      <CoilContainer>
        <TipCounter
          tipAmount={tipAmount}
          decrease={decreaseTip}
          increase={increaseTip}
          max={MAX_TIP_AMOUNT}
          min={MIN_TIP_AMOUNT}
        />
        <TipButton
          tipAmount={tipAmount}
          onClick={onClickTip}
          readyToTip={readyToTip}
          tipState={tipState}
        />
      </CoilContainer>
    </>
  ) : (
    <></>
  )
})({ userSelect: 'none' })
