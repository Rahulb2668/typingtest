import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy } from "react-feather";
import { Button } from "./ui/button";

interface CopyButtonProps {
  generatedLink: string;
  isCopied: boolean;
  handleCopy: () => void;
}

const CopyButton = ({
  generatedLink,
  isCopied,
  handleCopy,
}: CopyButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className="p-2 bg-gray-100 hover:bg-gray-200"
          onClick={() => navigator.clipboard.writeText(generatedLink)}
        >
          <span className="sr-only">Copy</span>
          <Copy />
        </TooltipTrigger>
        <TooltipContent>
          <p>{isCopied ? "Copied" : "Click to Copy"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CopyButton;
