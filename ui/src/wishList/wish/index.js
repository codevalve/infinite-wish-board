import React from 'react'
import './styles.scss'
import ImgPlaceholder from '../imgPlaceholder'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

const Wish = ({ wish }) => {
  const { child, sponsor, details } = wish

  return (
    <li className="wish">
      <div className="date">
      </div>
      {child.image ? <img src={child.image} alt="child" /> : <ImgPlaceholder text="Add Image" />}
      <div>
        <p>
          <strong>Maria</strong> - Age {child.age} from {child.hometown}
        </p>
        <span className="summary">
                        {details}
                    </span>
      </div>
      {sponsor.logo ? <img src={sponsor.logo} alt="Sponsor" className="sponsor" /> : <a href="/review">Add Sponsor</a>}
      <FontAwesomeIcon icon={faChevronRight} className="wish-chevron" />
    </li>
  )
}

export default Wish