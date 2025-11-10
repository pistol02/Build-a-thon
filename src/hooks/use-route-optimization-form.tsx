import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import formSchema from "@/lib/types/form-schema";
import { z } from "zod";
import { Education  } from "@/lib/types/route-optimization";

export type FormValues = z.infer<typeof formSchema>;

export default function useRouteOptimizationForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      age: "",
      college: "",
      branch: "",
      education: Education.InGraduation,
      recentjob: " ",
      tskill: "",
      sskill:"",
    },
  });

  return form;
}
