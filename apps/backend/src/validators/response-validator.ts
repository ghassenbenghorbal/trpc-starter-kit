import z from "zod";

export const responseValidator = z.object({
  message: z.string(),
});
