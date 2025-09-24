import { IconInfoCircle } from "@tabler/icons-react";

const attentionItems = [
  {
    category: "Empty values in 'Items'",
    description: "Some fields are missing values; address this issue or mark as complete if those values are not needed.",
  },
  {
    category: "Empty values in 'Vendors'",
    description: "Some fields are missing values; address this issue or mark as complete if those values are not needed.",
  },
];

function NeedsAttention() {
  return (
    <div className="col-span-2 p-4 border border-muted shadow-md">
      <h2 className="flex justify-between items-center">
        Needs Attention{" "}
        <IconInfoCircle title="The following items must be addressed to maintain data integrity" />
      </h2>
      <div id="attention-items-container" className="border border-muted flex flex-column gap-2 max-h-96 overflow-y-scroll">
        {attentionItems.length > 0 ? (
          <table className="**:p-4 w-full">
            <thead className="border-b border-muted sticky top-0 bg-thead">
              <tr className="*:text-start">
                <th scope="col">Category</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody className="last:border-0">
              {attentionItems.map((item, index) => (
                <tr key={index} className="odd:bg-neutral-200">
                  <td scope="row">{item.category}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
              {}
            </tbody>
          </table>
        ) : (
          <h6 className="w-full text-muted text-center py-6">No Items</h6>
        )}
      </div>
    </div>
  );
}

export default NeedsAttention;
