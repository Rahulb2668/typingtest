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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Participant Email</TableHead>
          <TableHead>Participant First Name</TableHead>
          <TableHead>WPM</TableHead>
          <TableHead>Accuracy</TableHead>
          <TableHead>Completed At</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {testResults.map((result: TestResult) => (
          <TableRow key={result._id}>
            <TableCell>{result.participant.email}</TableCell>
            <TableCell>{result.participant.firstName}</TableCell>
            <TableCell>{result.wpm}</TableCell>
            <TableCell>{result.accuracy}</TableCell>
            <TableCell>
              {new Date(result.completedAt).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableComponent;
