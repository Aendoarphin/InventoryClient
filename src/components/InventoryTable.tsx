import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import Loader from "./Loader";
import {
  IconFileTypeCsv,
  IconSearch,
  IconTriangleFilled,
} from "@tabler/icons-react";
import EditButtonSet from "./EditButtonSet";
import TableRecordForm from "./TableRecordForm";
import { jsonToCsv } from "@/utils";

interface IInventoryTableProps {
  table: Record<string, any>[];
  tableName: string;
  count: React.Dispatch<
    React.SetStateAction<{ start: number; end: number; total: number }>
  >;
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [focusedRow, setFocusedRow] = useState<number | null>(null);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<number>(0);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);
  const [pagesPerWindow] = useState<number>(20);
  const [formIsVisible, setFormIsVisible] = useState<boolean>(false);
  const [currentSearchValue, setCurrentSearchValue] = useState<string>("");
  const [requestType, setRequestType] = useState<string>("");
  const tableRef = useRef<HTMLTableElement>(null);

  // Memoized calculations
  const {
    columns,
    totalPages,
    currentRecords,
    visiblePages,
    canGoNext,
    canGoPrevious,
    recordRange,
  } = useMemo(() => {
    if (!table || table.length === 0) {
      return {
        columns: [],
        totalPages: 0,
        currentRecords: [],
        visiblePages: [],
        canGoNext: false,
        canGoPrevious: false,
        recordRange: { start: 0, end: 0, total: 0 },
      };
    }

    const cols = Object.keys(table[0]);
    const totalPgs = Math.ceil(table.length / recordsPerPage);

    // For current page changes
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, table.length);
    const records = table.slice(startIndex, endIndex);

    // Calculate record range
    const start = table.length > 0 ? startIndex + 1 : 0;
    const end = endIndex;
    const total = table.length;

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
      recordRange: { start, end, total },
    };
  }, [table, currentPage, recordsPerPage, pagesPerWindow]);

  // Update count when current records change
  useEffect(() => {
    count(recordRange);
  }, [recordRange, count]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        tableRef.current &&
        !tableRef.current.contains(target) &&
        !formIsVisible
      ) {
        setFocusedRow(null);
        setIsSelected(false);
        setSelectedRowId(0);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [formIsVisible]);

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
    (rIndex: number, row: Record<string, any>) => {
      setFocusedRow(rIndex);
      setIsSelected(true);

      // Get the first column name and use it to access the ID value
      const firstColumnName = Object.keys(row)[0];
      setSelectedRowId(row[firstColumnName]);
    },
    [selectedRowId, focusedRow]
  );

  // If data changes then reset to first page
  useEffect(() => {
    setCurrentPage(1);
  }, [table]);

  // Reset to first page when records per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [recordsPerPage]);

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
        rowId={{ selectedRowId, setSelectedRowId }}
        form={{ formIsVisible, setFormIsVisible }}
        request={{ requestType, setRequestType }}
      />
    ),
    pagesPerWindow,
  };

  const handleExportData = () => {
    jsonToCsv(
      table,
      `${tableName}Data${new Date().toISOString().split("T")[0].split("-").join("")}.csv`
    );
  };

  return (
    <div>
      {formIsVisible && (
        <TableRecordForm
          requestType={requestType}
          tableName={tableName}
          tableColumns={columns}
          form={{ formIsVisible, setFormIsVisible }}
          rowId={{ selectedRowId, setSelectedRowId }}
        />
      )}
      <Pagination {...paginationProps} />
      {/* Options container: Search, Export CSV */}
      <div className="border border-muted border-b-0 *:border *:border-muted p-4 flex gap-2">
        <input
          onChange={(e) => setCurrentSearchValue(e.target.value.trim())}
          placeholder="Search..."
          type="search"
          name="search"
          id="search"
          className="px-2 w-full"
        />
        <button
          onClick={() => search.setSearchValues(currentSearchValue)}
          className="p-1 interactive"
          disabled={!currentSearchValue.replace(/\s/g, "").length}
        >
          <IconSearch />
        </button>
        <span></span>
        <button
          onClick={handleExportData}
          title="Export data to CSV"
          className="p-1 interactive"
        >
          <IconFileTypeCsv />
        </button>
      </div>
      {/* Table Contents */}
      <div className="mx-auto border border-muted overflow-scroll max-h-[60vh]">
        <div>
          {table.length === 0 && <p>No Results</p>}
          <table ref={tableRef} className="min-w-full text-sm">
            <thead className="bg-thead border border-muted **:border-l-muted **:border-l *:text-left *:sticky *:top-0 **:bg-secondary text-white">
              <tr>
                {columns.map((name) => (
                  <th
                    className="p-3 first-letter:uppercase text-nowrap"
                    key={name}
                  >
                    {name.replace(/(?<!^)([A-Z])/g, " $1")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((row, rowIndex) => (
                <tr
                  id="table-row"
                  onClick={() => handleRowClick(rowIndex, row)}
                  key={`row-${(currentPage - 1) * recordsPerPage + rowIndex}`}
                  className={`odd:bg-neutral-200 *:border *:border-muted ${rowIndex === focusedRow ? "outline-info outline-4" : ""}`}
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
  pagesPerWindow: number;
}

const Pagination = ({
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
  pagesPerWindow,
}: IPaginationProps) => {
  return (
    <div className="w-full border border-muted first:border-b-0 last:border-t-0 mx-auto gap-2 h-min p-4 flex justify-between items-center">
      <div>
        <label htmlFor="visible-rows">Show Records: </label>
        <select
          value={recordsPerPage}
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
        {visiblePages[0] !== 1 && (
          <button
            onClick={() => onPageChange(visiblePages[0] - 1)}
            className="hover:border-b"
          >
            ...
          </button>
        )}
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
        {visiblePages.length === pagesPerWindow &&
          visiblePages[visiblePages.length - 1] < totalPages && (
            <button
              onClick={() =>
                onPageChange(visiblePages[visiblePages.length - 1] + 1)
              }
              className="hover:border-b"
            >
              ...
            </button>
          )}
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
