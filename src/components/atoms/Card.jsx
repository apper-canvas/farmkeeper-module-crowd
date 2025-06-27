import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  gradient = false,
  hover = true,
  ...props 
}) => {
  const baseClasses = gradient ? 'card-gradient' : 'card'
  const hoverClasses = hover ? 'hover:shadow-xl hover:scale-[1.01]' : ''
  
  return (
    <motion.div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card