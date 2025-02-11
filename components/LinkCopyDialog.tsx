"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CopyButton from "./CopyButton";

export function LinkCopyDialog({ id }: { id: string }) {
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerateLink = async () => {
    try {
      // Make the request to your API route to generate the link
      const response = await fetch("/api/generatelink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      // Parse the response
      const data = await response.json();
      if (data.linkId) {
        // Set the generated link in the state
        const link = `https://yourapp.com/test/${data.linkId}`;
        setGeneratedLink(link);
      }
    } catch (error) {
      console.error("Error generating link:", error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleGenerateLink}>
          Generate Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        {generatedLink ? (
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                value={generatedLink} // Set the value to the generated link
                readOnly
              />
            </div>
            <CopyButton
              generatedLink={generatedLink}
              isCopied={isCopied}
              handleCopy={() => handleCopy()}
            />
          </div>
        ) : (
          <div>Generating Link</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
