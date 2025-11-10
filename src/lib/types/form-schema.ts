import { z } from "zod";
import { Education  } from "./route-optimization";

const stringSchema = z.string().min(1, { message: "Field is required." });
const numberSchema = z
  .number()
  .min(0, { message: "Value must be a positive number." });
const progressSchema = z
  .number()
  .min(0)
  .max(1, { message: "Progress must be between 0 and 1." });

const formSchema = z.object({
  title: stringSchema,
  id: stringSchema,
  age: stringSchema,
  college: stringSchema,
  branch: stringSchema,
  recentjob: stringSchema,
  tskill: stringSchema,
  sskill: stringSchema,
  education: z.nativeEnum(Education, {
    errorMap: () => ({ message: "Invalid education." }),
  }),
  journey: z.object({
    from: stringSchema,
    to: stringSchema,
    progress: progressSchema,
    route: z
      .array(z.tuple([z.number(), z.number()]))
      .nonempty({ message: "Route must contain at least one point." }),
  }),
  vehicle: z.object({
    company: stringSchema,
    model: stringSchema,
    space: numberSchema,
    volume: numberSchema,
    weight: numberSchema,
  }),
  order: z.object({
    title: stringSchema,
    quantity: numberSchema,
    weight: numberSchema,
    volume: numberSchema,
    payment: stringSchema,
  }),
  history: z
    .array(
      z.object({
        id: stringSchema,
        age: stringSchema,
        recentjob: stringSchema,
        tskill: stringSchema,
        sskill: stringSchema,
        status: stringSchema,
        method: stringSchema,
        amount: numberSchema,
      }),
    )
    .nonempty({ message: "History must contain at least one entry." }),
  checkpoints: z
    .array(
      z.object({
        title: stringSchema,
        progress: progressSchema,
        date: z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid date format.",
        }),
      }),
    )
    .nonempty({ message: "Checkpoints must contain at least one entry." }),
  price: numberSchema,
});

export default formSchema;
