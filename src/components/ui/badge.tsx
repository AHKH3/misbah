import styles from './badge.module.css';

interface BadgeProps {
    children: React.ReactNode;
    className?: string;
}

export function Badge({ children, className }: BadgeProps) {
    const classes = [styles.badge, className].filter(Boolean).join(' ');
    return <span className={classes}>{children}</span>;
}

interface BadgeListProps {
    children: React.ReactNode;
    className?: string;
}

export function BadgeList({ children, className }: BadgeListProps) {
    const classes = [styles.badgeList, className].filter(Boolean).join(' ');
    return <div className={classes}>{children}</div>;
}
