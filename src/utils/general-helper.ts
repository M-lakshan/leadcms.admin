import { RequestContextType } from "@providers/request-provider";
import { continentListStorageKey, countryListStorageKey } from "./constants";
import { NotificationsService } from "@hooks";
import { CustomStylingInstance, TechStackType, TechStackTypeTag } from "types";

export const operationHold = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(() => resolve(), ms));

export const getCountryList = async (context: RequestContextType) => {
  const countries = localStorage.getItem(countryListStorageKey);
  if (countries) {
    return JSON.parse(countries) as Record<string, string>;
  } else {
    try {
      const { data } = await context.client.api.countriesList();
      localStorage.setItem(countryListStorageKey, JSON.stringify(data));
      return data;
    } catch (e) {
      return null;
    }
  }
};

export const getCountryByCode = async (context: RequestContextType, code: string) => {
  const countries = await getCountryList(context);
  if (countries) {
    const countryList = Object.entries(countries).map(([code, name]) => ({ code, name }));
    return countryList.find((c) => c.code === code)?.name;
  } else {
    return null;
  }
};

export const getContinentList = async (context: RequestContextType) => {
  const continents = localStorage.getItem(continentListStorageKey);
  if (continents) {
    return JSON.parse(continents) as Record<string, string>;
  } else {
    try {
      const { data } = await context.client.api.continentsList();
      localStorage.setItem(continentListStorageKey, JSON.stringify(data));
      return data;
    } catch (e) {
      return null;
    }
  }
};

export const getContinentByCode = async (context: RequestContextType, code: string) => {
  const continents = await getContinentList(context);
  if (continents) {
    const continentList = Object.entries(continents).map(([code, name]) => ({ code, name }));
    return continentList.find((c) => c.code === code)?.name;
  } else {
    return null;
  }
};

export const networkErrorToStringArray = (error: unknown) => {
  if (error === undefined || error === null) {
    return [];
  }
  const output: string[] = [];
  const keys = Object.keys(error);
  const values = Object.values(error);
  keys.map((key, idx) => {
    const value = values[idx] as string[];
    const stringValue = value.reduce((acc, val) => {
      return `${acc}\u000A${val}`;
    });
    output.push(`${key}:\u000A${stringValue}`);
  });
  return output;
};

export const execDeleteWithToast = async (
  deleteFunc: () => Promise<void>,
  notificationsService: NotificationsService,
  entity: string,
  showErrorModalFunc: (value: string[]) => void
) => {
  const entityNameWithCapFirstLetter =
    entity.charAt(0).toUpperCase() + entity.slice(1).toLowerCase();
  notificationsService.promise(deleteFunc(), {
    pending: `Deleting ${entity}`,
    success: `${entityNameWithCapFirstLetter} deleted successfully`,
    error: (error) => {
      const errMessage = `Unable to delete ${entity}. An error occurred.`;
      const errDetails: string[] = [];
      if (error.data?.error?.title) {
        errDetails.push(error.data.error.title);
      }
      if (error.data?.message) {
        errDetails.push(error.data.message);
      }
      if (error.data?.error?.errors) {
        errDetails.push(...networkErrorToStringArray(error.data.error.errors));
      }
      return {
        title: errMessage,
        onClick: errDetails.length > 0 ? () => showErrorModalFunc(errDetails) : undefined,
      };
    },
  });
};

