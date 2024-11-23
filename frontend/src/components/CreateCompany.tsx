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
import axios from "axios";
import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { getAuthHeaders } from "@/store/profileState";

export function CompanyDrawer() {
    const { Authorization } = getAuthHeaders();
    const [name, setName] = useState("");
    const [logo, setLogo] = useState("");
    const [loading, setLoading] = useState(false);
    const handleCreateCompany = async () => {
      try {
        if (!name || !logo) {
          toast({
            title: "Error",
            description: "Please fill out all fields.",
            variant: "destructive",
          });
          return;
        }
        setLoading(true);
        await axios.post(
          `${WEB_URL}/api/v1/company/create`,
          { name: name, logo: logo },
          {
            headers: {
              Authorization,
            },
          }
        );
        setLoading(false);
  
        setLogo("");
        setName("");
        toast({
          title: "Success",
          description: "Company created successfully!",
        });
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Failed to create company.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
  
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="w-full">Create a new Company</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add a New Company</DrawerTitle>
            <DrawerDescription>
              Please fill out all fields to create a new company.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-2 flex flex-col gap-2 md:gap-4">
            <div>
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                placeholder="Enter company name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="logo-url">Company Logo URL</Label>
              <Input
                id="logo-url"
                placeholder="Enter logo URL (PNG format preferred)"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
              />
            </div>
          </div>
          <DrawerFooter>
            <Button
              onClick={handleCreateCompany}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Create Company..." : "Create Company"}
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