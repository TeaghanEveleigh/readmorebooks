'use client';

import React from 'react';
import { BookOpen, Users, TrendingUp, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Activity, LibraryBook } from '@/lib/types';

// Mock data - replace with actual API calls
const mockActivities: Activity[] = [
  {
    id: '1',
    user: { id: '1', name: 'John Doe' },
    type: 'review',
    book: { 
      id: 'book1', 
      title: 'The Great Gatsby',
      authors: ['F. Scott Fitzgerald']
    },
    rating: 5,
    review: 'An absolute masterpiece! Fitzgerald\'s prose is simply beautiful.',
    likes: 12,
    comments: 3,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    user: { id: '2', name: 'Jane Smith' },
    type: 'finished',
    book: { 
      id: 'book2', 
      title: '1984',
      authors: ['George Orwell']
    },
    likes: 8,
    comments: 1,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const mockCurrentlyReading: LibraryBook[] = [
  {
    id: 'book3',
    volumeInfo: {
      title: 'Dune',
      authors: ['Frank Herbert'],
      publishedDate: '1965',
      imageLinks: { thumbnail: '/placeholder-book.png' }
    },
    dateAdded: new Date().toISOString(),
    readingStatus: 'currently-reading',
    progress: 45
  }
];

function StatsCard({ icon: Icon, title, value, subtitle }: {
  icon: React.ElementType;
  title: string;
  value: string | number;
  subtitle?: string;
}) {
  return (
    <Card className="text-center">
      <Icon className="mx-auto mb-3 h-8 w-8" style={{ color: 'var(--accent)' }} />
      <h3 className="mb-2 font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
      {subtitle && (
        <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>
      )}
    </Card>
  );
}

function ActivityFeed({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="mx-auto mb-4 h-12 w-12 text-[var(--text-muted)]" />
        <h3 className="mb-2 text-xl font-semibold">No activity yet</h3>
        <p className="text-[var(--text-secondary)]">
          Start reading and reviewing books to see activity from friends!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activities.map((activity) => (
        <Card key={activity.id}>
          <div className="flex gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white font-semibold">
              {activity.user.name.charAt(0)}
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-1">
                <span className="font-medium text-[var(--text-primary)]">
                  {activity.user.name}
                </span>
                <span className="text-sm text-[var(--text-secondary)]">
                  {activity.type === 'review' ? 'reviewed' : 
                   activity.type === 'finished' ? 'finished reading' : 
                   'started reading'}
                </span>
                <span className="font-medium text-[var(--text-primary)]">
                  {activity.book.title}
                </span>
              </div>
              
              {activity.rating && (
                <div className="mb-2 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < activity.rating! ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
              
              {activity.review && (
                <p className="mb-3 text-[var(--text-secondary)]">{activity.review}</p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                <span>{activity.likes} likes</span>
                <span>{activity.comments} comments</span>
                <span className="ml-auto text-[var(--text-muted)]">
                  {new Date(activity.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-[var(--text-primary)]">
          Welcome to BookKeeper
        </h1>
        <p className="text-lg text-[var(--text-secondary)]">
          Track your reading journey and connect with fellow book lovers
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatsCard
          icon={BookOpen}
          title="Books Read"
          value={42}
          subtitle="This year"
        />
        <StatsCard
          icon={TrendingUp}
          title="Reading Goal"
          value="28/50"
          subtitle="56% complete"
        />
        <StatsCard
          icon={Users}
          title="Friends"
          value={15}
          subtitle="Following"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-6 text-2xl font-semibold text-[var(--text-primary)]">
            Friend Activity
          </h2>
          <ActivityFeed activities={mockActivities} />
        </div>
        
        <div>
          <h2 className="mb-6 text-xl font-semibold text-[var(--text-primary)]">
            Currently Reading
          </h2>
          <div className="space-y-4">
            {mockCurrentlyReading.map((book) => (
              <Card key={book.id}>
                <h3 className="mb-2 font-medium">{book.volumeInfo.title}</h3>
                <p className="mb-3 text-sm text-[var(--text-secondary)]">
                  {book.volumeInfo.authors?.join(', ')}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{book.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-secondary)]">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${book.progress}%`,
                        backgroundColor: 'var(--accent)'
                      }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}