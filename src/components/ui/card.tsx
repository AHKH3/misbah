import styles from './card.module.css';

interface CardProps {
    interactive?: boolean;
    children: React.ReactNode;
    className?: string;
}

export function Card({ interactive = false, children, className }: CardProps) {
    const classes = [
        styles.card,
        interactive ? styles.interactive : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <div className={classes}>{children}</div>;
}
