import { type ReactNode, type HTMLAttributes, useState, useMemo } from 'react';
import { Table, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { type TypographyTheme } from './typographyThemes';
import { getTableData } from './tableData';

export const TableWithToggle = ({
  children,
  theme,
  ...props
}: {
  children: ReactNode;
  theme: TypographyTheme;
} & HTMLAttributes<HTMLTableElement>) => {
  const { t } = useTranslation('common');
  const [viewMode, setViewMode] = useState<'table' | 'list'>(() =>
    window.matchMedia('(max-width: 639px)').matches ? 'list' : 'table'
  );
  const data = useMemo(() => getTableData(children), [children]);
  // Keep a native table if an unfamiliar structure cannot be converted safely.
  const showTable = viewMode === 'table' || !data.rows.length;

  return (
    <div className="mb-6 min-w-0">
      <div
        className="flex justify-end mb-4 gap-2"
        role="group"
        aria-label={t('tables.view')}
      >
        {(
          [
            { mode: 'table', Icon: Table },
            { mode: 'list', Icon: List },
          ] as const
        ).map(({ mode, Icon }) => (
          <button
            key={mode}
            type="button"
            onClick={() => setViewMode(mode)}
            aria-pressed={viewMode === mode}
            className={`min-h-11 px-3 py-2 text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-2 ${viewMode === mode ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            <Icon size={16} aria-hidden="true" />
            {t(`tables.${mode}`)}
          </button>
        ))}
      </div>
      {showTable ? (
        <div
          className="overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label={t('tables.view')}
        >
          <table
            className={`${theme.components.table} sticky-table`}
            {...props}
          >
            {children}
          </table>
        </div>
      ) : (
        <div className="space-y-4">
          {data.rows.map((row, index) => (
            <dl
              key={index}
              className="bg-white border border-gray-300 rounded-lg p-4 space-y-3"
            >
              {row.map((cell, column) => (
                <div
                  key={column}
                  className="grid gap-1 sm:grid-cols-3 sm:gap-3"
                >
                  <dt className="font-semibold text-gray-800 text-sm">
                    {data.headers[column] ?? t('tables.value')}
                  </dt>
                  <dd className="text-gray-700 text-sm sm:col-span-2 break-words">
                    {cell}
                  </dd>
                </div>
              ))}
            </dl>
          ))}
        </div>
      )}
    </div>
  );
};
