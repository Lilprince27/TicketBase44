/**
 * Official Ticketek logo — uses the exact SVG paths from the brand asset.
 *
 * variant="white"  → white star with the "T" cut out (for dark backgrounds)
 * variant="color"  → blue star (#234b8d) + gold "T" (#f6d33c) (for light backgrounds)
 *
 * No tints, filters, or masks — just the raw fills.
 */

const STAR_PATH =
  "M29.994 64.685L25.39 78.938l-17.535.813 11.124 12.581 2.009 35.326 11.545-16.217 17.352 1.875-9.41-20.33 10.909-16.11-15.136 1.953-6.254-14.144z";
const T_PATH =
  "M39.042 81.371H22.353v5.308h5.43v21.892h5.957V86.679h5.431v-5.308h-.129z";

export default function TicketekLogo({ size = 28, variant = "white", style, className }) {
  if (variant === "color") {
    return (
      <svg
        viewBox="6 63 46 67"
        width={size}
        height={size}
        style={style}
        className={className}
      >
        <path fill="#234b8d" d={STAR_PATH} />
        <path fill="#f6d33c" d={T_PATH} />
      </svg>
    );
  }

  // White variant: single fill with even-odd rule so the "T" is a cutout
  return (
    <svg
      viewBox="6 63 46 67"
      width={size}
      height={size}
      style={style}
      className={className}
    >
      <path
        fill="#ffffff"
        fillRule="evenodd"
        clipRule="evenodd"
        d={`${STAR_PATH} ${T_PATH}`}
      />
    </svg>
  );
}