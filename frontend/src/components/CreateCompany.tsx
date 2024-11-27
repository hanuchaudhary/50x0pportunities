import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { WEB_URL } from "@/Config";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAuthHeaders } from "@/store/profileState";
import { useCompaniesStore } from "@/store/companiesState";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Building, Plus, Loader2 } from 'lucide-react';
import {companyValidation} from '@hanuchaudhary/job'

export function CompanyDrawer() {
  const { Authorization } = getAuthHeaders();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { fetchCompanies } = useCompaniesStore();

  const form = useForm<z.infer<typeof companyValidation>>({
    resolver: zodResolver(companyValidation),
    defaultValues: {
      name: "",
      logo: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof companyValidation>) => {
    try {
      setLoading(true);
      await axios.post(
        `${WEB_URL}/api/v1/company/create`,
        values,
        {
          headers: {
            Authorization,
          },
        }
      );
      setLoading(false);
      fetchCompanies();
      form.reset();
      setOpen(false);
      toast({
        title: "Success",
        description: "Company created successfully!",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create company.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> Create a new Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-2xl font-bold text-primary flex items-center">
            <Building className="mr-2 h-6 w-6" />
            Add a New Company
          </DrawerTitle>
          <DrawerDescription>
            Fill out the form below to create a new company.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormDescription>
                    The official name of the company.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Logo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/logo.png" {...field} />
                  </FormControl>
                  <FormDescription>
                    A direct link to the company's logo image (PNG format preferred).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DrawerFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Company'
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
