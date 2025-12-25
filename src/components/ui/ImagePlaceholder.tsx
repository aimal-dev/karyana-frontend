interface ImagePlaceholderProps {
  width?: number;
  height?: number;
  text?: string;
  className?: string;
}

export default function ImagePlaceholder({ 
  width = 400, 
  height = 400, 
  text = "Product Image",
  className = ""
}: ImagePlaceholderProps) {
  return (
    <div 
      className={`flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted ${className}`}
      style={{ width: '100%', height: '100%' }}
    >
      <svg 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
      >
        <rect width={width} height={height} fill="currentColor" className="text-muted/30" />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-muted-foreground/40 text-xs font-medium uppercase tracking-wider"
          style={{ fontSize: '14px' }}
        >
          {text}
        </text>
        <circle cx="50%" cy="40%" r="30" className="fill-muted-foreground/20" />
        <path
          d={`M ${width/2 - 20} ${height*0.4 - 10} L ${width/2} ${height*0.4 + 10} L ${width/2 + 20} ${height*0.4 - 10}`}
          className="fill-muted-foreground/30"
        />
      </svg>
    </div>
  );
}
