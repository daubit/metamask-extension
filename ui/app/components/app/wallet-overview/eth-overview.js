import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import classnames from 'classnames'
import { useHistory } from 'react-router-dom'

import Identicon from '../../ui/identicon'
import { I18nContext } from '../../../contexts/i18n'
import {
  SEND_ROUTE,
  BUILD_QUOTE_ROUTE,
  CONTACT_ADD_ROUTE,
} from '../../../helpers/constants/routes'
import {
  useMetricEvent,
  useNewMetricEvent,
} from '../../../hooks/useMetricEvent'
import { useSwapsEthToken } from '../../../hooks/useSwapsEthToken'
import Tooltip from '../../ui/tooltip'
import UserPreferencedCurrencyDisplay from '../user-preferenced-currency-display'
import { PRIMARY, SECONDARY } from '../../../helpers/constants/common'
import { showModal } from '../../../store/actions'
import {
  isBalanceCached,
  getSelectedAccount,
  getShouldShowFiat,
  getCurrentChainId,
  getCurrentKeyring,
} from '../../../selectors/selectors'
import SwapIcon from '../../ui/icon/swap-icon.component'
import BuyIcon from '../../ui/icon/overview-buy-icon.component'
import SendIcon from '../../ui/icon/overview-send-icon.component'
import {
  getSwapsFeatureLiveness,
  setSwapsFromToken,
} from '../../../ducks/swaps/swaps'
import IconButton from '../../ui/icon-button'
import { MAINNET_CHAIN_ID } from '../../../../../app/scripts/controllers/network/enums'
import WalletOverview from './wallet-overview'
import Approve from '../../ui/icon/approve-icon.component'

const EthOverview = ({ className }) => {
  const dispatch = useDispatch()
  const t = useContext(I18nContext)
  const sendEvent = useMetricEvent({
    eventOpts: {
      category: 'Navigation',
      action: 'Home',
      name: 'Clicked Send: Eth',
    },
  })
  const depositEvent = useMetricEvent({
    eventOpts: {
      category: 'Navigation',
      action: 'Home',
      name: 'Clicked Deposit',
    },
  })
  const addContactEvent = useMetricEvent({
    eventOpts: {
      category: 'Navigation',
      action: 'Home',
      name: 'Clicked Add Contact',
    },
  })
  const history = useHistory()
  const keyring = useSelector(getCurrentKeyring)
  const usingHardwareWallet = keyring.type.search('Hardware') !== -1
  const balanceIsCached = useSelector(isBalanceCached)
  const showFiat = useSelector(getShouldShowFiat)
  const selectedAccount = useSelector(getSelectedAccount)
  const { balance } = selectedAccount
  const chainId = useSelector(getCurrentChainId)
  const enteredSwapsEvent = useNewMetricEvent({
    event: 'Swaps Opened',
    properties: { source: 'Main View', active_currency: 'ETH' },
    category: 'swaps',
  })
  const swapsEnabled = useSelector(getSwapsFeatureLiveness)
  const swapsEthToken = useSwapsEthToken()

  return (
    <WalletOverview
      balance={
        <Tooltip
          position="top"
          title={t('balanceOutdated')}
          disabled={!balanceIsCached}
        >
          <div className="eth-overview__balance">
            <div className="eth-overview__primary-container">
              <UserPreferencedCurrencyDisplay
                className={classnames('eth-overview__primary-balance', {
                  'eth-overview__cached-balance': balanceIsCached,
                })}
                data-testid="eth-overview__primary-currency"
                value={balance}
                type={PRIMARY}
                ethNumberOfDecimals={4}
                hideTitle
              />
              {balanceIsCached ? (
                <span className="eth-overview__cached-star">*</span>
              ) : null}
            </div>
            {showFiat && (
              <UserPreferencedCurrencyDisplay
                className={classnames({
                  'eth-overview__cached-secondary-balance': balanceIsCached,
                  'eth-overview__secondary-balance': !balanceIsCached,
                })}
                data-testid="eth-overview__secondary-currency"
                value={balance}
                type={SECONDARY}
                ethNumberOfDecimals={4}
                hideTitle
              />
            )}
          </div>
        </Tooltip>
      }
      buttons={
        <>
          <IconButton
            className="eth-overview__button"
            Icon={BuyIcon}
            label={t('buy')}
            onClick={() => {
              depositEvent()
              dispatch(showModal({ name: 'DEPOSIT_ETHER' }))
            }}
          />
          <IconButton
            className="eth-overview__button"
            data-testid="eth-overview-send"
            Icon={SendIcon}
            label={t('send')}
            onClick={() => {
              sendEvent()
              history.push(SEND_ROUTE)
            }}
          />
          <IconButton
            className="eth-overview__button"
            data-testid="eth-overview-add-contact"
            Icon={Approve}
            label={t('addContact')}
            onClick={() => {
              addContactEvent()
              history.push(CONTACT_ADD_ROUTE)
            }}
          />
        </>
      }
      className={className}
      icon={<Identicon diameter={32} />}
    />
  )
}

EthOverview.propTypes = {
  className: PropTypes.string,
}

EthOverview.defaultProps = {
  className: undefined,
}

export default EthOverview
