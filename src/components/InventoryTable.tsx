import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import Loader from "./Loader";
import { IconSearch, IconTriangleFilled } from "@tabler/icons-react";
import EditButtonSet from "./EditButtonSet";
import TableRecordForm from "./TableRecordForm";

interface IInventoryTableProps {
  table: Record<string, any>[];
  tableName: string;
  count: React.Dispatch<React.SetStateAction<number>>;
  recordsPerPage?: number;
  pagesPerWindow?: number;
  search: {
    searchValues: string;
    setSearchValues: React.Dispatch<React.SetStateAction<string>>;
  };
}

function InventoryTable({
  table,
  tableName,
  count,
  search,
}: IInventoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [focusedRow, setFocusedRow] = useState<number | null>(null);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(40);
  const [pagesPerWindow, setPagesPerWindow] = useState<number>(20);
  const [formIsVisible, setFormIsVisible] = useState(false);
  const [currentSearchValue, setCurrentSearchValue] = useState("");
  const tableRef = useRef<HTMLTableElement>(null);

  // Memoized calculations
  const {
    columns,
    totalPages,
    currentRecords,
    visiblePages,
    canGoNext,
    canGoPrevious,
  } = useMemo(() => {
    if (!table || table.length === 0) {
      return {
        columns: [],
        totalPages: 0,
        currentRecords: [],
        visiblePages: [],
        canGoNext: false,
        canGoPrevious: false,
      };
    }

    const cols = Object.keys(table[0]);
    const totalPgs = Math.ceil(table.length / recordsPerPage);

    // For current page changes
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, table.length);
    const records = table.slice(startIndex, endIndex);

    // For visible page changes
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
      currentRecords: records,
      visiblePages: visiblePgs,
      canGoNext: currentPage < totalPgs,
      canGoPrevious: currentPage > 1,
    };
  }, [table, currentPage, recordsPerPage, pagesPerWindow]);

  // Update count when current records change
  useEffect(() => {
    count(currentRecords.length);
  }, [currentRecords.length, count]);

  // Handle click outside table to clear selection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (tableRef.current && !tableRef.current.contains(target)) {
        setFocusedRow(null);
        setIsSelected(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Memoized event handlers
  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
      setFocusedRow(null);
      setIsSelected(false);
    },
    [totalPages]
  );

  const handleNext = useCallback(() => {
    if (canGoNext) {
      setCurrentPage((prev) => prev + 1);
      setFocusedRow(null);
      setIsSelected(false);
    }
  }, [canGoNext]);

  const handlePrevious = useCallback(() => {
    if (canGoPrevious) {
      setCurrentPage((prev) => prev - 1);
      setFocusedRow(null);
      setIsSelected(false);
    }
  }, [canGoPrevious]);

  const handleRowClick = useCallback(
    (
      rIndex: number,
      row: Record<string, any>,
      e: React.MouseEvent<HTMLTableRowElement, MouseEvent>
    ) => {
      setFocusedRow(rIndex);
      setIsSelected(true);

      // Get the first column name and use it to access the ID value
      const firstColumnName = Object.keys(row)[0];
      setSelectedRowId(row[firstColumnName]);
    },
    []
  );

  // If data changes then reset to first page
  useEffect(() => {
    setCurrentPage(1);
  }, [table]);

  // Loading state
  if (!table) {
    return <Loader />;
  }

  const paginationProps = {
    totalRecords: table.length,
    currentPage,
    totalPages,
    visibleRecords: { recordsPerPage, setRecordsPerPage },
    onPageChange: handlePageChange,
    onNext: handleNext,
    onPrevious: handlePrevious,
    canGoNext,
    canGoPrevious,
    visiblePages,
    editButtonSet: (
      <EditButtonSet
        tableName={tableName}
        isSelected={isSelected}
        rowId={{selectedRowId, setSelectedRowId}}
        form={{ formIsVisible, setFormIsVisible }}
      />
    ),
  };

  return (
    <div>
      {formIsVisible && (
        <TableRecordForm
          tableName={tableName}
          tableColumns={columns}
          form={{ formIsVisible, setFormIsVisible }}
          rowId={{ selectedRowId, setSelectedRowId }}
        />
      )}
      <Pagination {...paginationProps} />
      <div className="border border-muted border-b-0 *:border *:border-muted p-4 flex gap-2">
        <input
          onChange={(e) => setCurrentSearchValue(e.target.value)}
          placeholder="Search..."
          type="search"
          name="search"
          id="search"
          className="px-2 w-full"
        />
        <button
          onClick={() => search.setSearchValues(currentSearchValue)}
          className="p-1 shadow-lg active:shadow-none active:translate-y-0.5"
        >
          <IconSearch />
        </button>
      </div>
      <div className="p-2 sm:p-4 mx-auto border border-muted overflow-scroll max-h-[60vh]">
        <div>
          {table.length === 0 && <p>No Results</p>}
          <table ref={tableRef} className="min-w-full text-sm">
            <thead className="bg-thead border border-muted **:border-l-muted **:border-l">
              <tr className="text-left">
                {columns.map((name) => (
                  <th className="p-3" key={name}>
                    {name.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((row, rowIndex) => (
                <tr
                  id="table-row"
                  onClick={(e) => handleRowClick(rowIndex, row, e)}
                  key={`row-${(currentPage - 1) * recordsPerPage + rowIndex}`}
                  className={`odd:bg-neutral-200 *:border *:border-muted cursor-pointer ${focusedRow === rowIndex ? "border-2 border-secondary" : ""}`}
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
    </div>
  );
}

interface IPaginationProps {
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  visibleRecords: {
    recordsPerPage: number;
    setRecordsPerPage: React.Dispatch<React.SetStateAction<number>>;
  };
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  visiblePages: number[];
  editButtonSet?: React.ReactNode;
}

const Pagination = ({
  totalRecords,
  currentPage,
  totalPages,
  visibleRecords: { recordsPerPage, setRecordsPerPage },
  onPageChange,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  visiblePages,
  editButtonSet,
}: IPaginationProps) => {
  return (
    <div className="w-full border border-muted first:border-b-0 last:border-t-0 mx-auto gap-2 h-min p-4 flex justify-between items-center">
      <div>
        <label htmlFor="visible-rows">Show Records: </label>
        <select
          onChange={(e) => setRecordsPerPage(Number(e.target.value))}
          className="border border-muted"
          name="visible-rows"
          id="visible-rows"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <div className="items-center flex gap-2 mx-auto">
        <button disabled={!canGoPrevious} onClick={onPrevious}>
          <IconTriangleFilled
            className="-rotate-90"
            size={15}
            opacity={canGoPrevious ? 1 : 0.2}
          />
        </button>
        &nbsp;
        <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-right *:hover:border-b">
          {visiblePages.map((pageNum) => (
            <button
              className={
                pageNum === currentPage
                  ? "font-bold border-b border-b-primary"
                  : ""
              }
              onClick={() => onPageChange(pageNum)}
              key={pageNum}
            >
              {pageNum}
            </button>
          ))}
        </div>
        &nbsp;
        <button disabled={!canGoNext} onClick={onNext}>
          <IconTriangleFilled
            className="rotate-90"
            size={15}
            opacity={canGoNext ? 1 : 0.2}
          />
        </button>
      </div>
      {editButtonSet && <div>{editButtonSet}</div>}
      <br />
    </div>
  );
};

export default InventoryTable;
