const ridgeTones = {
  hero: ['text-primary-200', 'text-primary-400', 'text-primary-700'],
  footer: ['text-primary-300', 'text-primary-700', 'text-primary-950'],
};

export default function RidgeDivider({
  variant = 'hero',
}: {
  variant?: keyof typeof ridgeTones;
}) {
  const tones = ridgeTones[variant];

  return (
    <div
      className="relative h-28 sm:h-36 lg:h-44 overflow-hidden pointer-events-none"
      data-ridge-divider={variant}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 240"
        preserveAspectRatio="none"
        className="absolute inset-y-0 left-1/2 h-full w-full min-w-[48rem] -translate-x-1/2"
        focusable="false"
      >
        <path
          className={tones[0]}
          fill="currentColor"
          d="M0 168C86 159 135 139 214 145L292 121 330 128 388 88 416 100 462 61 490 83 513 78 583 132C640 150 702 125 754 134L808 104 842 112 902 59 930 77 954 73 1016 122C1072 140 1119 121 1170 132L1248 100 1276 110 1338 78 1382 111 1440 121V240H0Z"
        />
        <path
          className={tones[1]}
          fill="currentColor"
          d="M0 196C84 190 138 170 216 179L284 154 318 164 372 136 403 148 468 115 502 136 530 127 600 169C668 182 718 161 780 170L844 145 879 154 940 122 977 143 1005 134 1078 172C1145 185 1200 157 1260 168L1326 147 1360 158 1406 144 1440 154V240H0Z"
        />
        <path
          className={tones[2]}
          fill="currentColor"
          d="M0 218C98 218 148 199 226 204S348 217 426 196 524 177 602 194 728 217 812 199 900 172 980 192 1090 216 1172 200 1300 183 1370 199L1440 207V240H0Z"
        />
      </svg>
    </div>
  );
}
