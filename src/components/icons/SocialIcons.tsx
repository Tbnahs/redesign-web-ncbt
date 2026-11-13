export function FacebookLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.414c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.235 2.686.235v2.97h-1.513c-1.49 0-1.956.931-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" fill="currentColor" />
    </svg>
  );
}

export function XLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M18.901 1.153h3.68l-8.042 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932Zm-1.291 19.693h2.039L6.486 3.048H4.298L17.61 20.846Z" fill="currentColor" />
    </svg>
  );
}

export function YouTubeLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="18" fill="#fff" />
      <path
        d="M12 20.5C12 15.8 15.8 12 20.5 12h23C48.2 12 52 15.8 52 20.5v23C52 48.2 48.2 52 43.5 52h-23C15.8 52 12 48.2 12 43.5v-23Z"
        fill="url(#youtube-red)"
      />
      <path d="M27 23.8v16.4L40.6 32 27 23.8Z" fill="#fff" />
      <defs>
        <linearGradient id="youtube-red" x1="32" y1="12" x2="32" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff2027" />
          <stop offset="1" stopColor="#cc0000" />
        </linearGradient>
      </defs>
    </svg>
  );
}
