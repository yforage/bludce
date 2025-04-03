import { memo, useCallback, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { clsx } from "clsx/lite";
import { ICategorieApi } from "@/api/types";
import { ERoutes } from "@/shared/types";

interface ICatalogLinksProps {
  categories?: Pick<ICategorieApi, "id" | "name" | "slug">[];
  onClick?: () => void;
}

const CatalogLinks = memo<ICatalogLinksProps>(({ categories, onClick }) => {
  const [isOpened, setIsOpened] = useState(false);

  const toggleOpen = useCallback(() => setIsOpened((prev) => !prev), []);

  return (
    <div className={"space-y-4"}>
      <div>
        <Link to={ERoutes.CATALOG} onClick={onClick}>
          Каталог
        </Link>
        <button onClick={toggleOpen}>
          <ChevronDownIcon
            className={clsx(
              "ml-2 w-4 transition-transform",
              isOpened && "rotate-180",
            )}
          />
        </button>
      </div>
      {isOpened && (
        <div className={"flex flex-col space-y-4 text-base"}>
          {categories?.map(({ id, name, slug }) => (
            <Link
              to={`${ERoutes.CATALOG}?categorie=${slug}`}
              key={id}
              onClick={onClick}
            >
              {name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
});

export default CatalogLinks;
