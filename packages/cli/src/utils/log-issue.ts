import pc from 'picocolors';
import { consola } from '../logger.js';

type IssueStatus = 'fixed' | 'fixable' | 'error';

interface IssueLogParams {
  status: IssueStatus;
  message: string;
  filepath: string;
}

const STATUS_CONFIG = {
  fixed: { badge: pc.bgGreen(' FIXED '), icon: pc.green('✔') },
  fixable: { badge: pc.bgYellow(' FIXABLE '), icon: pc.yellow('⚠') },
  error: { badge: '', icon: pc.red('✖') },
} as const;

export function logIssue(params: IssueLogParams): void {
  consola.log(
    [
      STATUS_CONFIG[params.status].badge,
      STATUS_CONFIG[params.status].icon,
      params.message,
      pc.dim(`(${params.filepath})`),
    ]
      .filter(Boolean)
      .join(' ')
  );
}
