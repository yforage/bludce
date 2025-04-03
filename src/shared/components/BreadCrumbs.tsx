import { memo } from "react";
import { Link } from "react-router-dom";

interface IBreadCrumbProps {
  crumbs: {
    name: string;
    link?: string;
  }[];
  length: number;
}

const BreadCrumbs = memo<IBreadCrumbProps>(({ crumbs, length }) => (
  <div className={"flex space-x-2 text-zinc-400"}>
    {crumbs.map(({ name, link }, index, arr) => (
      <span key={name} className={"last:text-gray shrink-0"}>
        {link && <Link to={link}>{name}</Link>}
        {!link && name}
        {index !== arr.length - 1 ? " /" : null}
      </span>
    ))}
    {length - crumbs.length !== 0 &&
      Array.from({ length: length - crumbs.length }).map((_, index, arr) => (
        <div key={index} className="flex animate-pulse">
          {index === 0 && <span className="mr-2">/</span>}
          <div className="w-20 rounded-md bg-zinc-200" />
          {index !== arr.length - 1 && <span className="ml-2">/</span>}
        </div>
      ))}
  </div>
));

export default BreadCrumbs;
