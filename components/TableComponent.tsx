"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";

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
  // Load benchmark values from environment variables
  const [benchmarkWPM, setBenchmarkWPM] = useState(0);
  const [benchmarkAccuracy, setBenchmarkAccuracy] = useState(0);

  useEffect(() => {
    setBenchmarkWPM(Number(process.env.NEXT_PUBLIC_BENCHMARK_WPM) || 50);
    setBenchmarkAccuracy(
      Number(process.env.NEXT_PUBLIC_BENCHMARK_ACCURACY) || 90
    );
  }, []);

  // Function to generate PDF for a specific row
  const handlePrintOut = async (result: TestResult) => {
    const doc = new jsPDF();

    const { email, firstName } = result.participant;
    const completedAt = new Date(result.completedAt).toLocaleString();
    const passed =
      result.wpm >= benchmarkWPM && result.accuracy >= benchmarkAccuracy
        ? "✅ Passed"
        : "❌ Failed";

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Typing Test Result", 20, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Name: ${firstName}`, 20, 40);
    doc.text(`Email: ${email}`, 20, 50);
    doc.text(`Completed At: ${completedAt}`, 20, 60);
    doc.text(`WPM: ${result.wpm}`, 20, 70);
    doc.text(`Accuracy: ${result.accuracy}%`, 20, 80);
    doc.text(`Benchmark WPM: ${benchmarkWPM}`, 20, 90);
    doc.text(`Benchmark Accuracy: ${benchmarkAccuracy}%`, 20, 100);
    doc.text(`Status: ${passed}`, 20, 110);

    // Save the PDF with the user's email as the filename
    doc.save(`${email}-TypingTestResult.pdf`);
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 w-full">
      <Table className="w-full text-sm">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="text-left px-4 py-2">Email</TableHead>
            <TableHead className="text-left px-4 py-2">First Name</TableHead>
            <TableHead className="text-center px-4 py-2">WPM</TableHead>
            <TableHead className="text-center px-4 py-2">Accuracy</TableHead>
            <TableHead className="text-center px-4 py-2">Status</TableHead>
            <TableHead className="text-right px-4 py-2">Completed At</TableHead>
            <TableHead className="text-right px-4 py-2">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testResults.map((result: TestResult, index) => {
            const passed =
              result.wpm >= benchmarkWPM && result.accuracy >= benchmarkAccuracy
                ? "✅ Passed"
                : "❌ Failed";

            return (
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
                <TableCell className="px-4 py-2 text-center font-bold">
                  {passed}
                </TableCell>
                <TableCell className="px-4 py-2 text-right">
                  {new Date(result.completedAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false, // Ensures 24-hour format
                  })}
                </TableCell>
                <TableCell className="px-4 py-2 text-right">
                  <Button onClick={() => handlePrintOut(result)}>Print</Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableComponent;
