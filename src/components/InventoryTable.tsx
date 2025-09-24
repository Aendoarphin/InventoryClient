import { useState, useMemo, useCallback, useEffect } from "react";
import Loader from "./Loader";
import { IconTriangleFilled } from "@tabler/icons-react";

interface IPaginationProps {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  visiblePages: number[];
}

const Pagination = ({
  totalItems,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  visiblePages,
}: IPaginationProps) => {
  return (
    <div className="container w-full border border-muted first:border-b-0 last:border-t-0 mx-auto gap-2 h-min p-2 flex">
      <div className="mx-auto items-center flex gap-2">
        <button disabled={!canGoPrevious} onClick={onPrevious}>
          <IconTriangleFilled
            className="-rotate-90"
            size={15}
            opacity={canGoPrevious ? 1 : 0.2}
          />
        </button>
        <div className="flex flex-wrap gap-4 text-xs text-right">
          {visiblePages.map((pageNum) => (
            <button
              className={pageNum === currentPage ? "underline" : ""}
              onClick={() => onPageChange(pageNum)}
              key={pageNum}
            >
              {pageNum}
            </button>
          ))}
        </div>
        <button disabled={!canGoNext} onClick={onNext}>
          <IconTriangleFilled
            className="rotate-90"
            size={15}
            opacity={canGoNext ? 1 : 0.2}
          />
        </button>
      </div>
    </div>
  );
};

interface IInventoryTableProps {
  table: Record<string, any>[];
  count: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage?: number;
  pagesPerWindow?: number;
}

function InventoryTable({
  table,
  count,
  itemsPerPage = 20,
  pagesPerWindow = 20,
}: IInventoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Memoized calculations
  const { columns, totalPages, currentItems, visiblePages, canGoNext, canGoPrevious } = useMemo(() => {
    if (!table || table.length === 0) {
      return {
        columns: [],
        totalPages: 0,
        currentItems: [],
        visiblePages: [],
        canGoNext: false,
        canGoPrevious: false,
      };
    }

    const cols = Object.keys(table[0]);
    const totalPgs = Math.ceil(table.length / itemsPerPage);
    
    // Calc for current page items
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, table.length);
    const items = table.slice(startIndex, endIndex);
    
    // Calcs for visible page changes
    const currentWindow = Math.floor((currentPage - 1) / pagesPerWindow);
    const windowStart = currentWindow * pagesPerWindow + 1;
    const windowEnd = Math.min(windowStart + pagesPerWindow - 1, totalPgs);
    
    const visiblePgs = [];
    for (let i = windowStart; i <= windowEnd; i++) {
      visiblePgs.push(i);
    }
    
    return {
      columns: cols,
      totalPages: totalPgs,
      currentItems: items,
      visiblePages: visiblePgs,
      canGoNext: currentPage < totalPgs,
      canGoPrevious: currentPage > 1,
    };
  }, [table, currentPage, itemsPerPage, pagesPerWindow]);

  // Update count when current items change
  useEffect(() => {
    count(currentItems.length);
  }, [currentItems.length, count]);

  // Memoized event handlers
  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const handleNext = useCallback(() => {
    if (canGoNext) {
      setCurrentPage(prev => prev + 1);
    }
  }, [canGoNext]);

  const handlePrevious = useCallback(() => {
    if (canGoPrevious) {
      setCurrentPage(prev => prev - 1);
    }
  }, [canGoPrevious]);

  // If data changes then reset to first page
  useEffect(() => {
    setCurrentPage(1);
  }, [table]);

  // Loading state
  if (!table || table.length === 0) {
    return <Loader />;
  }

  const paginationProps = {
    totalItems: table.length,
    currentPage,
    totalPages,
    itemsPerPage,
    onPageChange: handlePageChange,
    onNext: handleNext,
    onPrevious: handlePrevious,
    canGoNext,
    canGoPrevious,
    visiblePages,
  };

  return (
    <div>
      <Pagination {...paginationProps} />
      
      <div className="container p-2 sm:p-4 mx-auto border border-muted">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-thead border border-muted">
              <tr className="text-left">
                {columns.map((name) => (
                  <th className="p-3" key={name}>
                    {name.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((row, rowIndex) => (
                <tr
                  key={`row-${(currentPage - 1) * itemsPerPage + rowIndex}`}
                  className="odd:bg-neutral-200 *:border *:border-muted"
                >
                  {columns.map((column) => (
                    <td key={`${rowIndex}-${column}`} className="p-3">
                      <p>{row[column]}</p>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <Pagination {...paginationProps} />
    </div>
  );
}

export default InventoryTable;