import Section from "@/components/section";
import TransitionLink from "@/components/transition-link";
import { useAtomValue } from "jotai";
import { categoriesState } from "@/state";
import Otiv from "@/static/categories/otiv.png";
import Angela from "@/static/categories/angela.png";
import Qik from "@/static/categories/qik.png";
import Ritana from "@/static/categories/ritana.png";
import Hewel from "@/static/categories/hewel.png";
import Jex from "@/static/categories/jex.png";
import Wit from "@/static/categories/wit.png";
import Faz from "@/static/categories/faz.png";

export default function Category() {
  const categories = [
    {
      "id": 'otiv',
      "name": "Giảm đau đầu\nmất ngủ",
      "image": Otiv,
      "filter": ['otiv'],
    },
    {
      "id": 'angela-gold',
      "name": "Sức khỏe & Sắc đẹp,\nsinh lý nữ",
      "image": Angela,
      "filter": ["angela-gold"]
    },
    {
      "id": "qik-hair-for-men, qik-hair-for-women",
      "name": "Giảm rụng,\nmọc tóc",
      "image": Qik,
      "filter": ["qik-hair-for-men", "qik-hair-for-women"]
    },
    {
      "id": 'ritana',
      "name": "Da căng sáng,\nmịn màng",
      "image": Ritana,
      "filter": ["ritana"]
    },
    {
      "id": 'hewel',
      "name": "Thải độc,\nbảo vệ gan",
      "image": Hewel,
      "filter": ["hewel"]
    },
    {
      "id": 'jex',
      "name": "Giảm đau,\nbảo vệ xương khớp",
      "image": Jex,
      "filter": ["jex"]
    },
    {
      "id": 'wit',
      "name": "Bổ mắt",
      "image": Wit,
      "filter": ["wit"]
    },
    {
      "id": 'faz',
      "name": "Điều hòa\nmỡ máu",
      "image": Faz,
      "filter": ["faz"]
    }
  ]

  
  return (
    <Section title="Danh mục sản phẩm" viewMoreTo="/categories">
      <div className="pt-2.5 pb-4 grid grid-cols-4 gap-y-6 gap-x-4 px-4">
        {categories.map((category) => (
          <TransitionLink
            key={category.id}
            className="flex flex-col items-center space-y-2 overflow-hidden cursor-pointer"
            to={`/category/${category.id}`}
          >
            <img
              src={category.image}
              className="w-[70px] h-[70px] object-cover rounded-full border-[0.5px] border-black/15"
              alt={category.name}
            />

            <div className="text-center text-sm w-full line-clamp-2 text-subtitle">
              {category.name}
            </div>
          </TransitionLink>
        ))}
      </div>
    </Section>
  );
}
