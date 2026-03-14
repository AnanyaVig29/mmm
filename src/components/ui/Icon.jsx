export default function Icon({ name, size = 24, className = '', style = {} }) {
  return (
    <span 
      className={`material-symbols-rounded ${className}`} 
      style={{ fontSize: size, ...style }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
