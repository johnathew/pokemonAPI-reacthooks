import axios from "axios";
import { useEffect, useState } from "react";

export const useData = (url: string) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (url) {
      let ignore = false;
      axios
        .get(url)
        .then((res) => {
          if (!ignore) {
            return setData(
              res.data.flavor_text_entries.find(
                (lang: any) => lang.language.name === "en"
              )
            );
          }
        })
        .catch((error) => {
          return console.log(error);
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);

  return data;
};
