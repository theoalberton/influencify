const stroke = { stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <rect x="3" y="3" width="8" height="8" rx="2" {...stroke} />
      <rect x="13" y="3" width="8" height="5" rx="2" {...stroke} />
      <rect x="13" y="10" width="8" height="11" rx="2" {...stroke} />
      <rect x="3" y="13" width="8" height="8" rx="2" {...stroke} />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="12" cy="8" r="3.5" {...stroke} />
      <path d="M5 20c.8-3.2 3.6-5 7-5s6.2 1.8 7 5" {...stroke} />
    </svg>
  ),
  campaigns: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4 9l12-4v14L4 15V9z" {...stroke} />
      <path d="M16 8.5c1.7.4 3 1.8 3 3.5s-1.3 3.1-3 3.5" {...stroke} />
      <path d="M7 15.5V19a1.5 1.5 0 003 0v-2.5" {...stroke} />
    </svg>
  ),
  leads: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="9" cy="8" r="3" {...stroke} />
      <path d="M3.5 19c.6-2.8 2.9-4.5 5.5-4.5s4.9 1.7 5.5 4.5" {...stroke} />
      <path d="M16 8h5m-5 4h3" {...stroke} />
    </svg>
  ),
  links: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M10 14a5 5 0 007.5.5l2-2a5 5 0 00-7-7l-1 1" {...stroke} />
      <path d="M14 10a5 5 0 00-7.5-.5l-2 2a5 5 0 007 7l1-1" {...stroke} />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="12" cy="12" r="3" {...stroke} />
      <path
        d="M19 12a7 7 0 00-.14-1.4l2-1.55-2-3.46-2.35.95a7 7 0 00-2.42-1.4L13.7 2.6h-4l-.4 2.54a7 7 0 00-2.42 1.4l-2.34-.95-2 3.46 2 1.55A7 7 0 004.4 12c0 .48.05.94.14 1.4l-2 1.55 2 3.46 2.35-.95a7 7 0 002.42 1.4l.39 2.54h4l.4-2.54a7 7 0 002.42-1.4l2.34.95 2-3.46-2-1.55c.1-.46.14-.92.14-1.4z"
        {...stroke}
      />
    </svg>
  ),
  ambassadors: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="8" cy="8" r="3" {...stroke} />
      <circle cx="17" cy="10" r="2.5" {...stroke} />
      <path d="M2.5 19c.6-2.6 2.7-4.2 5.5-4.2s4.9 1.6 5.5 4.2" {...stroke} />
      <path d="M14.5 18.5c.4-1.8 1.9-3 4-3 1.3 0 2.4.5 3 1.3" {...stroke} />
    </svg>
  ),
  coupons: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4 8a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a2 2 0 100-4V8z" {...stroke} />
      <path d="M13 7.5v2m0 5v2" {...stroke} />
    </svg>
  ),
  brands: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path d="M4 21V5a2 2 0 012-2h8a2 2 0 012 2v16" {...stroke} />
      <path d="M16 9h3a1 1 0 011 1v11" {...stroke} />
      <path d="M8 7h4m-4 4h4m-4 4h4" {...stroke} />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="12" cy="7.5" r="3" {...stroke} />
      <path d="M5.5 19.5c.7-3 3.3-4.8 6.5-4.8s5.8 1.8 6.5 4.8" {...stroke} />
    </svg>
  ),
};

export type IconName = keyof typeof icons;
