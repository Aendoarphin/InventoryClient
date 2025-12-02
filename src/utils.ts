// Utility Functions

export function jsonToCsv(data: Record<string, any>[], filename = "data.csv") {
  if (!data || data.length === 0) {
    console.error("No data to convert.");
    return;
  }

  const headers = Object.keys(data[0]);

  const csvRows = [];
  csvRows.push(headers.join(",")); // Header row

  for (const row of data) {
    const values = headers.map(header => {
      let val = row[header];

      if (typeof val === "string") {
        val = val.replace(/"/g, '""');
        return `"${val}"`;
      }

      return val;
    });

    csvRows.push(values.join(","));
  }

  const csvString = csvRows.join("\n");

  // Trigger download
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}