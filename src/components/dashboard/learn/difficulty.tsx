import React from "react";

interface DifficultyIconsProps {
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

const DifficultyIcons: React.FC<DifficultyIconsProps> = ({ difficulty }) => {
  const filledCount =
    difficulty === "Beginner" ? 1 : difficulty === "Intermediate" ? 2 : 3;

  return (
    <div className="flex items-center">
      {[...Array(3)].map((_, index) => (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10.0003 13.3332C13.222 13.3332 15.8337 10.7215 15.8337 7.49984C15.8337 4.27818 13.222 1.6665 10.0003 1.6665C6.77866 1.6665 4.16699 4.27818 4.16699 7.49984C4.16699 10.7215 6.77866 13.3332 10.0003 13.3332ZM10.0003 4.99984C9.76361 4.99984 9.60528 5.28387 9.28862 5.85193L9.20669 5.9989C9.11671 6.16032 9.07171 6.24103 9.00156 6.29429C8.93141 6.34754 8.84404 6.36731 8.6693 6.40685L8.51021 6.44284C7.89529 6.58198 7.58783 6.65154 7.51468 6.88677C7.44153 7.122 7.65114 7.36711 8.07035 7.85732L8.17881 7.98414C8.29793 8.12345 8.3575 8.1931 8.38429 8.27927C8.41109 8.36544 8.40208 8.45837 8.38407 8.64423L8.36767 8.81344C8.3043 9.46749 8.27261 9.79451 8.46411 9.93989C8.65562 10.0853 8.94349 9.95272 9.51924 9.68763L9.6682 9.61905C9.83181 9.54372 9.91361 9.50605 10.0003 9.50605C10.087 9.50605 10.1688 9.54372 10.3325 9.61905L10.4814 9.68763C11.0572 9.95272 11.345 10.0853 11.5365 9.93989C11.728 9.79451 11.6964 9.46749 11.633 8.81344L11.6166 8.64423C11.5986 8.45837 11.5896 8.36543 11.6164 8.27927C11.6432 8.1931 11.7027 8.12345 11.8218 7.98415L11.9303 7.85732C12.3495 7.36711 12.5591 7.122 12.486 6.88677C12.4128 6.65154 12.1054 6.58198 11.4904 6.44284L11.3314 6.40685C11.1566 6.36731 11.0692 6.34754 10.9991 6.29429C10.9289 6.24103 10.8839 6.16032 10.794 5.9989L10.712 5.85193C10.3954 5.28387 10.237 4.99984 10.0003 4.99984Z"
            fill={index < filledCount ? "#7F56D9" : "#D0D5DD"}
          />
          <path
            d="M5.91084 13.2847L5.5952 14.436C5.07158 16.3458 4.80977 17.3008 5.15914 17.8235C5.28158 18.0068 5.44583 18.1538 5.63643 18.2509C6.18029 18.5278 7.02 18.0902 8.69943 17.2151C9.25822 16.924 9.53764 16.7784 9.83452 16.7467C9.94457 16.735 10.0554 16.735 10.1655 16.7467C10.4624 16.7784 10.7418 16.924 11.3006 17.2151C12.98 18.0902 13.8197 18.5278 14.3636 18.2509C14.5542 18.1538 14.7184 18.0068 14.8409 17.8235C15.1902 17.3008 14.9284 16.3458 14.4048 14.436L14.0892 13.2847C12.934 14.1027 11.5232 14.5835 10 14.5835C8.47684 14.5835 7.06596 14.1027 5.91084 13.2847Z"
            fill={index < filledCount ? "#7F56D9" : "#D0D5DD"}
          />
        </svg>
      ))}
    </div>
  );
};

export default DifficultyIcons;