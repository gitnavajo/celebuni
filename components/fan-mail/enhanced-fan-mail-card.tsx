'use client';

import { FanMailExperienceTracker } from '@/components/fan-mail/fan-mail-experience-tracker';
import { Card } from '@/components/ui/card';

interface FanMailInfo {
  id: string;
  address: string;
  verified: boolean;
  source: string | null;
}

interface EnhancedFanMailCardProps {
  fanMailAddresses: FanMailInfo[];
  celebrityId: string;
  celebrityName: string;
}

export function EnhancedFanMailCard({
  fanMailAddresses,
  celebrityId,
  celebrityName,
}: EnhancedFanMailCardProps) {
  if (!fanMailAddresses || fanMailAddresses.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">📬 Fan Mail</h3>
        <p className="text-gray-400">No fan mail address available yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white">📬 Fan Mail</h3>
      
      {fanMailAddresses.map((address) => (
        <Card key={address.id} className="bg-gray-800 border-gray-700 p-6 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="font-mono text-gray-200 break-all">{address.address}</p>
              {address.verified && (
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                  ✓ Verified
                </span>
              )}
            </div>
            {address.source && (
              <p className="text-gray-500 text-sm">Source: {address.source}</p>
            )}
          </div>

          {/* Experience Tracker */}
          <FanMailExperienceTracker
            fanMailAddressId={address.id}
            celebrityId={celebrityId}
            address={address.address}
          />
        </Card>
      ))}
    </div>
  );
}
