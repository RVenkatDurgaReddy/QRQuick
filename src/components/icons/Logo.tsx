import type { SVGProps } from 'react';

export function QrQuickLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="currentColor"
      aria-label="QRQuick Logo"
      {...props}
    >
      <path d="M20 20h20v20H20zM60 20h20v20H60zM20 60h20v20H20z" />
      <path d="M45 45h10v10H45zM45 65h10v10H45zM65 45h10v10H65z" />
      <path d="M50 25h5v5h-5zM25 45h5v5h-5zM45 25h5v5h-5z" />
      <path d="M25 50h5v5h-5zM70 50h5v5h-5zM50 70h5v5h-5z" />
      <path d="M75 25h5v5h-5zM25 70h5v5h-5zM70 70h5v5h-5z" />
      <path d="M60 60.043h20V70H70v10H60V60.043ZM75 65h-5v5h5v-5Z" />
    </svg>
  );
}
