import { redirect } from 'next/navigation';

/**
 * /directory redirects to /find
 * This maintains backward compatibility while moving to the new route structure
 */
export default function DirectoryPage() {
  redirect('/find');
}
