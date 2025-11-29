// ChefIApp™ - Leaderboard Component (Optimized with React.memo)
// Ranking dos top funcionários por XP

import React, { useMemo, useCallback } from 'react';
import { Trophy, Crown, Medal, TrendingUp } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import { User } from '../lib/types';

interface LeaderboardProps {
  companyId: string;
  currentUserId?: string;
  limit?: number;
  showCurrentUser?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = React.memo(({
  companyId,
  currentUserId,
  limit = 10,
  showCurrentUser = true,
}) => {
  const { getLeaderboard, getUserRank, getUserById } = useAppStore();

  // Memoize expensive computations
  const topUsers = useMemo(() => getLeaderboard(companyId, limit), [companyId, limit, getLeaderboard]);
  const currentUser = useMemo(() => currentUserId ? getUserById(currentUserId) : null, [currentUserId, getUserById]);
  const currentUserRank = useMemo(() => currentUserId ? getUserRank(currentUserId, companyId) : 0, [currentUserId, companyId, getUserRank]);

  // Check if current user is in top 10
  const isCurrentUserInTop = useMemo(() => currentUserRank > 0 && currentUserRank <= limit, [currentUserRank, limit]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-gray-500 font-semibold">{rank}</div>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const UserRow = ({ user, rank, isCurrent = false }: { user: User; rank: number; isCurrent?: boolean }) => (
    <div
      className={`
        flex items-center gap-4 p-4 rounded-xl border-2 transition-all
        ${getRankBg(rank)}
        ${isCurrent ? 'ring-2 ring-blue-500' : ''}
      `}
    >
      {/* Rank Icon */}
      <div className="flex-shrink-0">
        {getRankIcon(rank)}
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0">
        {user.profilePhoto ? (
          <img
            src={user.profilePhoto}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 truncate">
            {user.name}
          </h3>
          {isCurrent && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              Você
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-600">Nível {user.level}</span>
          <span className="text-gray-300">•</span>
          <span className="text-sm text-gray-600">{user.sector}</span>
        </div>
      </div>

      {/* XP */}
      <div className="flex-shrink-0 text-right">
        <div className="font-bold text-lg text-gray-900">
          {user.xp.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500">XP</div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Ranking</h2>
            <p className="text-sm text-gray-500">Top {limit} funcionários</p>
          </div>
        </div>
        <TrendingUp className="w-5 h-5 text-green-500" />
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {topUsers.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum funcionário ainda</p>
          </div>
        ) : (
          topUsers.map((user, index) => (
            <UserRow
              key={user.id}
              user={user}
              rank={index + 1}
              isCurrent={user.id === currentUserId}
            />
          ))
        )}
      </div>

      {/* Current User (if not in top) */}
      {showCurrentUser && currentUser && !isCurrentUserInTop && currentUserRank > 0 && (
        <>
          <div className="my-4 border-t-2 border-dashed border-gray-200" />
          <div className="space-y-3">
            <UserRow user={currentUser} rank={currentUserRank} isCurrent />
          </div>
        </>
      )}
    </div>
  );
});

Leaderboard.displayName = 'Leaderboard';

export default Leaderboard;
