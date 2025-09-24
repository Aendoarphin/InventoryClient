import Loader from "./Loader";

function InventoryTable({
  table,
  tableName,
}: {
  table: object[];
  tableName: string;
}) {

  const columns = Object.keys({ ...table[0] });

  // continue here

  return (
    <>
    {table ? (
      <div className="container p-2 mx-auto sm:p-4 border border-muted shadow-md">
      <h2 className="mb-4 text-2xl font-semibold leading-tight">{tableName}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead className="bg-thead border border-muted">
            <tr className="text-left">
              {columns.map((name, index) => (
                <th className="p-3" key={index}>
                  {name.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row, index) => (
              <tr
                key={index}
                className="odd:bg-neutral-200 *:border *:border-muted"
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="p-3">
                    <p key={colIndex}>{row[column as keyof typeof row]}</p>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    ) : <Loader/>}
    </>
  );
}

export default InventoryTable;