export function getModuleNameFromUrl(): string {
  if (typeof window === "undefined") return "";
  const path = window.location.pathname;
  const moduleRaw = path.split("/")[1] || "";
  return moduleRaw
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function generalizeDependencies(
  deps: Record<string, string>,
  filters: any
): Record<string, TechStackType> {
  const groupedDeps: Record<string, string> = {};
  const techStack: Record<string, any> = {};
  const allowedKeys = ["site", "admin", "backend"];
  const uniqueKeyWords = [
    "AJAX",
    "API",
    "CLI",
    "CSS",
    "DOM",
    "DXD",
    "DND",
    "HTML",
    "HTTP",
    "HTTPS",
    "JWT",
    "JSON",
    "MD",
    "MDX",
    "OAuth",
    "REST",
    "SEO",
    "SQL",
    "SVG",
    "TS",
    "UI",
    "UX",
    "JS",
  ];

  const neglectCheck = (list: string[], param: string) => {
    return list.some((ngl) => param.toLowerCase().includes(ngl.toLowerCase()));
  };

  const filterFrameworks = (frameworkObj: Record<string, string>) => {
    const seenBases = new Set<string>();
    const filtered: Record<string, string> = {};

    Object.keys(frameworkObj).forEach((key) => {
      const baseName = key.split("@")[1].split("-")[0];

      if (!seenBases.has(baseName)) {
        filtered[key] = frameworkObj[key];
        seenBases.add(baseName);
      }
    });

    return filtered;
  };

  for (const [name, version] of Object.entries(deps)) {
    if (name.startsWith("@")) {
      if (name.includes("/")) {
        const scope = name.split("/")[0];

        if (!filters || (filters?.omits && !neglectCheck(filters.omits, scope))) {
          groupedDeps[scope] = version;
        }
      } else {
        if (!filters || (filters?.omits && !neglectCheck(filters.omits, name))) {
          groupedDeps[name] = version;
        }
      }
    } else {
      if (!filters || (filters?.omits && !neglectCheck(filters.omits, name))) {
        groupedDeps[`@${name}`] = version;
      }
    }
  }

  for (const key of allowedKeys) {
    const category = filters?.categories?.[key];

    if (!category) continue;

    techStack[key] = !category?.overWrite
      ? {
          segment_i: {
            icon: category.icon,
            title: category.title,
            descrp: category.descrp,
            tags: category.tags || [],
          },
          segment_ii: {
            context: [
              { key: "frmwk_i", label: "framework", value: category?.framework.label || "unknown" },
              { key: "frmwk_ii", label: "last-updated", value: "unknown" },
              ...(category.segment_ii?.context ?? []),
            ],
          },
          segment_iii: {
            context: [] as TechStackTypeTag[],
          },
        }
      : {
          segment_i: category.segment_i,
          segment_ii: category.segment_ii,
          segment_iii: category.segment_iii,
        };

    const checklist: string[] = category.checklist || [];
    const frameworkTags: string[] = category?.framework?.alts || [];

    Object.entries(filterFrameworks(groupedDeps)).forEach(([depName, version]) => {
      if (
        checklist.some((tag) => depName.includes(tag)) &&
        !frameworkTags.some((tag) => depName.includes(tag.toLowerCase()))
      ) {
        const keyName = depName.startsWith("@") ? depName.replace("@", "") : depName;

        const labelName = keyName
          .split("-")
          .map((tag) => {
            const label = tag.toLocaleLowerCase();
            const uniqueKeyWord = uniqueKeyWords.find((unqPhrase) =>
              label.includes(unqPhrase.toLowerCase())
            );
            const result = tag[0].toUpperCase() + tag.split("").splice(1).join("");

            if (uniqueKeyWord) {
              if (uniqueKeyWord.length != label.length) {
                return result.replace(uniqueKeyWord.toLocaleLowerCase(), uniqueKeyWord);
              } else {
                return uniqueKeyWord;
              }
            } else {
              return result;
            }
          })
          .join(" ");

        techStack[key].segment_iii.context.push({
          tag: depName,
          label: labelName,
          value: `v${version.replace("^", "")}`,
        });
      }
    });
  }

  return techStack;
}

export function SetComponentStyles({
  styleObj,
  className,
}: {
  styleObj?: CustomStylingInstance;
  className?: string;
}): string {
  const {
    omitTW = false,
    cmpTag = "",
    cmpStyles = [],
    twStyles = [],
    dymStyles = [],
  } = styleObj ?? {};

  return [cmpTag, className, ...cmpStyles, ...(omitTW ? [] : twStyles), ...dymStyles]
    .filter(Boolean)
    .join(" ")
    .trim();
}

export const getFormattedDateOnly = (dateToConvert: string, reverse = false) => {
  const date = new Date(dateToConvert);
  const formattedDate = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [y, m, d] = formattedDate.split("-");

  return !reverse ? formattedDate : [d, m, y].join("-");
};

export const getFormattedDateTime = (dateToConvert: string, reverse = false) => {
  const date = new Date(dateToConvert);
  const formattedDate = getFormattedDateOnly(dateToConvert, reverse);
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  const formattedDateTime = `${formattedDate}  ${formattedTime}`;
  return formattedDateTime;
};

export function GetISOstrDate({
  dateStr,
  dtType,
  dtFormat,
  suffix,
}: {
  dateStr?: string;
  dtType?: string | "date_only" | "time_only" | "datetime";
  dtFormat?: string | "dd-mm-yyyy" | "yyyy-mm-dd" | "H:M:S" | "h:m:s";
  suffix?: string;
}): string {
  const checkPlurality = (cntx: number, prefix: string) => {
    if (cntx > 0) {
      return `${prefix}${cntx > 1 ? "s" : ""}`;
    } else {
      return `${prefix}s`;
    }
  };

  if (dateStr) {
    let result = dateStr.split("T")[0];

    if (dtType && dtType !== "date_only") {
      const date = new Date(dateStr);

      if (dtType === "time_only") {
        const hrs = date.getHours();
        const mins = date.getMinutes();

        if (dtFormat === "H:M:S") {
          result = `${checkPlurality(hrs, "hour")}${
            mins > 0 ? `, ${checkPlurality(mins, "minute")}` : ""
          }ago`;
        } else if (dtFormat === "h:m:s") {
          result = `${hrs}h${mins > 0 ? `:${mins}m` : ""} ago`;
        }
      } else if (dtType === "datetime") {
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);

        if (diffInHours < 24) {
          const hrs = Math.floor(diffInHours);
          const mins = Math.floor((diffInHours - hrs) * 60);

          result = `${checkPlurality(hrs, "hour")}${
            mins > 0 ? `, ${checkPlurality(mins, "minute")}` : ""
          }ago`;
        } else {
          const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
          const yearsAgo = Math.floor(diffInDays / 365);
          const monthsAgo = Math.floor((diffInDays % 365) / 30);

          if (yearsAgo > 0) {
            result = `${yearsAgo} year${yearsAgo > 1 ? "s" : ""} ago`;
          } else if (monthsAgo > 0) {
            result = `${monthsAgo} month${monthsAgo > 1 ? "s" : ""} ago`;
          } else {
            result = `${Math.floor(diffInDays)} day${Math.floor(diffInDays) > 1 ? "s" : ""} ago`;
          }
        }
      }
    } else {
      result = getFormattedDateOnly(dateStr, dtFormat === "dd-mm-yyyy");
    }

    return result + (suffix ?? "");
  } else {
    return new Date().toLocaleTimeString() + (suffix ?? "");
  }
}
