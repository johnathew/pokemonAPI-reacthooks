import { queryClient } from "@/App";
import { SpeciesInfoTypes } from "@/types/pokemonActionTypes";
import { fetchPokemonSpecies } from "@/utils";
import { findFlavorText } from "@/utils/findFlavorText";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { MdOutlineCatchingPokemon } from "react-icons/md";
import { TbPokeballOff } from "react-icons/tb";
import { Loading } from "@/components/Loading";

const speciesInfoQuery = (id: number | string) => ({
  queryKey: ["speciesInfo", id],
  queryFn: async () => fetchPokemonSpecies(id),
  staleTime: 1000 * 60 * 60 * 24,
  gcTime: Infinity,
});

export function loader() {
  return async ({ params }: { params: { id: string | number } }) => {
    const query = speciesInfoQuery(params.id);
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery({
        ...query,
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: Infinity,
      }))
    );
  };
}

const PokeSpeciesInfo = () => {
  const pokemonName = useParams();

  const [gameVersion, setGameVersion] = useState("red");

  const { data, status, isError, isStale } = useQuery(
    speciesInfoQuery(pokemonName.id!)
  ) as UseQueryResult<SpeciesInfoTypes>;

  let content = null;

  if (status === "pending") {
    content = (
      <section className="text-xs md:text-base w-3/4 md:w-1/3 h-1/3 md:h-1/3 flex flex-col p-1 justify-center items-center text-black dark:text-slate-200  bg-slate-200 dark:bg-slate-900 bg-opacity-50 rounded-md border-2 border-black dark:border-yellow-500 shadow-md flex-shrink-0 overflow-auto">
        <Loading />
      </section>
    );
  }
  if (isError || isStale) {
    content = (
      <section className="text-xs md:text-base w-3/4 md:w-1/3 h-1/3 md:h-1/3 flex flex-col p-1 justify-center items-center text-black dark:text-slate-200  bg-slate-200 dark:bg-slate-900 bg-opacity-50 rounded-md border-2 border-black dark:border-yellow-500 shadow-md flex-shrink-0 overflow-auto">
        <div className=" w-full h-full text-[10px] md:text-base p-2 overflow-auto bg-slate-200 bg-opacity-50 dark:bg-slate-950 rounded-md flex items-center justify-center">
          <p className="flex flex-col items-center dark:text-yellow-500">
            No information found {":("} <TbPokeballOff className="text-4xl" />
          </p>
        </div>
      </section>
    );
  }

  if (data) {
    const version = findFlavorText(data.flavor_text_entries);
    content = (
      <div className="w-3/4 md:w-1/2 lg:w-1/3 h-auto md:h-1/3 flex flex-col mb-0 items-center p-1 text-black dark:text-slate-200  bg-slate-200 dark:bg-slate-900 bg-opacity-50 rounded-md border-2 border-black dark:border-yellow-500 shadow-md">
        <div className="flex w-full rounded-md p-1 bg-slate-950 bg-opacity-10 dark:bg-opacity-50 justify-start items-center border-b-2 border-double border-black dark:border-yellow-500">
          <MdOutlineCatchingPokemon
            className="text-red-700 text-2xl md:text-3xl active:scale-125"
            onClick={() => setGameVersion("red")}
          />
          <MdOutlineCatchingPokemon
            className="text-blue-700 text-2xl md:text-3xl active:scale-125"
            onClick={() => setGameVersion("blue")}
          />
        </div>
        <section className="w-full h-full text-xs md:text-base p-2 overflow-auto bg-slate-200 bg-opacity-50 dark:bg-slate-900">
          <p className="text-[12px] pl-1 md:text-base mb-2 border-b-2 border-black border-opacity-50 dark:border-yellow-500 rounded-md dark:border-opacity-50">
            {gameVersion === "red"
              ? version[0].flavor_text
              : version[1].flavor_text}
          </p>
          <p>
            <span className="text-blue-700 dark:text-yellow-300">
              Generation:{" "}
            </span>
            {data.generation.name}
          </p>
          <p>
            {" "}
            <span className="text-blue-700 dark:text-yellow-300">
              Base Happiness:{" "}
            </span>
            {data.base_happiness}
          </p>
          <p>
            <span className="text-blue-700 dark:text-yellow-300">
              Capture Rate:{" "}
            </span>
            {data.capture_rate}%
          </p>
          <p>
            <span className="text-blue-700 dark:text-yellow-300">Color: </span>
            {data.color.name}
          </p>
          <p>
            <span className="text-blue-700 dark:text-yellow-300">
              Egg Groups:
            </span>{" "}
            {data.egg_groups.map((egg: any) => egg.name).join(", ")}
          </p>
          <p>
            <span className="text-blue-700 dark:text-yellow-300">
              {" "}
              Evolves from:{" "}
            </span>
            {data.evolves_from_species?.name.length > 0
              ? data.evolves_from_species.name
              : "n/a"}
          </p>
          <p>
            <span className="text-blue-700 dark:text-yellow-300">
              Habitat:{" "}
            </span>
            {data.habitat ? data.habitat.name : "n/a"}
          </p>
        </section>
      </div>
    );
  }

  return <>{content}</>;
};
export default PokeSpeciesInfo;
