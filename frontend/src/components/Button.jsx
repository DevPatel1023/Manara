import React from 'react'

const Button = ({title,onClick,style}) => {
  return (
    <div>
      <button onClick={onClick} className={style}>{title}</button>
    </div>
  )
}

export default Button
