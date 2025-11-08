interface LettuceLeafIconProps {
  className?: string;
  color?: string;
}

export const LettuceLeafIcon = ({ className = "", color = "hsl(var(--primary))" }: LettuceLeafIconProps) => {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M100 180C100 180 70 170 55 150C45 135 40 115 40 95C40 75 45 55 55 40C65 25 80 15 100 15C120 15 135 25 145 40C155 55 160 75 160 95C160 115 155 135 145 150C130 170 100 180 100 180Z"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M65 70C65 70 70 80 80 90C85 95 95 100 100 100"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M135 70C135 70 130 80 120 90C115 95 105 100 100 100"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M100 40C100 40 95 60 95 80C95 85 97 92 100 100"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M80 50C80 50 75 65 72 80C70 88 72 95 76 100"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M120 50C120 50 125 65 128 80C130 88 128 95 124 100"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M90 150C90 150 95 135 100 125C105 135 110 150 110 150"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M60 120C60 120 70 115 85 115"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M140 120C140 120 130 115 115 115"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
