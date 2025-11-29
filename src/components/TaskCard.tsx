// ChefIApp™ - Task Card Component
// Card de tarefa com todos os estados e ações (Optimized with React.memo)

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Play, CheckCircle, Clock, Zap, Camera, Loader2, AlertCircle } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../lib/types';
import { formatDuration, formatRelativeTime } from '../lib/utils';

interface TaskCardProps {
  task: Task;
  onStart?: (taskId: string) => void;
  onComplete?: (taskId: string, photo: File) => void;
  canStart?: boolean;
  canStartReason?: string;
  isLoading?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = React.memo(({
  task,
  onStart,
  onComplete,
  canStart = true,
  canStartReason,
  isLoading = false,
}) => {
  const [duration, setDuration] = useState(0);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memoize status checks
  const isInProgress = useMemo(() => task.status === TaskStatus.IN_PROGRESS, [task.status]);
  const isDone = useMemo(() => task.status === TaskStatus.DONE, [task.status]);
  const isPending = useMemo(() => task.status === TaskStatus.PENDING, [task.status]);

  // Update duration for in-progress tasks
  useEffect(() => {
    if (!isInProgress || !task.startedAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const start = task.startedAt!.getTime();
      setDuration(Math.floor((now - start) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isInProgress, task.startedAt]);

  // Memoize priority color calculation
  const priorityColor = useMemo(() => {
    switch (task.priority) {
      case TaskPriority.HIGH:
        return 'border-red-300 bg-red-50';
      case TaskPriority.MEDIUM:
        return 'border-yellow-300 bg-yellow-50';
      case TaskPriority.LOW:
        return 'border-green-300 bg-green-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  }, [task.priority]);

  // Memoize priority badge
  const priorityBadge = useMemo(() => {
    const colors = {
      [TaskPriority.HIGH]: 'bg-red-100 text-red-700',
      [TaskPriority.MEDIUM]: 'bg-yellow-100 text-yellow-700',
      [TaskPriority.LOW]: 'bg-green-100 text-green-700',
    };

    const labels = {
      [TaskPriority.HIGH]: 'Alta',
      [TaskPriority.MEDIUM]: 'Média',
      [TaskPriority.LOW]: 'Baixa',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[task.priority]}`}>
        {labels[task.priority]}
      </span>
    );
  }, [task.priority]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedPhoto(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleComplete = () => {
    if (!selectedPhoto) return;
    onComplete?.(task.id, selectedPhoto);
    setShowPhotoUpload(false);
    setSelectedPhoto(null);
    setPhotoPreview(null);
  };

  // Photo Upload Modal
  const PhotoUploadModal = () => (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setShowPhotoUpload(false)}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4">Foto-Prova da Tarefa</h3>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoSelect}
          className="hidden"
        />

        {photoPreview ? (
          <div className="mb-4">
            <img src={photoPreview} alt="Preview" className="w-full h-64 object-cover rounded-xl" />
            <button
              onClick={() => {
                setSelectedPhoto(null);
                setPhotoPreview(null);
              }}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              Tirar outra foto
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-blue-500 transition-colors"
          >
            <Camera className="w-12 h-12 text-gray-400" />
            <span className="text-gray-600">Tirar Foto</span>
          </button>
        )}

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setShowPhotoUpload(false)}
            className="flex-1 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleComplete}
            disabled={!selectedPhoto || isLoading}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Enviando...' : 'Completar'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={`rounded-2xl border-2 p-5 transition-all ${getPriorityColor()}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-1">{task.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
          </div>
          {getPriorityBadge()}
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-blue-600">+{task.xpReward} XP</span>
          </div>
          {task.createdAt && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatRelativeTime(task.createdAt)}</span>
            </div>
          )}
        </div>

        {/* Timer (if in progress) */}
        {isInProgress && (
          <div className="bg-blue-100 rounded-xl p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700 font-medium">Tempo decorrido:</span>
              <span className="text-xl font-bold font-mono text-blue-900">
                {formatDuration(duration)}
              </span>
            </div>
            {duration < 300 && (
              <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>Bônus de velocidade disponível (&lt;5min = +20 XP)</span>
              </div>
            )}
          </div>
        )}

        {/* Completed Info */}
        {isDone && task.completedAt && (
          <div className="bg-green-100 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-700 font-medium">
                Concluída {formatRelativeTime(task.completedAt)}
              </span>
            </div>
            {task.duration && (
              <div className="mt-1 text-xs text-green-600">
                Tempo: {formatDuration(task.duration)}
              </div>
            )}
          </div>
        )}

        {/* Cannot Start Warning */}
        {!canStart && isPending && (
          <div className="bg-orange-100 border border-orange-300 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-orange-700">{canStartReason}</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        {isPending && (
          <button
            onClick={() => onStart?.(task.id)}
            disabled={!canStart || isLoading}
            className={`
              w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2
              transition-all disabled:opacity-50 disabled:cursor-not-allowed
              ${canStart
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Iniciando...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>INICIAR TAREFA</span>
              </>
            )}
          </button>
        )}

        {isInProgress && (
          <button
            onClick={() => setShowPhotoUpload(true)}
            disabled={isLoading}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <Camera className="w-5 h-5" />
            <span>COMPLETAR TAREFA</span>
          </button>
        )}

        {isDone && task.photoProof && (
          <button
            onClick={() => window.open(task.photoProof!, '_blank')}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 flex items-center justify-center gap-2 transition-all"
          >
            <Camera className="w-5 h-5" />
            <span>VER FOTO-PROVA</span>
          </button>
        )}
      </div>

      {/* Photo Upload Modal */}
      {showPhotoUpload && <PhotoUploadModal />}
    </>
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;
