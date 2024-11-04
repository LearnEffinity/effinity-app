import icons from "@/utils/Icons";

// * For anyone trying to add a new icon to the project:
// * 1. Right click on the component in figma and select "Copy / Copy as SVG"
// * 2. Add an item to the object in src/utils/Icons.tsx with the name of the icon
// * 2 (cont). and the value being the SVG string copied from Figma with the surrounding svg tag removed
// * 3. Use the Icon component with "name" set to the name of the icon
// * 4. To change the size of the icon, set explicit width and height props
// ! Make sure you copy the icon from the design system file!

export default function Icon({
  name,
  className,
  width,
  height,
}: {
  name: keyof typeof icons;
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <svg
      width={width || 24}
      height={height || 24}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {icons[name]}
    </svg>
  );
}
