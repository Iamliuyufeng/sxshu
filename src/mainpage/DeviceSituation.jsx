import React, { useEffect } from 'react'
import Metric3 from '../components/metric3/Metric3'
import deviceImage from '../assets/image/wt.png'
import inverterImage from '../assets/image/inverter.png'
import boosterImage from '../assets/image/booster.png'

import homeStore from '../store/home'

const DeviceSituation = () => {
  const statistics = homeStore(state => state.statistics)
  const fetchStatistics = homeStore(state => state.fetchStatistics)

  useEffect(() => {
    fetchStatistics()
  }, [])

  return (
    <div className='device-situation'>
      <Metric3 icon={deviceImage} label='风机' unit='台' value={statistics.wind_turbine} />
      <Metric3 icon={inverterImage} label='逆变器' unit='台' value={statistics.inverter} />
      <Metric3 icon={boosterImage} label='升压站' unit='座' value={statistics.substation} />
    </div>
  )
}

export default DeviceSituation
