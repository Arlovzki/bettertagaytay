export default function ContourBackdrop() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      data-contour-background="hero"
      aria-hidden="true"
    >
      <img
        src="/images/tagaytay-elevation-contours.svg"
        alt=""
        draggable="false"
        className="h-full w-full object-cover opacity-25"
      />
    </div>
  );
}
