"use client";

import { z } from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import formSchema from "@/lib/types/form-schema";
import useRouteOptimizationForm from "@/hooks/use-route-optimization-form";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Education } from "@/lib/types/route-optimization";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 12,
    padding: 30,
    lineHeight: 1.5,
    color: "#333",
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    color: "#4a4a4a",
    textTransform: "uppercase",
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
  section: {
    marginBottom: 12,
    padding: 10,
    borderBottom: "1px solid #ddd",
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  data: {
    fontSize: 12,
    color: "#333",
    marginLeft: 10,
  },
  category: {
    fontSize: 16,
    color: "#4a4a4a",
    marginTop: 15,
    textTransform: "uppercase",
    borderBottom: "1px solid #ddd",
    paddingBottom: 5,
    marginBottom: 10,
  },
});

// The Resume PDF structure
const Invoice = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Title */}
      <Text style={styles.title}>Resume</Text>

      {/* Profile Section */}
      <Text style={styles.category}>Profile</Text>
      <View style={styles.section}>
        <Text style={styles.data}>{data.profile}</Text>
      </View>

      {/* Name Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.data}>{data.name}</Text>
      </View>

      {/* Age Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Age</Text>
        <Text style={styles.data}>{data.age}</Text>
      </View>

      {/* College Section */}
      <View style={styles.section}>
        <Text style={styles.label}>College</Text>
        <Text style={styles.data}>{data.college}</Text>
      </View>

      {/* Branch Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Branch</Text>
        <Text style={styles.data}>{data.branch}</Text>
      </View>

      {/* Education Section */}
      <Text style={styles.category}>Education</Text>
      <View style={styles.section}>
        <Text style={styles.data}>{data.education}</Text>
      </View>

      {/* Experience */}
      <Text style={styles.category}>Experience</Text>
      <View style={styles.section}>
        <Text style={styles.data}>{data.experience}</Text>
      </View>

      {/* Major Projects */}
      <Text style={styles.category}>Major Projects</Text>
      <View style={styles.section}>
        <Text style={styles.data}>{data.projects}</Text>
      </View>

      {/* Achievements */}
      <Text style={styles.category}>Achievements</Text>
      <View style={styles.section}>
        <Text style={styles.data}>{data.achievements}</Text>
      </View>

      {/* Technical Skills */}
      <Text style={styles.category}>Technical Skills</Text>
      <View style={styles.section}>
        <Text style={styles.data}>{data.tskill}</Text>
      </View>

      {/* Soft Skills */}
      <Text style={styles.category}>Soft Skills</Text>
      <View style={styles.section}>
        <Text style={styles.data}>{data.sskill}</Text>
      </View>
    </Page>
  </Document>
);

export default function CreateResumeForm() {
  const form = useRouteOptimizationForm();
  const router = useRouter();

  function onSubmit(values) {
    console.log(values);
  }

  return (
    <div>
    <Form {...form}>
      <h1 className="text-xl font-bold px-4 pt-4">Resume Builder</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile</FormLabel>
              <FormControl>
                <Input placeholder="Brief profile description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input placeholder="Enter your age" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="college"
          render={({ field }) => (
            <FormItem>
              <FormLabel>College</FormLabel>
              <FormControl>
                <Input placeholder="Enter your college" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="branch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch</FormLabel>
              <FormControl>
                <Input placeholder="Enter your branch" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Education</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your education level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(Education).map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience</FormLabel>
              <FormControl>
                <Input placeholder="Work experience" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="projects"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Major Projects</FormLabel>
              <FormControl>
                <Input placeholder="Describe major projects" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="achievements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Achievements</FormLabel>
              <FormControl>
                <Input placeholder="List achievements" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tskill"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technical Skills</FormLabel>
              <FormControl>
                <Input placeholder="List technical skills" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sskill"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Soft Skills</FormLabel>
              <FormControl>
                <Input placeholder="List soft skills" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full justify-between">
          <PDFDownloadLink
            style={{ textDecoration: "none" }}
            className={buttonVariants({ variant: "default" })}
            document={<Invoice data={form.getValues()} />}
            fileName="Resume.pdf"
          >
            Generate PDF
          </PDFDownloadLink>
          <Button onClick={() => form.reset()} type="reset" variant="destructive">
            Clear
          </Button>
        </div>
      </form>
    </Form>
    </div>
  );
}