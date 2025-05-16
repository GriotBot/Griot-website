import Link from 'next/link';
import styles from '../../styles/components/Button.module.css';

export default function Button({ 
  children, 
  href, 
  variant = 'primary', 
  size = 'medium', 
  icon = null,
  external = false,
  className = '',
  ...props 
}) {
  // Combine classes
  const buttonClasses = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`;
  
  // If icon is provided, render it
  const iconElement = icon ? (
    <span className={styles.icon} aria-hidden="true">
      <img src={`/images/${icon}.svg`} alt="" />
    </span>
  ) : null;
  
  // If href is provided, render as link
  if (href) {
    // For external links
    if (external) {
      return (
        <a 
          href={href}
          className={buttonClasses}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {iconElement}
          <span className={styles.text}>{children}</span>
        </a>
      );
    }
    
    // For internal links
    return (
      <Link href={href}>
        <a className={buttonClasses} {...props}>
          {iconElement}
          <span className={styles.text}>{children}</span>
        </a>
      </Link>
    );
  }
  
  // Default to button element
  return (
    <button className={buttonClasses} {...props}>
      {iconElement}
      <span className={styles.text}>{children}</span>
    </button>
  );
}
