import React from "react";
import Link from "next/link";

interface LessonCardProps {
  lessonNumber: number;
  title: string;
  description: string;
  status: "not-started" | "in-progress" | "completed";
  progress?: number;
  slug: string;
  moduleSlug: string;
  topic: string;
}

export default function LessonCard({
  lessonNumber,
  title,
  description,
  status,
  progress = 0,
  slug,
  moduleSlug,
  topic,
}: LessonCardProps) {
  return (
    <div className="flex h-[280px] w-full flex-row items-center rounded-xl bg-neutral-50">
      <img
        src={"/screen-1/Trophy.png"}
        className="mx-14 my-14 h-[170px] w-[170px]"
        alt={`ModuleImage`}
      />
      <div className="flex h-full w-full flex-col gap-y-4 rounded-r-xl bg-surface-base p-8">
        <div className="flex flex-col gap-y-2">
          <div className="flex justify-between">
            <h3 className="text-base font-medium leading-6 text-text-secondary">
              Lesson {lessonNumber}
            </h3>
            {renderStatusIcon(status)}
          </div>
          <h1 className="text-2xl font-medium text-text-primary">{title}</h1>
        </div>
        <h6 className="mb-8 w-full text-base font-normal text-text-secondary">
          {description}
        </h6>

        <div className="flex w-full items-center justify-end -mt-4">
          {renderActionButton(status, progress, slug, moduleSlug, topic)}
        </div>
      </div>
    </div>
  );
}

function renderStatusIcon(status: "not-started" | "in-progress" | "completed") {
  switch (status) {
    case "completed":
      return <CompleteIcon />;
    case "in-progress":
      return <ProgressCircle />;
    case "not-started":
      return <StartIcon />;
  }
}

function renderActionButton(
  status: "not-started" | "in-progress" | "completed",
  progress: number,
  slug: string,
  moduleSlug: string,
  topic: string
) {
  switch (status) {
    case "completed":
      return (
        <Link
          href={`/learn/${topic}/${moduleSlug}/${slug}`}
          className="mt-7 inline-block cursor-pointer bg-transparent px-4 py-2 font-semibold text-brand-accent transition-colors duration-300 ease-in-out hover:text-brand-tertiary"
        >
          Review
        </Link>
      );
    case "in-progress":
      return (
        <div className="mt-7 flex w-full items-center justify-between gap-x-4">
          <div className="w-10/12 -translate-y-1 transform">
            <p className="pb-2 text-sm font-semibold text-brand-accent ">
              {progress}% complete
            </p>
            <div className="h-2 w-full rounded-full bg-brand-quaternary">
              <div
                className="h-full rounded-full bg-brand-accent"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <Link
            href={`/learn/${topic}/${moduleSlug}/${slug}`}
            className="inline-block cursor-pointer rounded-md bg-brand-accent px-4 py-2 font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-brand-tertiary"
          >
            Continue
          </Link>
        </div>
      );
    case "not-started":
      return (
        <Link
          href={`/learn/${topic}/${moduleSlug}/${slug}`}
          className="mt-7 inline-block cursor-pointer rounded-md bg-brand-accent px-4 py-2 font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-brand-tertiary"
        >
          Start
        </Link>
      );
  }
}

interface IconProps {
  className?: string;
}

const CompleteIcon = ({ className }: IconProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M58.6673 32.0007C58.6673 46.7282 46.7282 58.6673 32.0007 58.6673C17.2731 58.6673 5.33398 46.7282 5.33398 32.0007C5.33398 17.2731 17.2731 5.33398 32.0007 5.33398C46.7282 5.33398 58.6673 17.2731 58.6673 32.0007ZM42.7482 23.9198C43.5292 24.7008 43.5292 25.9671 42.7482 26.7482L29.4149 40.0815C28.6338 40.8626 27.3675 40.8626 26.5864 40.0815L21.2531 34.7482C20.4721 33.9672 20.4721 32.7008 21.2531 31.9198C22.0342 31.1387 23.3005 31.1387 24.0815 31.9198L28.0007 35.8389L33.9602 29.8793L39.9198 23.9198C40.7008 23.1387 41.9671 23.1387 42.7482 23.9198Z"
        fill="#47B881"
      />
    </svg>
  );
};

