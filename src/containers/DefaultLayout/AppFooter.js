import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <a href="https://gofundher.com" target="_blank" rel="noopener noreferrer">
          GoFundHer.com
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)