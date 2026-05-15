import CategoryTabs from "@/components/category-tabs";
import SearchBar from "@/components/search-bar";
import TransitionLink from "@/components/transition-link";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import { categoriesState } from "@/state";
import Otiv from "@/static/categories/otiv.png";
import Angela from "@/static/categories/angela.png";
import Qik from "@/static/categories/qik.png";
import Ritana from "@/static/categories/ritana.png";
import Hewel from "@/static/categories/hewel.png";
import Jex from "@/static/categories/jex.png";
import Wit from "@/static/categories/wit.png";
import Faz from "@/static/categories/faz.png";

export default function CategoryListPage() {
  const navigate = useNavigate();
  const categories = [
    {
      "id": 1,
      "name": "Giảm đau đầu\nmất ngủ",
      "image": Otiv
    },
    {
      "id": 2,
      "name": "Sức khỏe & Sắc đẹp,\nsinh lý nữ",
      "image": Angela
    },
    {
      "id": 3,
      "name": "Giảm rụng,\nmọc tóc",
      "image": Qik
    },
    {
      "id": 4,
      "name": "Da căng sáng,\nmịn màng",
      "image": Ritana
    },
    {
      "id": 5,
      "name": "Thải độc,\nbảo vệ gan",
      "image": Hewel
    },
    {
      "id": 6,
      "name": "Giảm đau,\nbảo vệ xương khớp",
      "image": Jex
    },
    {
      "id": 7,
      "name": "Bổ mắt",
      "image": Wit
    },
    {
      "id": 8,
      "name": "Điều hòa\nmỡ máu",
      "image": Faz
    }
  ]

  return (
    <>
      <div className="py-2">
        <SearchBar onClick={() => navigate("/search")} />
      </div>
      <CategoryTabs />
      <div className="grid grid-cols-4 p-4 gap-x-4 gap-y-8">
        {categories.map((category) => (
          <TransitionLink
            key={category.id}
            className="flex flex-col items-center space-y-2 overflow-hidden cursor-pointer"
            to={`/category/${category.id}`}
          >
            <img
              src={category.image}
              className="aspect-square object-cover rounded-full border-[0.5px] border-black/15"
              alt={category.name}
            />
            <div className="text-center text-sm w-full line-clamp-2 text-subtitle">
              {category.name}
            </div>
          </TransitionLink>
        ))}
      </div>
    </>
  );
}