const ProgressCircle = ({ className }: IconProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M24.2662 6.39409C24.664 7.42455 24.1511 8.58237 23.1206 8.98014C22.7435 9.12574 22.3708 9.28034 22.0028 9.4437C20.9932 9.89189 19.8115 9.4368 19.3633 8.42725C18.9151 7.41769 19.3702 6.23596 20.3798 5.78777C20.8078 5.59776 21.2413 5.41791 21.6801 5.24852C22.7106 4.85074 23.8684 5.36363 24.2662 6.39409ZM15.0612 11.308C15.823 12.1079 15.7921 13.3738 14.9922 14.1356C14.6998 14.4141 14.4141 14.6998 14.1356 14.9922C13.3738 15.7921 12.1079 15.823 11.308 15.0612C10.5082 14.2994 10.4773 13.0335 11.239 12.2336C11.5624 11.8941 11.894 11.5624 12.2336 11.239C13.0335 10.4773 14.2994 10.5082 15.0612 11.308ZM8.42725 19.3633C9.4368 19.8115 9.89189 20.9932 9.4437 22.0028C9.28034 22.3708 9.12573 22.7435 8.98014 23.1206C8.58236 24.1511 7.42455 24.664 6.39409 24.2662C5.36363 23.8684 4.85074 22.7106 5.24852 21.6801C5.4179 21.2413 5.59776 20.8078 5.78777 20.3798C6.23596 19.3702 7.41769 18.9151 8.42725 19.3633ZM5.39021 29.3448C6.49446 29.3715 7.368 30.2883 7.34132 31.3925C7.33644 31.5946 7.33398 31.7973 7.33398 32.0007C7.33398 32.204 7.33644 32.4067 7.34132 32.6088C7.368 33.713 6.49446 34.6298 5.39021 34.6565C4.28597 34.6832 3.36917 33.8097 3.34249 32.7054C3.33683 32.4711 3.33398 32.2362 3.33398 32.0007C3.33398 31.7651 3.33683 31.5302 3.34249 31.2959C3.36917 30.1916 4.28597 29.3181 5.39021 29.3448ZM57.6072 39.7351C58.6377 40.1329 59.1506 41.2907 58.7528 42.3212C58.5834 42.76 58.4035 43.1935 58.2135 43.6215C57.7653 44.6311 56.5836 45.0862 55.5741 44.638C54.5645 44.1898 54.1094 43.0081 54.5576 41.9985C54.721 41.6305 54.8756 41.2578 55.0212 40.8807C55.4189 39.8502 56.5768 39.3373 57.6072 39.7351ZM6.39409 39.7351C7.42455 39.3373 8.58237 39.8502 8.98014 40.8807C9.12574 41.2578 9.28034 41.6305 9.4437 41.9985C9.89189 43.0081 9.4368 44.1898 8.42725 44.638C7.41769 45.0862 6.23596 44.6311 5.78777 43.6215C5.59776 43.1935 5.41791 42.76 5.24852 42.3212C4.85074 41.2907 5.36363 40.1329 6.39409 39.7351ZM52.6933 48.9401C53.4931 49.7019 53.524 50.9678 52.7623 51.7677C52.4389 52.1073 52.1073 52.4389 51.7677 52.7623C50.9678 53.524 49.7019 53.4931 48.9401 52.6933C48.1783 51.8934 48.2092 50.6275 49.0091 49.8657C49.3015 49.5872 49.5872 49.3015 49.8657 49.0091C50.6275 48.2092 51.8934 48.1783 52.6933 48.9401ZM11.308 48.9401C12.1079 48.1783 13.3738 48.2092 14.1356 49.0091C14.4141 49.3015 14.6998 49.5872 14.9922 49.8657C15.7921 50.6275 15.823 51.8934 15.0612 52.6933C14.2994 53.4931 13.0335 53.524 12.2336 52.7623C11.8941 52.4389 11.5624 52.1073 11.239 51.7677C10.4773 50.9678 10.5082 49.7019 11.308 48.9401ZM19.3633 55.5741C19.8115 54.5645 20.9932 54.1094 22.0028 54.5576C22.3708 54.721 22.7435 54.8756 23.1206 55.0212C24.1511 55.4189 24.664 56.5768 24.2662 57.6072C23.8684 58.6377 22.7106 59.1506 21.6801 58.7528C21.2413 58.5834 20.8078 58.4035 20.3798 58.2135C19.3702 57.7653 18.9151 56.5836 19.3633 55.5741ZM44.638 55.5741C45.0862 56.5836 44.6311 57.7653 43.6215 58.2135C43.1935 58.4035 42.76 58.5834 42.3212 58.7528C41.2907 59.1506 40.1329 58.6377 39.7351 57.6072C39.3373 56.5768 39.8502 55.4189 40.8807 55.0212C41.2578 54.8756 41.6305 54.721 41.9985 54.5576C43.0081 54.1094 44.1898 54.5645 44.638 55.5741ZM29.3448 58.6111C29.3715 57.5068 30.2883 56.6333 31.3925 56.66C31.5946 56.6649 31.7973 56.6673 32.0007 56.6673C32.204 56.6673 32.4067 56.6649 32.6088 56.66C33.713 56.6333 34.6298 57.5068 34.6565 58.6111C34.6832 59.7153 33.8097 60.6321 32.7054 60.6588C32.4711 60.6645 32.2362 60.6673 32.0007 60.6673C31.7651 60.6673 31.5302 60.6645 31.2959 60.6588C30.1916 60.6321 29.3181 59.7153 29.3448 58.6111Z"
        fill="#583AFE"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M30.0007 5.33398C30.0007 4.22941 30.8961 3.33398 32.0007 3.33398C47.8328 3.33398 60.6673 16.1685 60.6673 32.0007C60.6673 33.1052 59.7719 34.0007 58.6673 34.0007C57.5628 34.0007 56.6673 33.1052 56.6673 32.0007C56.6673 18.3776 45.6237 7.33398 32.0007 7.33398C30.8961 7.33398 30.0007 6.43855 30.0007 5.33398Z"
        fill="#583AFE"
      />
      <path
        d="M41.4035 27.4035C42.0869 26.72 42.0869 25.612 41.4035 24.9286C40.72 24.2452 39.612 24.2452 38.9286 24.9286L28.4994 35.3578L25.0701 31.9286C24.3867 31.2452 23.2787 31.2452 22.5952 31.9286C21.9118 32.612 21.9118 33.72 22.5952 34.4035L27.2619 39.0701C27.9453 39.7535 29.0534 39.7535 29.7368 39.0701L41.4035 27.4035Z"
        fill="#583AFE"
      />
    </svg>
  );
};

const StartIcon = ({ className }: IconProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M58.6673 32.0007C58.6673 46.7282 46.7282 58.6673 32.0007 58.6673C17.2731 58.6673 5.33398 46.7282 5.33398 32.0007C5.33398 17.2731 17.2731 5.33398 32.0007 5.33398C46.7282 5.33398 58.6673 17.2731 58.6673 32.0007ZM42.7482 23.9198C43.5292 24.7008 43.5292 25.9671 42.7482 26.7482L29.4149 40.0815C28.6338 40.8626 27.3675 40.8626 26.5864 40.0815L21.2531 34.7482C20.4721 33.9672 20.4721 32.7008 21.2531 31.9198C22.0342 31.1387 23.3005 31.1387 24.0815 31.9198L28.0007 35.8389L33.9602 29.8793L39.9198 23.9198C40.7008 23.1387 41.9671 23.1387 42.7482 23.9198Z"
        fill="#BCBBC3"
      />
    </svg>
  );
};
