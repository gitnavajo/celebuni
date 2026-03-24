'use client';

import { useState, useEffect } from 'react';
import { submitFanMailExperience, getFanMailExperiences } from '@/lib/tracking';
import type { FanMailExperience } from '@/types/extended';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FanMailExperienceTrackerProps {
  fanMailAddressId: string;
  celebrityId: string;
  address: string;
}

export function FanMailExperienceTracker({
  fanMailAddressId,
  celebrityId,
  address,
}: FanMailExperienceTrackerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [experiences, setExperiences] = useState<FanMailExperience[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    successRate: 0,
    avgDays: 0,
    avgRating: 0,
  });

  const [formData, setFormData] = useState({
    status: 'no_reply' as const,
    reply_rating: 5,
    date_sent: new Date().toISOString().split('T')[0],
    date_replied_at: '',
    notes: '',
  });

  // Load experiences on mount
  useEffect(() => {
    async function loadExperiences() {
      const data = await getFanMailExperiences(fanMailAddressId, 5);
      setExperiences(data);
      
      // Calculate stats
      if (data.length > 0) {
        const successCount = data.filter(e => e.received_reply).length;
        const replyRatings = data
          .filter(e => e.reply_rating)
          .map(e => e.reply_rating as number);
        const replyDays = data
          .filter(e => e.days_to_reply && e.days_to_reply > 0)
          .map(e => e.days_to_reply as number);

        setStats({
          total: data.length,
          successRate: Math.round((successCount / data.length) * 100),
          avgDays: replyDays.length > 0 
            ? Math.round(replyDays.reduce((a, b) => a + b) / replyDays.length)
            : 0,
          avgRating: replyRatings.length > 0
            ? (replyRatings.reduce((a, b) => a + b) / replyRatings.length).toFixed(1)
            : 0,
        });
      }
    }
    
    loadExperiences();
  }, [fanMailAddressId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await submitFanMailExperience(
      celebrityId,
      fanMailAddressId,
      {
        status: formData.status,
        reply_rating: formData.status === 'received_reply' ? formData.reply_rating : undefined,
        date_sent: formData.date_sent,
        date_replied_at: formData.date_replied_at || undefined,
        notes: formData.notes || undefined,
      }
    );

    if (result) {
      // Reset form and reload experiences
      setFormData({
        status: 'no_reply',
        reply_rating: 5,
        date_sent: new Date().toISOString().split('T')[0],
        date_replied_at: '',
        notes: '',
      });
      setIsOpen(false);

      // Reload experiences
      const data = await getFanMailExperiences(fanMailAddressId, 5);
      setExperiences(data);
    }

    setIsSubmitting(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received_reply':
        return 'bg-green-600';
      case 'no_reply':
        return 'bg-gray-600';
      case 'bounced':
        return 'bg-red-600';
      default:
        return 'bg-blue-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'received_reply':
        return '✓ Reply Received';
      case 'no_reply':
        return '✗ No Reply';
      case 'bounced':
        return '⚠ Bounced';
      default:
        return '❓ Other';
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      {stats.total > 0 && (
        <Card className="bg-gradient-to-r from-purple-900 to-pink-900 border-purple-700 p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-purple-200 text-sm">Community Reports</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div>
              <p className="text-purple-200 text-sm">Reply Rate</p>
              <p className="text-2xl font-bold text-green-400">{stats.successRate}%</p>
            </div>
            {stats.avgDays > 0 && (
              <div>
                <p className="text-purple-200 text-sm">Avg Time to Reply</p>
                <p className="text-2xl font-bold text-white">{stats.avgDays}d</p>
              </div>
            )}
            {stats.avgRating > 0 && (
              <div>
                <p className="text-purple-200 text-sm">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-400">⭐ {stats.avgRating}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Recent Experiences */}
      {experiences.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-200 text-sm">Recent Community Reports</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {experiences.map((exp) => (
              <div key={exp.id} className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                <Badge className={`${getStatusColor(exp.status)} text-white shrink-0 mt-1`}>
                  {getStatusLabel(exp.status)}
                </Badge>
                <div className="flex-1 min-w-0">
                  {exp.reply_rating && (
                    <p className="text-yellow-400 text-sm">{'⭐'.repeat(exp.reply_rating)}</p>
                  )}
                  {exp.days_to_reply && (
                    <p className="text-gray-300 text-sm">
                      Replied in {exp.days_to_reply} days
                    </p>
                  )}
                  {exp.notes && (
                    <p className="text-gray-400 text-sm italic">&quot;{exp.notes}&quot;</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Experience Button and Form */}
      <div className="space-y-3">
        {!isOpen ? (
          <Button
            onClick={() => setIsOpen(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Share Your Experience
          </Button>
        ) : (
          <Card className="bg-gray-800 border-gray-700 p-4 space-y-3">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Did you receive a reply?
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                >
                  <option value="received_reply">✓ Yes, I received a reply</option>
                  <option value="no_reply">✗ No, no reply yet</option>
                  <option value="bounced">⚠ Bounced/Invalid</option>
                  <option value="other">❓ Other</option>
                </select>
              </div>

              {formData.status === 'received_reply' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Rating (1-5 stars)
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, reply_rating: star })}
                          className={`text-2xl transition-transform ${
                            star <= formData.reply_rating ? 'text-yellow-400 scale-110' : 'text-gray-500'
                          }`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Date Replied
                    </label>
                    <input
                      type="date"
                      value={formData.date_replied_at}
                      onChange={(e) => setFormData({ ...formData, date_replied_at: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Date Sent
                </label>
                <input
                  type="date"
                  value={formData.date_sent}
                  onChange={(e) => setFormData({ ...formData, date_sent: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Share your experience..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Experience'}
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>

      {/* Privacy Notice */}
      <p className="text-xs text-gray-500 text-center">
        Your information is anonymized and used only to help other fans
      </p>
    </div>
  );
}
