import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy } from "react-feather";

interface CopyButtonProps {
  generatedLink: string;
  isCopied: boolean;
  handleCopy: () => void;
}

const CopyButton = ({ isCopied, handleCopy }: CopyButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className="p-2 bg-gray-100 hover:bg-gray-200"
          onClick={() => handleCopy()}
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
