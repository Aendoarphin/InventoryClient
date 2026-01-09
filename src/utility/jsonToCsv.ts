// Convert json to csv format and triggers a browser download

export function jsonToCsv(data: Record<string, any>[], filename = "data.csv", additionalHeaders: Record<string, any>[] = []) {
  if (!data || data.length === 0) {
    console.error("No data to convert.");
    return;
  }

  const headers = Object.keys(data[0]);

  const csvRows = [];
  csvRows.push(headers.join(",")); // Header row

  // Prepend additional custom header rows if provided
  if (additionalHeaders.length > 0) {
    additionalHeaders.forEach((header) => {
      csvRows.unshift(Object.values(header));
    });
  }

  for (const row of data) {
    const values = headers.map((header) => {
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
  const blob = new Blob([csvString.toUpperCase()], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}
