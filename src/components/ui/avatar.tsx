import Image from 'next/image';
import styles from './avatar.module.css';

type AvatarSize = 'small' | 'medium' | 'large';

interface AvatarProps {
    src?: string | null;
    alt: string;
    size?: AvatarSize;
    className?: string;
}

const sizePx: Record<AvatarSize, number> = {
    small: 40,
    medium: 64,
    large: 96,
};

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export function Avatar({ src, alt, size = 'medium', className }: AvatarProps) {
    const px = sizePx[size];

    if (!src) {
        // Fallback to initials
        const classes = [styles.avatar, styles.fallback, styles[size], className]
            .filter(Boolean)
            .join(' ');

        return (
            <div className={classes} aria-label={alt}>
                {getInitials(alt)}
            </div>
        );
    }

    const classes = [styles.avatar, styles[size], className]
        .filter(Boolean)
        .join(' ');

    return (
        <Image
            src={src}
            alt={alt}
            width={px}
            height={px}
            className={classes}
        />
    );
}
