import React from 'react'

const Button = ({title,onClick,style,children}) => {
  return (
    <div>
      <button onClick={onClick} className={style}>{title}{children}</button>
    </div>
  )
}

export default Button
