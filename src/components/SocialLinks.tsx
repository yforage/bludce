import { memo } from "react";

const SocialLinks = memo(() => {
  return (
    <div
      className={
        "max-lg:border-pink flex w-full justify-center rounded-xl py-4 max-lg:border-4 lg:justify-end lg:text-end"
      }
    >
      <div className={"space-y-1 max-lg:w-64"}>
        <span>Моё творчество в соцсетях:</span>
        <div
          className={"w-full max-lg:flex max-lg:justify-between lg:space-x-6"}
        >
          <a>Instagram</a>
          <a>Telegram</a>
          <a>VK</a>
        </div>
      </div>
    </div>
  );
});

export default SocialLinks;
