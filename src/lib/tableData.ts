import {
  Children,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from 'react';

interface TableElementProps {
  children?: ReactNode;
  node?: { tagName?: string };
}

function findElements(
  children: ReactNode,
  tag: string
): ReactElement<TableElementProps>[] {
  return Children.toArray(children).flatMap(child => {
    if (!isValidElement<TableElementProps>(child)) return [];
    const name =
      child.props.node?.tagName ??
      (typeof child.type === 'string'
        ? child.type
        : String(child.key).match(/thead|tbody|tr|th|td/)?.[0]);
    return name === tag ? [child] : findElements(child.props.children, tag);
  });
}

export function getTableData(children: ReactNode) {
  const headers = findElements(children, 'th').map(cell => cell.props.children);
  const rows = findElements(children, 'tr')
    .map(row =>
      findElements(row.props.children, 'td').map(cell => cell.props.children)
    )
    .filter(cells => cells.length > 0);
  return { headers, rows };
}
