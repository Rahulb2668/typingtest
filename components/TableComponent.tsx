import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Participant {
  email: string;
  firstName: string;
}

interface TestResult {
  _id: string;
  participant: Participant;
  wpm: number;
  accuracy: number;
  completedAt: string;
}

const TableComponent = ({ testResults }: { testResults: TestResult[] }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 w-full">
      <Table className="w-full text-sm">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="text-left px-4 py-2">Email</TableHead>
            <TableHead className="text-left px-4 py-2">First Name</TableHead>
            <TableHead className="text-center px-4 py-2">WPM</TableHead>
            <TableHead className="text-center px-4 py-2">Accuracy</TableHead>
            <TableHead className="text-right px-4 py-2">Completed At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testResults.map((result: TestResult, index) => (
            <TableRow
              key={result._id}
              className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <TableCell className="px-4 py-2">
                {result.participant.email}
              </TableCell>
              <TableCell className="px-4 py-2">
                {result.participant.firstName}
              </TableCell>
              <TableCell className="px-4 py-2 text-center font-bold">
                {result.wpm}
              </TableCell>
              <TableCell className="px-4 py-2 text-center font-bold">
                {result.accuracy}%
              </TableCell>
              <TableCell className="px-4 py-2 text-right">
                {new Date(result.completedAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableComponent;
