import styles from './timeline.module.css';

export type TimelineItemType = 'education' | 'experience';

export interface TimelineItem {
    id: string;
    type: TimelineItemType;
    title: string;           // Role or Degree
    subtitle: string;        // Institution or Organization
    description?: string;    // Specialization or Notes
    startYear: number;
    endYear: number | null;  // null = ongoing
}

interface TimelineProps {
    items: TimelineItem[];
    emptyMessage?: string;
    onEdit?: (id: string) => void;
    onRemove?: (id: string) => void;
    editable?: boolean;
}

export function Timeline({
    items,
    emptyMessage = 'لا توجد عناصر',
    onEdit,
    onRemove,
    editable = false,
}: TimelineProps) {
    // Sort items by startYear (descending - newest first)
    const sortedItems = [...items].sort((a, b) => b.startYear - a.startYear);

    if (sortedItems.length === 0) {
        return (
            <div className={styles.empty}>
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className={styles.timeline}>
            {sortedItems.map((item, index) => (
                <div key={item.id} className={styles.item}>
                    {/* Connector line */}
                    {index < sortedItems.length - 1 && (
                        <div className={styles.connector} />
                    )}

                    {/* Icon */}
                    <div className={`${styles.icon} ${styles[item.type]}`}>
                        {item.type === 'education' ? 'ع' : 'خ'}
                    </div>

                    {/* Content Card */}
                    <div className={styles.card}>
                        <div className={styles.header}>
                            <span className={styles.date}>
                                {item.startYear}
                                {item.endYear ? ` - ${item.endYear}` : ' - حتى الآن'}
                            </span>
                            {editable && (
                                <div className={styles.actions}>
                                    {onEdit && (
                                        <button
                                            type="button"
                                            onClick={() => onEdit(item.id)}
                                            className={styles.actionBtn}
                                            aria-label="تعديل"
                                        >
                                            ✏️
                                        </button>
                                    )}
                                    {onRemove && (
                                        <button
                                            type="button"
                                            onClick={() => onRemove(item.id)}
                                            className={styles.actionBtn}
                                            aria-label="حذف"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        <h4 className={styles.title}>{item.title}</h4>
                        <p className={styles.subtitle}>{item.subtitle}</p>
                        {item.description && (
                            <p className={styles.description}>{item.description}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Helper to create TimelineItem from EducationEntry or ExperienceEntry
export function createTimelineItem(
    entry: {
        id: string;
        startYear: number;
        endYear: number | null;
    },
    type: TimelineItemType,
    title: string,
    subtitle: string,
    description?: string
): TimelineItem {
    return {
        id: entry.id,
        type,
        title,
        subtitle,
        description,
        startYear: entry.startYear,
        endYear: entry.endYear,
    };
}
