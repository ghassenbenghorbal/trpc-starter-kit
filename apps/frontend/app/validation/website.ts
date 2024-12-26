import {
    createSearchParamsCache,
    parseAsArrayOf,
    parseAsInteger,
    parseAsString,
    parseAsStringEnum,
  } from "nuqs/server"
  import * as z from "zod"
  
  import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers"
import { Website } from "@/types/website"
  
  export const searchParamsCache = createSearchParamsCache({
    flags: parseAsArrayOf(z.enum(["advancedTable", "floatingBar"])).withDefault(
      []
    ),
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    sort: getSortingStateParser<Website>().withDefault([
      { id: "createdAt", desc: true },
    ]),
    name: parseAsString.withDefault(""),
    from: parseAsString.withDefault(""),
    to: parseAsString.withDefault(""),
    // advanced filter
    filters: getFiltersStateParser().withDefault([]),
    joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
  })
  
  export const createWebsiteSchema = z.object({
    name: z.string(),
  })
  
  export const updateWebsiteSchema = z.object({
    title: z.string().optional(),
  })
  
  export type GetWebsitesSchema = Awaited<ReturnType<typeof searchParamsCache.parse>>
  export type CreateWebsiteSchema = z.infer<typeof createWebsiteSchema>
  export type UpdateWebsiteSchema = z.infer<typeof updateWebsiteSchema>
  